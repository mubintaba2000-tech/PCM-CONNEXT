import React, { useState, useEffect, useRef } from 'react';
import { User, SalesCustomer, Project, Warranty } from '../types';
import { MessageSquare, Send, Bot, User as UserIcon, Calendar, CheckCircle, Clock, Search, Filter, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, doc, setDoc, updateDoc, onSnapshot, serverTimestamp, orderBy, getDoc, addDoc } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', errInfo);
  throw new Error(JSON.stringify(errInfo));
}

export const SalesCRMScreen = ({ user, onBack }: { user: User, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'leads' | 'projects' | 'warranties'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'สวัสดีครับ! ผมคือ PCM Sales Assistant พร้อมช่วยติดตามลูกค้า อัปเดตงาน และแจ้งเตือนประกันครับ คุณต้องการให้ช่วยดูข้อมูลอะไรวันนี้ครับ?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Data states
  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  
  // Realtime Listeners
  useEffect(() => {
    if (!auth.currentUser) {
      console.warn("User is not signed in to Firebase. Skipping Firestore listeners.");
      return;
    }

    // 1. Customers
    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data: SalesCustomer[] = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id } as SalesCustomer);
      });
      setCustomers(data);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'customers');
      } catch (e: any) {
        console.warn("Caught Firestore Error:", e.message);
      }
    });

    // 2. Projects (from standard projects collection)
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data: Project[] = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id } as Project);
      });
      setProjects(data);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'projects');
      } catch (e: any) {
        console.warn("Caught Firestore Error:", e.message);
      }
    });

    // 3. Warranties
    const unsubWarranties = onSnapshot(collection(db, 'warranties'), (snapshot) => {
      const data: Warranty[] = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id } as Warranty);
      });
      setWarranties(data);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'warranties');
      } catch (e: any) {
        console.warn("Caught Firestore Error:", e.message);
      }
    });

    return () => {
      unsubCustomers();
      unsubProjects();
      unsubWarranties();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const queryText = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: queryText }]);
    setIsTyping(true);

    try {
      const apikey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apikey) {
         throw new Error("ไม่มี API Key");
      }
      const ai = new GoogleGenAI({ apiKey: apikey });
      
      const systemInstruction = `
You are an intelligent sales assistant for a Thai construction company's Sales Department.
You help the sales team (1–3 people) manage customer leads, track active construction projects, monitor deadlines, and manage post-delivery warranties.

The system uses Firebase Firestore (shared with the Engineer/Owner app).
Always respond in Thai unless the user writes in English first.
All dates use Thai Buddhist Era (พ.ศ.) in format DD/MM/YYYY — e.g. ${new Date().toLocaleDateString('th-TH')}.

---

## INTEREST LEVEL — แสดงผลด้วยสี
- 'low'    -> 🔴 ต่ำ
- 'medium' -> 🟡 กลาง
- 'high'   -> 🟢 สูง

## CUSTOMER STATUS — แสดงผลด้วยสี
- 'new'            -> 🟡 ลูกค้าใหม่
- 'scheduled'      -> 🟣 นัดเข้าออฟฟิศ
- 'waiting'        -> 🔵 รอตัดสินใจ
- 'deposited'      -> 🟢 วางมัดจำแล้ว
- 'not_interested' -> 🔴 ไม่สนใจ

## RESPONSE RULES
1. ยืนยันก่อนบันทึกเสมอ — แสดงข้อมูลที่จะ write และรอ "ใช่" ก่อน (เช่น ถามว่าจะบันทึก freebies นี้ใช่ไหม)
2. ลบข้อมูลต้องยืนยัน 2 ครั้ง
3. เมื่อแสดงสถานะโครงการ ให้บอกขั้นตอนถัดไปด้วยเสมอ
4. ตอบสั้น กระชับ เหมาะกับ mobile และ desktop
5. แสดง emoji สีทุกครั้งที่แสดง status / interestLevel
6. วันที่ทั้งหมด: DD/MM/YYYY (พ.ศ.)
7. ข้อมูลใน projects collection = read-only สำหรับฝ่ายขาย อย่าพยายาม write
8. ถ้าข้อมูลไม่ครบ ให้ถามก่อน ไม่เดาเอง
9. notes และ freebies = free text รับข้อความอะไรก็ได้ ไม่จำกัดความยาว
10. warranty entries ห้าม overwrite — ต้อง append เสมอ ยกเว้นผู้ใช้ระบุชัดว่าต้องการแก้ entry ไหน

## MODULE 1 — SALES FOLLOW-UP
1. เพิ่มลูกค้าใหม่ -> ยืนยันข้อมูลก่อนบันทึกเสมอ ค่าเริ่มต้น: status='new', interestLevel='medium'
2. อัปเดตการติดต่อ -> เพิ่มใน contactLogs (round 1–4) พร้อมวันที่ + หมายเหตุ
3. เปลี่ยน status / interestLevel -> แสดง emoji สีทุกครั้ง
4. ค้นหา / กรอง -> ตาม status หรือ interestLevel
5. แจ้งเตือน -> ลูกค้าที่ lastContactedAt > 7 วัน และ status ≠ 'deposited' / 'not_interested'
6. บันทึก/แก้ไข notes (อื่นๆ) — รับข้อความอิสระ ไม่จำกัดความยาว
7. บันทึก/แก้ไข freebies (ของแถม) — รับข้อความอิสระ ไม่จำกัดความยาว

เมื่อลูกค้าเปลี่ยน status เป็น 'deposited':
- ถามว่า projectId ของวิศวกรคือ document ไหน (หรือสร้าง project ใหม่)
- บันทึก projectId ลงใน customers document
- แจ้งให้วิศวกรทราบเพื่อ link กลับ

## MODULE 2 — Project Tracking
แจ้งเตือน Deadlines (เตือนล่วงหน้า X วัน): 
ออกแบบเสร็จ (ล่วงหน้า 7 วัน), เขียนแบบก่อสร้างเสร็จ (ล่วงหน้า 7 วัน), ยื่นขออนุญาตก่อสร้าง (ล่วงหน้า 14 วัน คำนวณจาก permitSubmittedDate + 45 วัน), ใบอนุญาตก่อสร้างหมดอายุ (ล่วงหน้า 14 วัน), ไฟฟ้าชั่วคราว (ล่วงหน้า 14 วัน), ประปาชั่วคราว (ล่วงหน้า 14 วัน), ระยะเวลาก่อสร้าง (ล่วงหน้า 14 วัน)
🚨 = เกินกำหนดแล้ว | ⚠️ = ใกล้ครบกำหนด

## MODULE 3 — Warranties
- struct: 20 ปี, roof: 5 ปี, arch: 1 ปี
- เพิ่ม entry การแจ้งซ่อมใหม่ (append ไม่ overwrite) ให้เป็น format: {no: เลขครั้ง, date: 'DD/MM/YYYY', note: 'รายละเอียด'} (ใช้ 
addWarrantyEntry)
- แก้ไข entry ที่มีอยู่ (ใช้ updateWarrantyEntry และระบุ no ที่จะแก้)
- แจ้งเตือนประกันใกล้หมดอายุล่วงหน้า 30 วัน

## DAILY ALERT SUMMARY
เมื่อผู้ใช้พิมพ์ "มีอะไรแจ้งเตือนบ้าง" ให้แสดง DAILY ALERT SUMMARY:
📅 สรุปการแจ้งเตือน — [วันที่วันนี้]

🚨 เกินกำหนดแล้ว:
- [ชื่อโครงการ] — [รายการ] เกินมาแล้ว XX วัน

⚠️ ใกล้ครบกำหนด (ภายใน 14 วัน):
- [ชื่อโครงการ] — [รายการ] ครบกำหนด DD/MM/YYYY (อีก X วัน)

🏠 ประกันใกล้หมดอายุ (ภายใน 30 วัน):
- [ชื่อโครงการ] — [ประเภทประกัน] หมด DD/MM/YYYY

📋 ลูกค้าที่ยังไม่ได้ติดตาม > 7 วัน:
- คุณ [ชื่อ] ([สถานะ]) — ติดต่อล่าสุดเมื่อ X วันก่อน

หากไม่มีการแจ้งเตือน -> "✅ ไม่มีการแจ้งเตือนวันนี้"

DATA CONTEXT:
Customers: ${JSON.stringify(customers)}
Projects: ${JSON.stringify(projects.slice(0, 10))}
Warranties: ${JSON.stringify(warranties)}
      `;

      const tools = [{
        functionDeclarations: [
          {
            name: "createCustomer",
            description: "เพิ่ม document ใหม่ใน customers collection",
            parameters: {
              type: "OBJECT",
              required: ["fullName"],
              properties: {
                fullName: { type: "STRING" },
                nickname: { type: "STRING" },
                phone: { type: "STRING" },
                requirements: { type: "STRING" },
                interestLevel: { type: "STRING" }
              }
            }
          },
          {
            name: "updateCustomer",
            description: "แก้ไข document ใน customers collection (เช่นเปลี่ยน status เป็น deposited)",
            parameters: {
              type: "OBJECT",
              required: ["customerId", "fields"],
              properties: {
                customerId: { type: "STRING" },
                fields: { type: "OBJECT" }
              }
            }
          },
          {
            name: "createWarranty",
            description: "สร้าง warranty document (ประกันผลงาน) ใหม่เมื่อส่งมอบโครงการแล้ว",
            parameters: {
              type: "OBJECT",
              required: ["projectId", "customerId", "deliveryDate"],
              properties: {
                projectId: { type: "STRING" },
                customerId: { type: "STRING" },
                deliveryDate: { type: "STRING" }
              }
            }
          },
          {
            name: "updateWarranty",
            description: "อัปเดต warranty document (notes, collectedDate)",
            parameters: {
              type: "OBJECT",
              required: ["projectId", "fields"],
              properties: {
                projectId: { type: "STRING" },
                fields: { type: "OBJECT" }
              }
            }
          },
          {
            name: "addWarrantyEntry",
            description: "เพิ่ม entry การแจ้งซ่อมใหม่เข้าไปใน warranty (append ไม่ overwrite) รองรับหลายครั้ง",
            parameters: {
              type: "OBJECT",
              required: ["projectId", "warrantyType", "date", "note"],
              properties: {
                projectId: { type: "STRING" },
                warrantyType: { type: "STRING", description: "ประเภทประกัน (struct, roof, arch)" },
                date: { type: "STRING", description: "DD/MM/YYYY" },
                note: { type: "STRING", description: "รายละเอียดการแจ้งซ่อม" }
              }
            }
          },
          {
            name: "updateWarrantyEntry",
            description: "แก้ไข entry การแจ้งซ่อมที่มีอยู่แล้ว โดยระบุ no ที่ต้องการแก้",
            parameters: {
              type: "OBJECT",
              required: ["projectId", "warrantyType", "entryNo", "fields"],
              properties: {
                projectId: { type: "STRING" },
                warrantyType: { type: "STRING", description: "ประเภทประกัน (struct, roof, arch)" },
                entryNo: { type: "INTEGER", description: "เลขครั้งที่ต้องการแก้ไข" },
                fields: { type: "OBJECT", description: "fields ที่แก้ เช่น {note: '...', date: '...'}" }
              }
            }
          }
        ]
      }];

      const chat = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: { 
           systemInstruction: systemInstruction, 
           temperature: 0.2,
           tools: tools as any
        }
      });

      const response = await chat.sendMessage({ message: queryText });

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
           if (call.name === 'createCustomer') {
               const args = call.args as any;
               await addDoc(collection(db, 'customers'), {
                  ...args,
                  status: 'new',
                  interestLevel: args.interestLevel || 'medium',
                  createdBy: user.name,
                  createdAt: serverTimestamp()
               });
               toast.success('เพิ่มลูกค้าสำเร็จแล้ว');
               const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
               setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'ดำเนินการเรียบร้อยครับ' }]);
           } else if (call.name === 'updateCustomer') {
               const args = call.args as any;
               if (args.customerId) {
                   await updateDoc(doc(db, 'customers', args.customerId), args.fields);
                   toast.success('อัปเดตข้อมูลลูกค้าสำเร็จแล้ว');
                   const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
                   setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'อัปเดตเรียบร้อยครับ' }]);
               }
           } else if (call.name === 'createWarranty') {
               const args = call.args as any;
               
               // Calculate dates as requested by user
               // +20 years (struct), +5 years (roof), +1 year (arch)
               const delParts = args.deliveryDate.split('/');
               const dd = parseInt(delParts[0], 10);
               const mm = parseInt(delParts[1], 10);
               const yyyy = parseInt(delParts[2], 10); // Buddhist Era
               
               const createExpDate = (addY: number) => {
                  return `${dd < 10 ? '0'+dd : dd}/${mm < 10 ? '0'+mm : mm}/${yyyy + addY}`;
               };

               await setDoc(doc(db, 'warranties', args.projectId), {
                  projectId: args.projectId,
                  customerId: args.customerId,
                  deliveryDate: args.deliveryDate,
                  struct: { collectedDate: '', expiresDate: createExpDate(20), notes: '', entries: [] },
                  roof: { collectedDate: '', expiresDate: createExpDate(5), notes: '', entries: [] },
                  arch: { collectedDate: '', expiresDate: createExpDate(1), notes: '', entries: [] },
                  createdAt: serverTimestamp()
               });
               toast.success('สร้างระบบประกันผลงานสำเร็จแล้ว');
               const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
               setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'สร้างการรับประกันเรียบร้อยครับ' }]);
           } else if (call.name === 'updateWarranty') {
               const args = call.args as any;
               if (args.projectId) {
                   await updateDoc(doc(db, 'warranties', args.projectId), args.fields);
                   toast.success('อัปเดตข้อมูลประกันสำเร็จแล้ว');
                   const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
                   setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'อัปเดตเรียบร้อยครับ' }]);
               }
           } else if (call.name === 'addWarrantyEntry') {
               const args = call.args as any;
               const { projectId, warrantyType, date, note } = args;
               if (projectId && warrantyType) {
                   const warrantyDoc = await getDoc(doc(db, 'warranties', projectId));
                   if (warrantyDoc.exists()) {
                       const data = warrantyDoc.data();
                       const entries = data[warrantyType]?.entries || [];
                       const newEntry = { no: entries.length + 1, date, note };
                       await updateDoc(doc(db, 'warranties', projectId), {
                           [`${warrantyType}.entries`]: [...entries, newEntry]
                       });
                       toast.success('อัปเดตการแจ้งซ่อมสำเร็จ');
                       const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
                       setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'เพิ่มการแจ้งซ่อมเรียบร้อยครับ' }]);
                   } else {
                       const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: false, error: 'ไม่พบประกัน' } } }] as any });
                       setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'ไม่พบข้อมูลโครงการประกันที่อ้างถึงครับ' }]);
                   }
               }
           } else if (call.name === 'updateWarrantyEntry') {
               const args = call.args as any;
               const { projectId, warrantyType, entryNo, fields } = args;
               if (projectId && warrantyType && entryNo) {
                   const warrantyDoc = await getDoc(doc(db, 'warranties', projectId));
                   if (warrantyDoc.exists()) {
                       const data = warrantyDoc.data();
                       const entries = data[warrantyType]?.entries || [];
                       const index = entries.findIndex((e: any) => e.no === entryNo);
                       if (index > -1) {
                           entries[index] = { ...entries[index], ...fields };
                           await updateDoc(doc(db, 'warranties', projectId), {
                               [`${warrantyType}.entries`]: entries
                           });
                           toast.success('แก้ไขข้อมูลการแจ้งซ่อมสำเร็จ');
                           const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: true } } }] as any });
                           setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'แก้ไขเรียบร้อยครับ' }]);
                       } else {
                           const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: false, error: 'ไม่พบรายการที่ต้องการแก้ไข' } } }] as any });
                           setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'ไม่พบลำดับการแจ้งซ่อมที่ระบุครับ' }]);
                       }
                   } else {
                       const secondResponse = await chat.sendMessage({ message: [{ functionResponse: { name: call.name, response: { success: false, error: 'ไม่พบประกัน' } } }] as any });
                       setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'ไม่พบข้อมูลโครงการประกันที่อ้างถึงครับ' }]);
                   }
               }
           }
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || 'ไม่มีการตอบสนองจากระบบ' }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      
      {/* Sidebar Navigation */}
      <div className="w-20 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors z-10 shrink-0">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
           <h2 className="font-bold text-gray-800 dark:text-gray-200 hidden md:flex items-center gap-2">
             <Bot className="text-brand-500" />
             Sales CRM
           </h2>
           <Bot className="text-brand-500 mx-auto md:hidden" />
        </div>
        <nav className="flex-1 p-2 space-y-1 mt-2">
          <NavItem id="chat" icon={MessageSquare} label="AI CRM ชาต" active={activeTab==='chat'} onClick={() => setActiveTab('chat')} />
          <NavItem id="leads" icon={UserIcon} label="ติดตามลูกค้า" active={activeTab==='leads'} onClick={() => setActiveTab('leads')} />
          <NavItem id="projects" icon={Calendar} label="ติดตามโครงการ" active={activeTab==='projects'} onClick={() => setActiveTab('projects')} />
          <NavItem id="warranties" icon={AlertTriangle} label="ประกันผลงาน" active={activeTab==='warranties'} onClick={() => setActiveTab('warranties')} />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
             <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 flex justify-between items-center">
                 <h2 className="font-bold text-gray-800 dark:text-gray-200">PCM AI Sales Assistant</h2>
                 <span className="text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-1 rounded-full">Gemini 3.1 Pro Powered</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'model' && (
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mr-2 mt-1">
                        <Bot size={16} className="text-brand-600" />
                      </div>
                    )}
                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${m.role === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm markdown-body text-sm'}`} style={{ whiteSpace: m.role === 'user' ? 'pre-wrap' : 'normal' }}>
                       {m.role === 'user' ? m.text : <div dangerouslySetInnerHTML={{ __html: formatMarkdown(m.text) }} />}
                    </div>
                 </div>
               ))}
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mr-2 mt-1">
                       <Bot size={16} className="text-brand-600" />
                     </div>
                     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
                     </div>
                  </div>
               )}
               <div ref={chatEndRef} />
             </div>
             <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
               <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                  <input
                     type="text"
                     value={inputMessage}
                     onChange={e => setInputMessage(e.target.value)}
                     placeholder="แจ้ง AI เพื่อจัดการลูกค้า ดูแจ้งเตือน หรือรายงานต่างๆ..."
                     className="flex-1 pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-sm dark:text-gray-100"
                     disabled={isTyping}
                  />
                  <button 
                     type="submit" 
                     disabled={isTyping || !inputMessage.trim()}
                     className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:text-gray-500 text-white w-10 flex items-center justify-center rounded-lg transition-colors"
                  >
                     <Send size={18} className={isTyping ? 'animate-pulse' : ''}/>
                  </button>
               </form>
             </div>
          </div>
        )}

        {activeTab === 'leads' && (
           <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">รายชื่อลูกค้า (Leads)</h2>
                 <button onClick={() => { setActiveTab('chat'); setInputMessage('ฉันต้องการเพิ่มลูกค้าใหม่ ชื่อ: \nเบอร์ติดต่อ: \nความต้องการ: '); }} className="bg-brand-600 hover:bg-brand-700 transition-colors px-4 py-2 text-white rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> เพิ่มลูกค้า (ผ่าน AI)</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {customers.map(c => (
                     <div key={c.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col pt-5">
                       <div className="flex justify-between items-start mb-3">
                         <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">{c.fullName} <span className="text-sm font-normal text-gray-500">({c.nickname})</span></h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{c.phone}</p>
                         </div>
                         <div className="flex flex-col items-end gap-1.5">
                            <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{c.status === 'new' ? '🟡 ลูกค้าใหม่' : c.status === 'scheduled' ? '🟣 นัดเข้าออฟฟิศ' : c.status === 'waiting' ? '🔵 รอตัดสินใจ' : c.status === 'deposited' ? '🟢 วางมัดจำแล้ว' : '🔴 ไม่สนใจ'}</span>
                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">ความสนใจ: {c.interestLevel === 'low' ? '🔴 ต่ำ' : c.interestLevel === 'medium' ? '🟡 กลาง' : '🟢 สูง'}</span>
                         </div>
                       </div>
                       <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-4 flex-1 space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3"><strong>ความต้องการ:</strong> {c.requirements}</p>
                          {c.notes && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"><strong>อื่นๆ (Notes):</strong> {c.notes}</p>}
                          {c.freebies && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"><strong>ของแถม:</strong> {c.freebies}</p>}
                       </div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                          ติดต่อล่าสุด: {c.lastContactedAt && c.lastContactedAt.seconds ? new Date(c.lastContactedAt.seconds * 1000).toLocaleDateString('th-TH') : '-'}
                       </div>
                    </div>
                 ))}
                 {customers.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">กรุณาพิมพ์เพิ่มลูกค้าใหม่ในช่องแชท AI เช่น "เพิ่มลูกค้าใหม่ คุณสมชาย ใจดี เบอร์ 0812345678"</div>}
              </div>
           </div>
        )}

        {activeTab === 'projects' && (
           <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">โครงการของลูกค้า (Deposited)</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* Only deposited customers have standard projects tracked here */}
                 {customers.filter(c => c.status === 'deposited').map(c => {
                    const linkedProj = projects.find(p => p.id === c.projectId);
                    return (
                     <div key={c.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                       <h3 className="font-bold text-brand-600 dark:text-brand-400 text-lg mb-1">{linkedProj ? `บ้านคุณ ${c.fullName} (${c.nickname})` : 'ยังไม่ระบุ/ผูกโครงการ'}</h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">เบอร์ติดต่อ: {c.phone}</p>
                       
                       {linkedProj ? (
                          <div className="space-y-3 mt-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                             <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700"><span className="text-sm text-gray-500 dark:text-gray-400">สถานะ:</span> <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{linkedProj.status}</span></div>
                             <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700"><span className="text-sm text-gray-500 dark:text-gray-400">ที่ตั้ง:</span> <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{linkedProj.location}</span></div>
                             <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700"><span className="text-sm text-gray-500 dark:text-gray-400">เริ่ม/ส่งมอบ:</span> <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{linkedProj.constructionStart || linkedProj.start} - {linkedProj.constructionEnd || linkedProj.end}</span></div>
                          </div>
                       ) : (
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl text-sm mt-2 border border-orange-100 dark:border-orange-800/50">รอผูก Project ID จากระบบวิศวกร</div>
                       )}
                    </div>
                 )})}
                 {customers.filter(c => c.status === 'deposited').length === 0 && <div className="col-span-full text-center py-20 text-gray-500">ยังไม่มีลูกค้าที่วางมัดจำและเริ่มโครงการ</div>}
              </div>
           </div>
        )}

        {activeTab === 'warranties' && (
           <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">ระบบประกันผลงาน (Warranties)</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {warranties.map(w => {
                    const c = customers.find(cust => cust.id === w.customerId);
                    const p = projects.find(proj => proj.id === w.projectId);
                    return (
                        <div key={w.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-brand-600 dark:text-brand-400 text-lg mb-1">{p ? p.name : 'Unknown Project'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">ลูกค้า: {c ? c.fullName : 'Unknown Customer'}</p>
                                </div>
                                <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-brand-600/20">วันส่งมอบ: {w.deliveryDate}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <WarrantySection title="โครงสร้าง (20 ปี)" data={w.struct} />
                                <WarrantySection title="หลังคา (5 ปี)" data={w.roof} />
                                <WarrantySection title="สถาปัตยกรรม (1 ปี)" data={w.arch} />
                            </div>
                        </div>
                    );
                 })}
                 {warranties.length === 0 && <div className="text-center py-20 text-gray-500">รอส่งมอบงาน (Delivered) เพื่อเริ่มระยะประกันผลงาน</div>}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const WarrantySection = ({ title, data }: { title: string, data: any }) => {
   const isExpired = () => {
      if (!data.expiresDate) return false;
      const parts = data.expiresDate.split('/');
      // Convert to AD for comparison
      const expDate = new Date(parseInt(parts[2], 10) - 543, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return expDate < new Date();
   };
   
   const expired = isExpired();

   return (
      <div className={`p-4 rounded-xl border ${expired ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10' : 'border-gray-100 bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800/50'}`}>
         <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${expired ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>{expired ? 'หมดประกัน' : 'คุ้มครอง'}</span>
         </div>
         <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-3">
             <p>วันหมดอายุ: <strong className="text-gray-700 dark:text-gray-300">{data.expiresDate || '-'}</strong></p>
             <p>วันที่เก็บเงิน: {data.collectedDate || 'ยังไม่ระบุ'}</p>
         </div>
         {data.notes && (
             <div className="mt-3 text-xs bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 line-clamp-3 leading-relaxed">
                 <span className="font-semibold text-gray-700 dark:text-gray-300">อื่นๆ:</span> {data.notes}
             </div>
         )}
         {data.entries && data.entries.length > 0 && (
             <div className="mt-3 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                 <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">ประวัติการแจ้งซ่อม:</p>
                 {data.entries.map((entry: any, i: number) => (
                    <div key={i} className="text-xs bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="font-semibold text-brand-600 dark:text-brand-400 mb-1">ครั้งที่ {entry.no} ({entry.date})</div>
                        <div className="text-gray-600 dark:text-gray-400">{entry.note}</div>
                    </div>
                 ))}
             </div>
         )}
      </div>
   );
};

const NavItem = ({ id, icon: Icon, label, active, onClick }: { id: string, icon: any, label: string, active: boolean, onClick: () => void }) => {
   return (
      <button 
         onClick={onClick}
         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
      >
         <Icon size={20} className={active ? '' : 'opacity-70'} />
         <span className="hidden md:inline">{label}</span>
      </button>
   );
};

// Simple markdown formatter
function formatMarkdown(text: string) {
   if (!text) return '';
   let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
   return formatted;
}
