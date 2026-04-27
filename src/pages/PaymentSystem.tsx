import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Plus, Printer, ArrowLeft, FileText, CheckCircle, Clock, Trash2, X, Send, Image as ImageIcon, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import THBText from 'thai-baht-text';

export const PaymentSystemScreen = ({ user, onBack }: { user: User, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'view'>('list');
    const [docType, setDocType] = useState('PCF');
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [emailTarget, setEmailTarget] = useState('accounting@company.com');

    const generateEmailDraft = (doc: any) => {
        let subject = `จัดส่งเอกสาร ${doc.docTitle} [${doc.id}]`;
        if (doc.site) subject += ` หน่วยงาน: ${doc.site}`;

        let body = `เรียน ฝ่ายบัญชี (pichayamongkol.ac)\n${doc.docType === 'ACR' ? 'และ PM พิจารณาอนุมัติ\n' : ''}\n`;
        
        switch (doc.docType) {
            case 'ACR':
                body += `ขอเบิกล่วงหน้า (Advance Cash Request) เพื่อนำไปไว้ใช้จ่าย\nรายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            case 'DCW':
                body += `ขอเบิกเงินค่าแรงช่าง DC รายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            case 'DC-BATCH':
                body += `ขอส่งชุดเอกสารเบิกค่าแรงช่าง DC งวด ${doc.batchDetails?.payPeriod || ''}\nรายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            case 'SCW':
                body += `ขอส่งเอกสารเบิกค่างวดรับเหมา งวดที่ ${doc.contractDetails?.installmentNo || '-'}/${doc.contractDetails?.totalInstallments || '-'} รายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            case 'BOQ-PROG':
                body += `ขอส่งรายงานวิเคราะห์ความคืบหน้าโครงการ ณ วันที่ ${doc.boqDetails?.asOf || doc.date}\nรายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            case 'PCF':
                body += `ขอส่งใบสำคัญจ่าย / ขอนำส่งบิลเบิกค่าใช้จ่าย รายละเอียดตามเอกสารแนบ ${doc.id}\n`;
                break;
            default:
                body += `ขอส่งเอกสาร ${doc.docTitle} รายละเอียดตามเอกสารแนบ ${doc.id}\n`;
        }
        
        body += `\n`;
        
        if (doc.docType !== 'BOQ-PROG') {
            body += `ผู้รับเงิน   : ${doc.recipient}\n`;
            if (doc.paymentDetail) {
                body += `ธนาคาร      : ${doc.paymentDetail}\n`;
            }
        }
        
        const amountDisplay = doc.docType === 'ACR' ? doc.calculated.netTotalWithBuffer : doc.calculated.netAmount;
        body += `ยอดสุทธิ    : ${amountDisplay.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท\n`;
        body += `               (${THBText(amountDisplay)})\n\n`;
        
        body += `เอกสารแนบ:\n`;
        body += ` 1. ${doc.id}.pdf\n`;
        if (doc.docType === 'DCW' || doc.docType === 'DC-BATCH') {
            body += ` 2. transfer_list.pdf\n`;
            body += ` 3. id_cards.pdf\n`;
        } else if (doc.docType === 'SCW' || doc.docType === 'BOQ-PROG') {
            body += ` 2. photos_and_progress.pdf\n`;
            if (doc.docType === 'SCW') body += ` 3. invoice.pdf (ถ้ามี)\n`;
        } else if (doc.docType === 'PCF') {
            body += ` 2. receipts_original.pdf\n`;
        }

        body += `\nกรุณาโอนเงินภายในวันที่ ${new Date(new Date(doc.date).getTime() + (3 * 24 * 60 * 60 * 1000)).toLocaleDateString('th-TH')}\n\n`;
        
        body += `ด้วยความเคารพ\n${doc.createdBy} (เท็น) ตำแหน่ง SE\nโทร 094-434-2324\n`;
        
        return `หัวข้อ: ${subject}\n\n${body}`;
    };

    // pre-populate with the PCF receipt and ACR
    const [documents, setDocuments] = useState<any[]>([
        {
            id: "BOQ-6804-001",
            docType: "BOQ-PROG",
            docTitle: "รายงานวิเคราะห์ความคืบหน้าโครงการ (BOQ Progress)",
            date: "2025-04-26",
            recipient: "นาย ณัฐกิจ เหมจินดา",
            items: [],
            taxInfo: {
                hasVat: false,
                whtType: "none",
                applyRetention: false
            },
            calculated: {
                subtotal: 6422.10,
                vat: 0,
                totalAfterVat: 6422.10,
                whtAmt: 0,
                retentionAmt: 0,
                netAmount: 6422.10
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "-",
            remarks: "ณ วันที่ 26 เมษายน 2568",
            site: "หน่วยงานบางบอน / บ้านคุณกิม",
            boqDetails: {
                project: "บ้านคุณกิม",
                asOf: "26 เมษายน 2568",
                contractor: "นาย ณัฐกิจ เหมจินดา",
                contractValue: 337949.54,
                boqItems: [
                    { itemNo: "1", desc: "งานสีภายใน ชั้น 2", unit: "ตร.ม.", qtyTotal: 162.37, rate: 40, qtyDone: 162.37, pctDone: 100 },
                    { itemNo: "2", desc: "งานสกิมภายใน ชั้น 2", unit: "ตร.ม.", qtyTotal: 162.37, rate: 50, qtyDone: 162.37, pctDone: 100 },
                    { itemNo: "3", desc: "งานสีฝ้าภายใน ชั้น 2", unit: "ตร.ม.", qtyTotal: 57.72, rate: 40, qtyDone: 57.72, pctDone: 100 },
                    { itemNo: "4", desc: "งานสีภายใน ชั้น 1", unit: "ตร.ม.", qtyTotal: 250, rate: 40, qtyDone: 125, pctDone: 50 },
                    { itemNo: "5", desc: "งานสกิมภายใน ชั้น 1", unit: "ตร.ม.", qtyTotal: 250, rate: 50, qtyDone: 0, pctDone: 0 },
                    { itemNo: "6", desc: "งานอื่นๆ ตามสัญญา", unit: "LS", qtyTotal: 1, rate: 298527.44, qtyDone: 0, pctDone: 0 }
                ],
                paidInstallments: [
                    { installment: 1, amountPaid: 15500.00, date: "10/04/2568" }
                ],
                progressTotalAmount: 21922.10,
                progressTotalPct: 6.48,
                remainingAmount: 316027.44
            }
        },
        {
            id: "SCW-6804-001",
            docType: "SCW",
            docTitle: "ใบตักเตือน/ใบเบิกงวดงานผู้รับเหมา (Subcontractor Payment)",
            date: "2025-04-26",
            recipient: "นาย ณัฐกิจ เหมจินดา",
            items: [
                { desc: "งานสีภายใน ชั้น 2 (รองพื้น 1 รอบ ทาสีจริง 3 รอบ) (162.37 ตร.ม. @40 บ. เบิกงวดนี้ 50%)", amount: 3247.40 },
                { desc: "งานสกิมภายใน ชั้น 2 (162.37 ตร.ม. @50 บ. เบิกงวดนี้ 50%)", amount: 4059.25 },
                { desc: "งานสีฝ้าภายใน ชั้น 2 (57.72 ตร.ม. @40 บ. เบิกงวดนี้ 50%)", amount: 1154.40 }
            ],
            taxInfo: {
                hasVat: false,
                whtType: "3%",
                applyRetention: true
            },
            calculated: {
                subtotal: 8461.05,
                vat: 0,
                totalAfterVat: 8461.05,
                whtAmt: 253.83,
                retentionAmt: 423.05,
                netAmount: 7784.17
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "โอนธนาคาร กสิกรไทย 185-3-73944-4",
            remarks: "ชำระ 2 งวด งวดละ 50% ตามสัญญา",
            site: "หน่วยงานบางบอน / บ้านคุณกิม ชั้น 1+3 ค่าแรงช่าง",
            contractDetails: {
                contractorType: "บุคคลธรรมดา",
                idOrTax: "1102170009849",
                contractRef: "สัญญาวันที่ 01/01/2568",
                contractTotal: 337949.54,
                totalInstallments: 6,
                installmentNo: 2,
                installmentDesc: "งานสกิมภายใน + สีภายใน ชั้น 2 เสร็จ 50%",
                claimDate: "26/04/2568",
                workCompleteDate: "25/04/2568",
                qcApprovedBy: "SE ณัฐกิจ"
            }
        },
        {
            id: "DCW-6804-BATCH-001",
            docType: "DC-BATCH",
            docTitle: "สรุปเบิกจ่ายค่าแรงช่าง DC (Batch Payment)",
            date: "2025-04-26",
            recipient: "จ่ายรวมหลายบุคคล (Batch)",
            items: [
                { desc: "นาย สมชาย ทาสีดี (รวมหักภาษี 3%)", amount: 14175.79 },
                { desc: "นาย มานะ ฉาบดี (รวมหักภาษี 3%)", amount: 15270.23 }
            ],
            taxInfo: {
                hasVat: false,
                whtType: "none", // Since we calculated per person before summing
                applyRetention: false
            },
            calculated: {
                subtotal: 29446.02,
                vat: 0,
                totalAfterVat: 29446.02,
                whtAmt: 0,
                retentionAmt: 0,
                netAmount: 29446.02
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "ดูรายการโอนแนบท้าย (Transfer List)",
            remarks: "งวด 16-25 เมษายน 2568",
            site: "หน่วยงานสุขสวัสดิ์76 คุณกิม",
            batchDetails: {
                payPeriod: "16-25 เมษายน 2568",
                workers: [
                    {
                        workerName: "นาย สมชาย ทาสีดี", idCard: "1234567890123", workerType: "ช่างสี", bank: "กรุงไทย", accountNo: "123-4-56789-0", gross: 14613.30, wht: 437.51, net: 14175.79,
                        workItems: [
                            { desc: "งานสีภายใน ชั้น 2", qty: 162.37, unit: "ตร.ม.", rate: 40, total: 6494.80 },
                            { desc: "งานสกิมภายใน ชั้น 2", qty: 162.37, unit: "ตร.ม.", rate: 50, total: 8118.50 }
                        ]
                    },
                    {
                        workerName: "นาย มานะ ฉาบดี", idCard: "9876543210987", workerType: "ช่างฉาบ", bank: "ไทยพาณิชย์", accountNo: "987-6-54321-0", gross: 15742.50, wht: 472.27, net: 15270.23,
                        workItems: [
                            { desc: "งานฉาบผนังภายใน ชั้น 1", qty: 209.9, unit: "ตร.ม.", rate: 75, total: 15742.50 }
                        ]
                    }
                ]
            }
        },
        {
            id: "DCW-6804-001",
            docType: "DCW",
            docTitle: "ใบเบิกค่าแรงช่าง DC",
            date: "2025-04-26",
            recipient: "นาย สมชาย ทาสีดี",
            items: [
                { desc: "งานสีภายใน รองพื้น 1 รอบ ทาสี 3 รอบ ชั้น 2 (162.37 ตร.ม. @40 บ.) [พื้นที่: ทั้งชั้น 2]", amount: 6494.80 },
                { desc: "งานสกิมภายใน ชั้น 2 (162.37 ตร.ม. @50 บ.) [พื้นที่: ทั้งชั้น 2]", amount: 8118.50 },
                { desc: "งานสีฝ้าภายใน ชั้น 2 (57.72 ตร.ม. @40 บ.) [พื้นที่: ฝ้าเพดานชั้น 2]", amount: 2308.80 }
            ],
            taxInfo: {
                hasVat: false,
                whtType: "3%",
                applyRetention: false
            },
            calculated: {
                subtotal: 16922.10,
                vat: 0,
                totalAfterVat: 16922.10,
                whtAmt: 507.66,
                retentionAmt: 0,
                netAmount: 16414.44
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "โอนธนาคาร กรุงไทย 123-4-56789-0",
            remarks: "ช่างทำงานเสร็จ 100% ตรวจรับแล้ว QC ผ่าน | ผู้วัดงาน: SE ณัฐกิจ (25/04/2568)",
            site: "หน่วยงานสุขสวัสดิ์76 คุณกิม / บ้านคุณกิม ชั้น 2 และบันได",
            workerIdCard: "1234567890123",
            workerType: "ช่างสี"
        },
        {
            id: "ACR-6804-001",
            docType: "ACR",
            docTitle: "ขอเบิกล่วงหน้า (Advance Cash Request)",
            date: "2025-04-26",
            recipient: "นาย ณัฐกิจ เหมจินดา",
            items: [
                { desc: "ปูนซีเมนต์ + ทราย", amount: 3000 },
                { desc: "สารปรับระดับพื้น self", amount: 5000 },
                { desc: "ค่าขนส่ง", amount: 500 }
            ],
            taxInfo: {
                hasVat: false,
                whtType: "none",
                applyRetention: false
            },
            calculated: {
                subtotal: 8500,
                vat: 0,
                totalAfterVat: 8500,
                whtAmt: 0,
                retentionAmt: 0,
                netAmount: 8500,
                bufferAmount: 850,
                netTotalWithBuffer: 9350
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "โอนธนาคาร กสิกรไทย 185-3-73944-4",
            remarks: "ซื้อวัสดุปรับปรุงพื้น self-leveling ชั้น 2 และบันได หน่วยงานสุขสวัสดิ์76 \n- วันที่ออกไซต์: 27/04/2568\n- กำหนดส่งบิลคืน: 03/05/2568",
            site: "หน่วยงานสุขสวัสดิ์76 คุณกิม"
        },
        {
            id: "PCF-6804-001",
            docType: "PCF",
            docTitle: "ใบสำคัญจ่าย / เบิกเงินสด",
            date: "2025-04-26", // using 2025 representing 2568
            recipient: "นาย ณัฐกิจ เหมจินดา",
            items: [
                { desc: "ค่าวัสดุซ่อมแซมพื้น self-leveling ชั้น 2 (อ้างอิงใบเสร็จ REC-001)", amount: 8500 },
                { desc: "ค่าขนส่งวัสดุเข้าไซต์ (อ้างอิงใบเสร็จ REC-002)", amount: 500 }
            ],
            taxInfo: {
                hasVat: false,
                whtType: "none",
                applyRetention: false
            },
            calculated: {
                subtotal: 9000,
                vat: 0,
                totalAfterVat: 9000,
                whtAmt: 0,
                retentionAmt: 0,
                netAmount: 9000
            },
            status: "DRAFT",
            createdBy: "นาย ณัฐกิจ เหมจินดา",
            createdAt: new Date().toISOString(),
            paymentDetail: "โอนธนาคาร กสิกรไทย 185-3-73944-4",
            remarks: "ซื้อวัสดุปรับปรุงพื้น self ชั้น 2 และบันได งานเร่งด่วน ไม่มีเวลาขอ Advance",
            site: "หน่วยงานสุขสวัสดิ์76 คุณกิม"
        }
    ]);

    const [form, setForm] = useState<any>({
        docType: 'PCF',
        recipientInfo: '',
        date: new Date().toISOString().split('T')[0],
        items: [{ desc: '', amount: 0 }],
        hasVat: false,
        whtType: 'none', // none, 3%
        applyRetention: false, // 5%
        bufferPct: 10 // only for ACR
    });

    const handleFormChange = (key: string, value: any) => {
        setForm({ ...form, [key]: value });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...form.items];
        newItems[index][field] = value;
        setForm({ ...form, items: newItems });
    };

    const addItem = () => setForm({...form, items: [...form.items, { desc: '', amount: 0 }]});
    const removeItem = (index: number) => setForm({...form, items: form.items.filter((_:any, i:number) => i !== index)});

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files) as File[];
        const newAttachments = [...(form.attachments || [])];
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                newAttachments.push({
                    name: file.name,
                    type: file.type,
                    data: event.target?.result as string
                });
                setForm(prev => ({...prev, attachments: newAttachments}));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index: number) => {
        setForm({...form, attachments: form.attachments.filter((_:any, i:number) => i !== index)});
    };

    useEffect(() => {
        // Auto-configure tax/retention based on doctype
        let newForm = { ...form };
        if (form.docType === 'DCW') {
            newForm.whtType = '3%';
            newForm.applyRetention = false;
        } else if (form.docType === 'SCW') {
            newForm.whtType = '3%';
            newForm.applyRetention = true;
        } else if (form.docType === 'ACR') {
            newForm.whtType = 'none';
            newForm.applyRetention = false;
        } else {
            newForm.whtType = 'none';
            newForm.applyRetention = false;
        }
        setForm(newForm);
    }, [form.docType]);

    const calculateTotals = () => {
        const subtotal = form.items.reduce((acc: number, item: any) => acc + (parseFloat(item.amount) || 0), 0);
        const vat = form.hasVat ? parseFloat((subtotal * 0.07).toFixed(2)) : 0;
        const totalAfterVat = subtotal + vat;
        
        const whtAmt = form.whtType === '3%' ? parseFloat((subtotal * 0.03).toFixed(2)) : 0;
        const retentionAmt = form.applyRetention ? parseFloat((subtotal * 0.05).toFixed(2)) : 0;
        const deductions = whtAmt + retentionAmt;
        
        const netAmount = totalAfterVat - deductions;

        const bufferAmount = form.docType === 'ACR' ? parseFloat((subtotal * (form.bufferPct / 100)).toFixed(2)) : 0;
        const netTotalWithBuffer = netAmount + bufferAmount;

        return { subtotal, vat, totalAfterVat, whtAmt, retentionAmt, netAmount, bufferAmount, netTotalWithBuffer };
    };

    const totals = calculateTotals();

    const getDocTypeName = (type: string) => {
        switch(type) {
            case 'PCF': return 'ใบสำคัญจ่าย / เบิกเงินสด';
            case 'ACR': return 'ขอเบิกล่วงหน้า';
            case 'DCW': return 'ใบเบิกค่าแรงช่าง DC';
            case 'SCW': return 'ใบเบิกค่างวดงานผู้รับเหมา';
            default: return 'เอกสารเบิกจ่ายจ่าย';
        }
    };

    const handleSubmit = () => {
        if (!form.recipientInfo) return toast.error('กรุณาระบุชื่อผู้รับเงิน');
        if (form.items.some((i:any) => !i.desc || i.amount <= 0)) return toast.error('กรุณากรอกรายการให้ครบถ้วนและถูกต้อง');

        const yy = new Date(form.date).getFullYear().toString().substring(2);
        const mm = (new Date(form.date).getMonth() + 1).toString().padStart(2, '0');
        const count = documents.filter(d => d.docType === form.docType).length + 1;
        const docNo = `${form.docType}-${yy}${mm}-${count.toString().padStart(3, '0')}`;

        const newDoc = {
            id: docNo,
            docType: form.docType,
            docTitle: getDocTypeName(form.docType),
            date: form.date,
            recipient: form.recipientInfo,
            items: form.items,
            taxInfo: {
                hasVat: form.hasVat,
                whtType: form.whtType,
                applyRetention: form.applyRetention
            },
            calculated: totals,
            status: 'DRAFT',
            createdBy: user.name,
            createdAt: new Date().toISOString()
        };

        setDocuments([newDoc, ...documents]);
        setSelectedDoc(newDoc);
        setActiveTab('view');
        toast.success(`ร่างเอกสาร ${docNo} สำเร็จ`);
    };

    const printDoc = () => {
        window.print();
    };

    const renderVerificationPanel = (doc: any) => {
        const results = [];
        let isPassed = true;
        let warningCount = 0;

        // 1. ตรวจสอบยอดรวม (Subtotal)
        let calcSubtotal = 0;
        if (doc.docType === 'DC-BATCH') {
            calcSubtotal = doc.batchDetails?.workers.reduce((s:number, w:any) => s + w.gross, 0) || 0;
        } else if (doc.docType !== 'BOQ-PROG') {
            calcSubtotal = doc.items?.reduce((s:number, i:any) => s + (parseFloat(i.amount) || 0), 0) || 0;
        } else {
            calcSubtotal = doc.calculated.subtotal; // Assume BOQ-PROG subtotal is fine for now
        }

        const diffSubtotal = Math.abs(calcSubtotal - (doc.calculated.subtotal || 0));
        if (diffSubtotal < 0.01) {
            results.push({ id: 'calc_subtotal', title: 'ยอดรวมรายการถูกต้อง', status: 'pass' });
        } else {
            isPassed = false;
            results.push({ id: 'calc_subtotal', title: 'ยอดรวมรายการไม่ตรงกับผลรวม', status: 'fail', desc: `พบความต่างของยอดจัดเก็บ` });
        }

        // 2. ภาษีหัก ณ ที่จ่าย
        if (doc.docType === 'DCW' || doc.docType === 'SCW') {
            if (doc.taxInfo?.whtType === '3%') {
                results.push({ id: 'tax_wht', title: 'การหัก ณ ที่จ่าย (3%) ถูกต้องตามประเภท', status: 'pass' });
            } else {
                isPassed = false;
                results.push({ id: 'tax_wht', title: 'ประเภทเอกสารบังคับหัก ณ ที่จ่าย 3%', status: 'fail' });
            }
        } else if (doc.docType === 'DC-BATCH') {
            let allWhtCorrect = true;
            doc.batchDetails?.workers.forEach((w:any) => {
                if (Math.abs(w.gross * 0.03 - w.wht) > 0.01) allWhtCorrect = false;
            });
            if (allWhtCorrect) {
                 results.push({ id: 'tax_wht_batch', title: 'การหัก 3% รายบุคคล (Batch) ถูกต้อง', status: 'pass' });
            } else {
                 isPassed = false;
                 results.push({ id: 'tax_wht_batch', title: 'พบรายการบุคคลหัก WHT ไม่ตรง 3%', status: 'fail' });
            }
        } else {
             results.push({ id: 'tax_wht', title: `เงื่อนไขภาษีถูกต้อง`, status: 'pass' });
        }

        // 3. ข้อมูลผู้รับเงิน
        if (doc.recipient && (doc.paymentDetail || doc.docType === 'DC-BATCH')) {
             results.push({ id: 'recipient_info', title: 'ข้อมูลผู้รับเงินและช่องทางชำระครบถ้วน', status: 'pass' });
        } else {
             isPassed = false;
             results.push({ id: 'recipient_info', title: 'ข้อมูลผู้รับเงิน/ช่องทางชำระ ไม่ครบถ้วน', status: 'fail' });
        }

        // 4. เอกสารแนบ (Warning)
        warningCount++;
        results.push({ id: 'attachments', title: 'ตรวจสอบเอกสารแนบด้วยตนเอง', status: 'warning', desc: 'ไฟล์อ้างอิง, รูปถ่าย, หน้าสมุดบัญชี' });

        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 relative mt-4">
                <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                    <CheckCircle className={`mr-2 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`} size={18}/> 
                    ตรวจสอบความถูกต้อง (AI Verify)
                </h3>
                
                <div className="space-y-3 mb-4">
                    {results.map(r => (
                        <div key={r.id} className="flex items-start">
                            <div className="mt-0.5 mr-2">
                                {r.status === 'pass' && <CheckCircle className="text-emerald-500" size={14}/>}
                                {r.status === 'fail' && <svg className="text-red-500 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                                {r.status === 'warning' && <svg className="text-yellow-500 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                            </div>
                            <div>
                                <p className={`text-sm ${r.status === 'fail' ? 'text-red-700 font-bold' : 'text-gray-700'}`}>{r.title}</p>
                                {r.desc && <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`p-3 rounded-lg text-sm font-bold flex items-center justify-center ${isPassed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {isPassed ? '✅ ผ่านเงื่อนไข (พร้อมส่ง)' : '❌ พบข้อผิดพลาด กรุณาแก้ไข'}
                </div>
            </div>
        );
    };

    return (
        <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-10 block">
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        .print-area, .print-area * { visibility: visible; }
                        .print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; padding: 0;}
                        @page { size: A4 portrait; margin: 15mm; }
                        .print-hidden { display: none !important; }
                        
                        .watermark {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-45deg);
                            font-size: 150px;
                            color: red;
                            opacity: 0.08;
                            pointer-events: none;
                            z-index: -1;
                            white-space: nowrap;
                        }
                    }
                `}
            </style>

            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={() => { activeTab === 'list' ? onBack() : setActiveTab('list') }} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">ระบบเบิกเงิน & เอกสารจ่าย</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1 sm:mt-1.5">บริษัท พิชยมงคล คอนสตรัคชั่น จำกัด</p>
                    </div>
                </div>
                {activeTab === 'list' && (
                    <button onClick={() => {
                        setForm({...form, items: [{desc: '', amount: 0}], recipientInfo: ''});
                        setActiveTab('create');
                    }} className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> สร้างเอกสารใหม่
                    </button>
                )}
                {activeTab === 'view' && (
                    <button onClick={printDoc} className="bg-brand-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Printer size={18} /> พิมพ์เอกสาร (Print)
                    </button>
                )}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 text-lg">รายการเอกสารทั้งหมด</h2>
                    </div>
                    {documents.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            <FileText className="mx-auto text-gray-300 w-16 h-16 mb-4" />
                            <p>ยังไม่มีรายการเอกสารในระบบ</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm align-middle">
                            <thead className="bg-gray-100/50 text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">เลขที่เอกสาร</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">ประเภท</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">ผู้รับเงิน</th>
                                    <th className="p-4 font-semibold text-right uppercase tracking-wider text-xs">ยอดสุทธิ (THB)</th>
                                    <th className="p-4 font-semibold text-center uppercase tracking-wider text-xs">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {documents.map(doc => (
                                    <tr key={doc.id} onClick={() => { setSelectedDoc(doc); setActiveTab('view'); }} className="hover:bg-brand-50/50 cursor-pointer transition-colors group">
                                        <td className="p-4 font-bold text-gray-900 group-hover:text-brand-700">{doc.id}</td>
                                        <td className="p-4 text-gray-600">{doc.docTitle}</td>
                                        <td className="p-4 font-medium text-gray-800">{doc.recipient}</td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-900">{(doc.docType === 'ACR' ? doc.calculated.netTotalWithBuffer : doc.calculated.netAmount).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">{doc.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            
            {activeTab === 'create' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900 text-lg flex items-center">
                            <FileText className="mr-2 text-brand-600" /> ร่างเอกสารเบิกจ่าย
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">ประเภทเอกสาร</label>
                                <select className="form-input w-full" value={form.docType} onChange={e => handleFormChange('docType', e.target.value)}>
                                    <option value="PCF">ใบสำคัญจ่าย / เบิกเงินสด (PCF)</option>
                                    <option value="ACR">ขอเบิกล่วงหน้า (ACR)</option>
                                    <option value="DCW">ใบเบิกค่าแรงช่าง DC (DCW)</option>
                                    <option value="SCW">ใบเบิกค่างวดงานผู้รับเหมา (SCW)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">วันที่ออกเอกสาร</label>
                                <input type="date" className="form-input w-full font-mono" value={form.date} onChange={e => handleFormChange('date', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">นามผู้รับเงิน (Recipient)</label>
                            <input type="text" className="form-input w-full" placeholder="ชื่อบุคคล หรือ นิติบุคคล" value={form.recipientInfo} onChange={e => handleFormChange('recipientInfo', e.target.value)} />
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 font-semibold text-gray-700">รายละเอียดรายการ (Description)</th>
                                        <th className="p-3 font-semibold text-gray-700 w-48 text-right">จำนวนเงิน (THB)</th>
                                        <th className="p-3 w-12 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.items.map((item: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="p-2">
                                                <input type="text" className="form-input w-full border-transparent focus:border-brand-500 focus:bg-white bg-gray-50/50" placeholder="ระบุรายละเอียด..." value={item.desc} onChange={e => handleItemChange(idx, 'desc', e.target.value)} />
                                            </td>
                                            <td className="p-2">
                                                <input type="number" className="form-input w-full text-right border-transparent font-mono focus:border-brand-500 focus:bg-white bg-gray-50/50" value={item.amount || ''} onChange={e => handleItemChange(idx, 'amount', e.target.value)} />
                                            </td>
                                            <td className="p-2 text-center">
                                                {form.items.length > 1 && (
                                                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-3 bg-gray-50 bg-opacity-50 border-t border-gray-100 flex justify-between items-start">
                                <button onClick={addItem} className="text-brand-600 hover:text-brand-800 font-bold flex items-center text-xs tracking-wider">
                                    <Plus size={14} className="mr-1" /> เพิ่มรายการ
                                </button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-5">
                            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><ImageIcon size={18} className="mr-2 text-gray-500" /> เอกสารแนบ/รูปถ่าย</h3>
                            <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer" />
                            {form.attachments?.length > 0 && (
                                <div className="flex gap-4 mt-4 flex-wrap">
                                    {form.attachments.map((att:any, idx:number) => (
                                        <div key={idx} className="relative w-24 h-24 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm group">
                                            {att.type.startsWith('image/') ? <img src={att.data} className="w-full h-full object-cover" alt="attachment" /> : <div className="text-center font-bold text-gray-500"><FileText size={24} className="mx-auto mb-1 text-blue-400" />PDF</div>}
                                            <button onClick={() => removeAttachment(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0] grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 border-b pb-2">การคำนวณและภาษี</h3>
                                <label className="flex items-center text-gray-700 font-medium">
                                    <input type="checkbox" className="mr-3 w-4 h-4 rounded text-brand-600 focus:ring-brand-500" checked={form.hasVat} onChange={e => handleFormChange('hasVat', e.target.checked)} />
                                    มีภาษีมูลค่าเพิ่ม (VAT 7%)
                                </label>
                                
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">หักภาษี ณ ที่จ่าย (WHT)</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center font-medium"><input type="radio" name="wht" className="mr-2" checked={form.whtType === 'none'} onChange={() => handleFormChange('whtType', 'none')} /> ไม่มีหัก</label>
                                        <label className="flex items-center font-medium text-purple-700"><input type="radio" name="wht" className="mr-2" checked={form.whtType === '3%'} onChange={() => handleFormChange('whtType', '3%')} /> หัก 3% (ค่าแรง/บริการ)</label>
                                    </div>
                                    {form.docType === 'DCW' || form.docType === 'SCW' ? <p className="text-xs text-orange-600 mt-1">*ช่าง DC และ ผรม. บังคับหัก 3%</p> : null}
                                </div>

                                <div>
                                    <label className="flex items-center text-gray-700 font-medium text-emerald-700">
                                        <input type="checkbox" className="mr-3 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" checked={form.applyRetention} onChange={e => handleFormChange('applyRetention', e.target.checked)} />
                                        หักประกันผลงาน (Retention 5%)
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm font-mono text-sm">
                                <div className="flex justify-between py-1 text-gray-600"><span>รวมเป็นเงิน (Subtotal):</span> <span>{totals.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                {form.hasVat && <div className="flex justify-between py-1 text-gray-600"><span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span> <span>{totals.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>}
                                {form.hasVat && <div className="flex justify-between py-1 text-gray-800 font-bold border-b border-gray-100 pb-2"><span>ยอดรวม (Total with VAT):</span> <span>{totals.totalAfterVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>}
                                
                                {form.whtType === '3%' && <div className="flex justify-between py-1 text-purple-700 mt-2"><span>หัก ณ ที่จ่าย (3%):</span> <span>-{totals.whtAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>}
                                {form.applyRetention && <div className="flex justify-between py-1 text-emerald-700"><span>หักประกันผลงาน (5%):</span> <span>-{totals.retentionAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>}
                                
                                {form.docType === 'ACR' && (
                                    <div className="flex justify-between py-1 text-orange-600 mt-2">
                                        <span>
                                            เผื่อสำรองจ่าย (Buffer) 
                                            <input type="number" min="0" max="100" className="ml-2 w-16 px-1 py-0 border rounded text-right inline-block text-gray-900 border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" value={form.bufferPct} onChange={e => handleFormChange('bufferPct', parseInt(e.target.value) || 0)} /> %:
                                        </span>
                                        <span>{totals.bufferAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-2 text-xl font-black text-brand-700 border-t-2 border-brand-200 mt-2">
                                    <span>ยอดชำระสุทธิ ({form.docType==='ACR'?'Net + Buffer':'Net'}):</span>
                                    <span>{(form.docType==='ACR' ? totals.netTotalWithBuffer : totals.netAmount).toLocaleString(undefined, {minimumFractionDigits: 2})} THB</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                            <button onClick={() => setActiveTab('list')} className="px-6 py-2 rounded-lg text-gray-600 font-bold bg-gray-100 hover:bg-gray-200">ยกเลิก</button>
                            <button onClick={handleSubmit} className="px-6 py-2 rounded-lg text-white font-bold bg-brand-600 hover:bg-brand-700 flex items-center"><CheckCircle size={18} className="mr-2"/> บันทึกร่าง (Draft)</button>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'view' && selectedDoc && (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Print Document Area */}
                    <div className="flex-1 overflow-x-auto bg-gray-200 p-8 flex justify-center py-10 rounded-xl inner-shadow print:p-0 print:bg-transparent shadow-inner">
                        <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xlprint-area relative" style={{ fontFamily: "'Sarabun', sans-serif" }}>
                            {selectedDoc.status === 'DRAFT' && <div className="watermark">DRAFT</div>}
                            <div className="p-12">
                                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-brand-900 rounded-lg flex flex-col items-center justify-center text-white ring-4 ring-gray-100">
                                            <span className="font-extrabold text-xl leading-none tracking-tighter">P</span>
                                            <span className="text-[8px] font-bold tracking-widest mt-0.5 opacity-80">MGC</span>
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold text-gray-900 leading-tight">บริษัท พิชยมงคล คอนสตรัคชั่น จำกัด</h1>
                                            <p className="text-[12px] text-gray-600 mt-1">276/1 ซอยพุทธบูชา 36 แขวงบางมด เขตทุ่งครุ กทม. 10140</p>
                                            <p className="text-[12px] text-gray-600">เลขประจำตัวผู้เสียภาษี: 0125557002609</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold bg-[#1a2233] text-white px-4 py-2 rounded mb-2 inline-block shadow-sm">
                                            {selectedDoc.docTitle}
                                        </h2>
                                        <table className="text-xs text-left ml-auto mt-2 border-collapse">
                                            <tbody>
                                                <tr><td className="font-bold py-1 pr-3 text-gray-700">เลขที่เอกสาร:</td><td className="font-mono text-gray-900">{selectedDoc.id}</td></tr>
                                                <tr><td className="font-bold py-1 pr-3 text-gray-700">วันที่:</td><td className="font-mono text-gray-900">{new Date(selectedDoc.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mb-6 bg-gray-50 p-4 border border-gray-200 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm"><span className="font-bold inline-block w-24">จ่ายให้แก่:</span> {selectedDoc.recipient}</p>
                                        <p className="text-sm mt-2"><span className="font-bold inline-block w-24">ช่องทางชำระ:</span> {selectedDoc.paymentDetail || '-'}</p>
                                        {selectedDoc.docType === 'DCW' && (
                                            <p className="text-sm mt-2"><span className="font-bold inline-block w-24">เลขบัตรปชช:</span> {selectedDoc.workerIdCard || '-'}</p>
                                        )}
                                        {selectedDoc.docType === 'SCW' && selectedDoc.contractDetails && (
                                            <>
                                                <p className="text-sm mt-2"><span className="font-bold inline-block w-24">เลขผู้เสียภาษี:</span> {selectedDoc.contractDetails.idOrTax || '-'}</p>
                                                <p className="text-sm mt-2"><span className="font-bold inline-block w-24">อ้างอิงสัญญา:</span> {selectedDoc.contractDetails.contractRef || '-'}</p>
                                                <p className="text-sm mt-2"><span className="font-bold inline-block w-24">มูลค่าสัญญา:</span> {selectedDoc.contractDetails.contractTotal?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-'} บาท</p>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm"><span className="font-bold inline-block w-24">โครงการ/ไซต์:</span> {selectedDoc.site || '-'}</p>
                                        <p className="text-sm mt-2"><span className="font-bold inline-block w-24">หมายเหตุ:</span> {selectedDoc.remarks || '-'}</p>
                                        {selectedDoc.docType === 'DCW' && (
                                            <p className="text-sm mt-2"><span className="font-bold inline-block w-24">ประเภทช่าง:</span> {selectedDoc.workerType || '-'}</p>
                                        )}
                                        {selectedDoc.docType === 'SCW' && selectedDoc.contractDetails && (
                                            <>
                                                <p className="text-sm mt-2"><span className="font-bold inline-block w-24">งวดที่เบิก:</span> {selectedDoc.contractDetails.installmentNo} / {selectedDoc.contractDetails.totalInstallments}</p>
                                                <p className="text-sm mt-2"><span className="font-bold inline-block w-24">รายละเอียด:</span> {selectedDoc.contractDetails.installmentDesc}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                            {selectedDoc.docType !== 'DC-BATCH' && selectedDoc.docType !== 'BOQ-PROG' && (
                                <table className="w-full text-sm border-collapse border border-gray-300">
                                    <thead className="bg-[#1a2233] text-white">
                                        <tr>
                                            <th className="border border-gray-300 p-2 text-center w-12">ลำดับ</th>
                                            <th className="border border-gray-300 p-2 text-left">รายการ</th>
                                            <th className="border border-gray-300 p-2 text-right w-40">จำนวนเงิน (บาท)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="h-64 align-top">
                                        {selectedDoc.items.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td className="border-x border-gray-300 p-2 text-center text-gray-500">{i + 1}</td>
                                                <td className="border-x border-gray-300 p-2">{item.desc}</td>
                                                <td className="border-x border-gray-300 p-2 text-right font-mono">{parseFloat(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        ))}
                                        {/* empty space filler */}
                                        <tr>
                                            <td className="border-x border-b border-gray-300 p-2 h-full"></td>
                                            <td className="border-x border-b border-gray-300 p-2"></td>
                                            <td className="border-x border-b border-gray-300 p-2"></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">รวมเงิน:</td>
                                            <td className="border border-gray-300 p-2 text-right font-mono font-bold">{selectedDoc.calculated.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        </tr>
                                        {selectedDoc.taxInfo.hasVat && (
                                            <>
                                            <tr>
                                                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">ภาษีมูลค่าเพิ่ม 7%:</td>
                                                <td className="border border-gray-300 p-2 text-right font-mono font-bold">{selectedDoc.calculated.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">รวมยอดเงินหลังภาษีมูลค่าเพิ่ม:</td>
                                                <td className="border border-gray-300 p-2 text-right font-mono font-bold">{selectedDoc.calculated.totalAfterVat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                            </>
                                        )}
                                        {selectedDoc.taxInfo.whtType === '3%' && (
                                            <tr>
                                                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">หักภาษี ณ ที่จ่าย 3%:</td>
                                                <td className="border border-gray-300 p-2 text-right font-mono font-bold text-red-600">-{selectedDoc.calculated.whtAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        )}
                                        {selectedDoc.taxInfo.applyRetention && (
                                            <tr>
                                                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">หักประกันผลงาน 5%:</td>
                                                <td className="border border-gray-300 p-2 text-right font-mono font-bold text-red-600">-{selectedDoc.calculated.retentionAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        )}
                                        {selectedDoc.docType === 'ACR' && (
                                            <tr>
                                                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold bg-gray-50 text-gray-700">ยอดเผื่อสำรองจ่าย (Buffer 10%):</td>
                                                <td className="border border-gray-300 p-2 text-right font-mono font-bold">{selectedDoc.calculated.bufferAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan={2} className="border border-gray-300 p-3 bg-brand-50 font-bold">
                                                <div className="flex items-center">
                                                    <span className="w-24 text-gray-700">ตัวอักษร:</span>
                                                    <span className="text-brand-900 border-b border-brand-300 w-full ml-2 text-center pb-0.5">({THBText(selectedDoc.docType === 'ACR' ? selectedDoc.calculated.netTotalWithBuffer : selectedDoc.calculated.netAmount)})</span>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-right bg-brand-50 font-mono font-black text-lg underline decoration-double">
                                                {(selectedDoc.docType === 'ACR' ? selectedDoc.calculated.netTotalWithBuffer : selectedDoc.calculated.netAmount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}

                                {selectedDoc.docType === 'DC-BATCH' && (
                                    <div className="space-y-6">
                                        <table className="w-full text-[11px] border-collapse border border-gray-300">
                                            <thead className="bg-[#1a2233] text-white">
                                                <tr>
                                                    <th className="border border-gray-300 p-2 text-center w-8">ที่</th>
                                                    <th className="border border-gray-300 p-2 text-left">ชื่อ-นามสกุล / เลขบัตรฯ</th>
                                                    <th className="border border-gray-300 p-2 text-left w-64">ประเภทช่าง / รายการงาน</th>
                                                    <th className="border border-gray-300 p-2 text-right">รวมเงิน (Gross)</th>
                                                    <th className="border border-gray-300 p-2 text-right">หัก 3%</th>
                                                    <th className="border border-gray-300 p-2 text-right">ยอดสุทธิ (Net)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="align-top">
                                                {selectedDoc.batchDetails.workers.map((worker: any, i: number) => (
                                                    <tr key={i}>
                                                        <td className="border border-gray-300 p-2 text-center text-gray-500">{i + 1}</td>
                                                        <td className="border border-gray-300 p-2">
                                                            <div className="font-bold text-gray-900">{worker.workerName}</div>
                                                            <div className="text-gray-500">{worker.idCard}</div>
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <div className="font-bold text-gray-700 mb-1">{worker.workerType}</div>
                                                            <ul className="list-disc pl-4 text-gray-600">
                                                                {worker.workItems.map((wi: any, j: number) => (
                                                                    <li key={j}>{wi.desc} ({wi.qty} {wi.unit} @{wi.rate}) = {wi.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono">{worker.gross.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono text-red-600">-{worker.wht.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono font-bold bg-brand-50">{worker.net.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-100 font-bold text-gray-900">
                                                    <td colSpan={3} className="border border-gray-300 p-2 text-right">รวมทั้งสิ้น (Total):</td>
                                                    <td className="border border-gray-300 p-2 text-right font-mono">{selectedDoc.batchDetails.workers.reduce((s:number, w:any) => s + w.gross, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    <td className="border border-gray-300 p-2 text-right font-mono text-red-600">-{selectedDoc.batchDetails.workers.reduce((s:number, w:any) => s + w.wht, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    <td className="border border-gray-300 p-2 text-right font-mono text-lg">{selectedDoc.calculated.netAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={6} className="border border-gray-300 p-3 bg-brand-50 font-bold">
                                                        <div className="flex items-center">
                                                            <span className="w-24 text-gray-700">ตัวอักษร:</span>
                                                            <span className="text-brand-900 border-b border-brand-300 w-full ml-2 text-center pb-0.5">({THBText(selectedDoc.calculated.netAmount)})</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>

                                        {/* Transfer List Section for Batch */}
                                        <div className="border border-gray-300 rounded overflow-hidden mt-6 page-break-before">
                                            <div className="bg-[#1a2233] text-white p-2 text-center font-bold text-sm">
                                                ใบแแนบการโอนเงิน (Payment Transfer List)
                                            </div>
                                            <table className="w-full text-[12px] border-collapse">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border border-gray-300 p-2 text-center w-10">ที่</th>
                                                        <th className="border border-gray-300 p-2 text-left">ชื่อบัญชี</th>
                                                        <th className="border border-gray-300 p-2 text-center">ธนาคาร</th>
                                                        <th className="border border-gray-300 p-2 text-center">เลขบัญชี</th>
                                                        <th className="border border-gray-300 p-2 text-right">ยอดโอนสุทธิ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedDoc.batchDetails.workers.map((worker: any, i: number) => (
                                                        <tr key={i}>
                                                            <td className="border border-gray-300 p-2 text-center">{i + 1}</td>
                                                            <td className="border border-gray-300 p-2 font-bold">{worker.workerName}</td>
                                                            <td className="border border-gray-300 p-2 text-center">{worker.bank}</td>
                                                            <td className="border border-gray-300 p-2 text-center font-mono tracking-wider">{worker.accountNo}</td>
                                                            <td className="border border-gray-300 p-2 text-right font-mono font-bold bg-brand-50">{worker.net.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-gray-100 font-bold">
                                                        <td colSpan={4} className="border border-gray-300 p-2 text-right">รวมยอดโอนทั้งหมด:</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono">{selectedDoc.calculated.netAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {selectedDoc.docType === 'SCW' && selectedDoc.contractDetails && (
                                    <div className="mt-8 border border-gray-300">
                                        <div className="bg-[#1a2233] text-white p-2 font-bold text-sm">สรุปยอดตามสัญญา (Contract Summary)</div>
                                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 text-sm">
                                            <div>
                                                <p className="text-gray-500 mb-1">มูลค่าสัญญารวม:</p>
                                                <p className="font-bold font-mono">{selectedDoc.contractDetails.contractTotal?.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">เบิกสะสม (รวมงวดนี้):</p>
                                                <p className="font-bold font-mono">{(selectedDoc.contractDetails.contractTotal / selectedDoc.contractDetails.totalInstallments * selectedDoc.contractDetails.installmentNo)?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-'} บาท</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">หักประกันผลงานสะสม (5%):</p>
                                                <p className="font-bold font-mono text-red-600">{(selectedDoc.contractDetails.contractTotal / selectedDoc.contractDetails.totalInstallments * selectedDoc.contractDetails.installmentNo * 0.05)?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-'} บาท</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedDoc.docType === 'BOQ-PROG' && selectedDoc.boqDetails && (
                                    <div className="space-y-6">
                                        <table className="w-full text-xs border-collapse border border-gray-300">
                                            <thead className="bg-[#1a2233] text-white">
                                                <tr>
                                                    <th className="border border-gray-300 p-2 text-center w-8">ที่</th>
                                                    <th className="border border-gray-300 p-2 text-left">รายการ (BOQ Item)</th>
                                                    <th className="border border-gray-300 p-2 text-center w-16">หน่วย</th>
                                                    <th className="border border-gray-300 p-2 text-right">จำนวนทั้งหมด</th>
                                                    <th className="border border-gray-300 p-2 text-right">ราคา/หน่วย</th>
                                                    <th className="border border-gray-300 p-2 text-right">จำนวนที่ทำเสร็จ</th>
                                                    <th className="border border-gray-300 p-2 text-right">% ความคืบหน้า</th>
                                                </tr>
                                            </thead>
                                            <tbody className="align-top">
                                                {selectedDoc.boqDetails.boqItems.map((item: any, i: number) => (
                                                    <tr key={i}>
                                                        <td className="border border-gray-300 p-2 text-center text-gray-500">{item.itemNo}</td>
                                                        <td className="border border-gray-300 p-2 text-gray-900">{item.desc}</td>
                                                        <td className="border border-gray-300 p-2 text-center text-gray-500">{item.unit}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono">{item.qtyTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono">{item.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono font-bold text-gray-800">{item.qtyDone.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="border border-gray-300 p-2 text-right font-mono font-bold text-blue-600">{item.pctDone.toLocaleString()}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="border border-gray-300 rounded overflow-hidden">
                                            <div className="bg-[#1a2233] text-white p-2 text-center font-bold text-sm">
                                                สรุปการเบิกจ่ายตามความคืบหน้า (Progress Payment Summary)
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 text-sm">
                                                <div>
                                                    <p className="text-gray-500 mb-1">มูลค่าโครงการรวม:</p>
                                                    <p className="font-bold font-mono">{selectedDoc.boqDetails.contractValue.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">ความคืบหน้ารวมเบิกครั้งนี้:</p>
                                                    <p className="font-bold font-mono text-blue-700">{selectedDoc.boqDetails.progressTotalPct.toLocaleString(undefined, {minimumFractionDigits: 2})}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">ยอดค่าใช้จ่ายที่เบิกได้ (สะสม):</p>
                                                    <p className="font-bold font-mono text-gray-800">{selectedDoc.boqDetails.progressTotalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">ยอดคงเหลือในสัญญา:</p>
                                                    <p className="font-bold font-mono">{selectedDoc.boqDetails.remainingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="font-bold text-gray-800 mb-2 border-b pb-1">ประวัติการเบิกจ่าย (หักออก)</p>
                                                    <ul className="text-xs space-y-1">
                                                        {selectedDoc.boqDetails.paidInstallments.map((inst: any, idx: number) => (
                                                            <li key={idx} className="flex justify-between">
                                                                <span className="text-gray-600">งวดที่ {inst.installment} (จ่ายแล้ว {inst.date})</span>
                                                                <span className="font-mono text-red-600">-{inst.amountPaid.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm font-bold text-gray-700 mb-1">ยอดที่สามารถขอเบิกได้ครั้งนี้:</p>
                                                    <p className="text-2xl font-black font-mono text-brand-700 underline decoration-double">{selectedDoc.calculated.netAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Signature Block */}
                                <div className="grid grid-cols-4 gap-6 mt-16 mt-auto">
                                    <div className="text-center">
                                        <div className="border-b border-dashed border-gray-800 w-full mb-2 h-10"></div>
                                        <p className="text-xs font-bold text-gray-800">ผู้รับเงิน (Receiver)</p>
                                        <p className="text-[10px] text-gray-500 mt-1">วันที่ _______/_______/_______</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-b border-dashed border-gray-800 w-full mb-2 h-10 flex items-end justify-center pb-1"><span className="font-handwriting text-brand-600 text-lg opacity-80">{selectedDoc.createdBy}</span></div>
                                        <p className="text-xs font-bold text-gray-800">ผู้จัดทำ (Prepared By)</p>
                                        <p className="text-[10px] text-gray-500 mt-1">วันที่ {new Date().toLocaleDateString('th-TH')}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-b border-dashed border-gray-800 w-full mb-2 h-10"></div>
                                        <p className="text-xs font-bold text-gray-800">ผู้ตรวจสอบ (Checked By)</p>
                                        <p className="text-[10px] text-gray-500 mt-1">วันที่ _______/_______/_______</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-b border-dashed border-gray-800 w-full mb-2 h-10"></div>
                                        <p className="text-xs font-bold text-gray-800">ผู้อนุมัติ (Approved By)</p>
                                        <p className="text-[10px] text-gray-500 mt-1">วันที่ _______/_______/_______</p>
                                    </div>
                                </div>
                                
                                {selectedDoc.attachments && selectedDoc.attachments.length > 0 && (
                                    <div className="mt-12 border-t-2 border-gray-200 pt-8 print:break-before-page">
                                        <h3 className="font-bold text-lg mb-6 flex items-center text-gray-800"><ImageIcon className="mr-2 text-brand-600" /> เอกสารแนบ / รูปถ่ายประกอบ</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            {selectedDoc.attachments.map((att:any, idx:number) => (
                                                <div key={idx} className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                                    {att.type.startsWith('image/') ? (
                                                        <img src={att.data} className="w-full h-auto object-contain rounded" style={{maxHeight: '300px'}} alt={`Attachment ${idx+1}`} />
                                                    ) : (
                                                        <div className="h-32 flex flex-col items-center justify-center text-gray-500">
                                                            <FileText size={48} className="mb-2 text-blue-400" />
                                                            <span className="font-bold">{att.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Summary and Email Assistant Panel */}
                    <div className="w-full lg:w-96 flex flex-col gap-4 print:hidden">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center"><FileText className="mr-2 text-blue-600" size={18}/> สรุปเอกสาร (Summary)</h3>
                            <ul className="text-sm space-y-3">
                                <li><span className="text-gray-500 block text-xs">เลขที่เอกสาร</span><span className="font-bold font-mono">{selectedDoc.id}</span></li>
                                <li><span className="text-gray-500 block text-xs">ผู้รับเงิน</span><span className="font-bold text-gray-800">{selectedDoc.recipient}</span></li>
                                <li><span className="text-gray-500 block text-xs">ยอดสุทธิ</span><span className="font-bold text-brand-600 text-lg font-mono">{(selectedDoc.docType === 'ACR' ? selectedDoc.calculated.netTotalWithBuffer : selectedDoc.calculated.netAmount).toLocaleString(undefined, {minimumFractionDigits: 2})} ฿</span></li>
                                <li><span className="text-gray-500 block text-xs">สถานะ</span><span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded inline-block mt-1">{selectedDoc.status}</span></li>
                            </ul>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl"></div>
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center"><CheckCircle className="mr-2 text-emerald-600" size={18}/> เอกสารแนบที่ต้องใช้</h3>
                            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                                {(selectedDoc.docType === 'DCW' || selectedDoc.docType === 'DC-BATCH') && (
                                    <>
                                        <li>สรุปรายการเบิกช่างพร้อมยอดคำนวณหัก/สุทธิ</li>
                                        <li>{selectedDoc.docType === 'DC-BATCH' ? 'รายการหน้าสมุดบัญชีธนาคารช่างทุกคน (หรือ Payment Transfer List ที่ถูกต้อง)' : 'สำเนาหน้าสมุดบัญชีธนาคาร'}</li>
                                        <li>สำเนาบัตรประชาชนช่าง</li>
                                    </>
                                )}
                                {selectedDoc.docType === 'SCW' && (
                                    <>
                                        <li>ผลงานที่เบิกงวด (รูปถ่าย / ใบส่งมอบงาน)</li>
                                        <li>ใบแจ้งหนี้ / ใบกำกับภาษี (ถ้ามี)</li>
                                        <li>สำเนาหน้าสมุดบัญชีธนาคาร (กรณีจ่ายโอน)</li>
                                    </>
                                )}
                                {selectedDoc.docType === 'BOQ-PROG' && (
                                    <>
                                        <li>รูปถ่ายความคืบหน้าหน้างานทั้งหมด</li>
                                        <li>รายงานการประชุม / ยืนยันผลงานจากผู้ควบคุมงาน (ถ้ามี)</li>
                                    </>
                                )}
                                {(selectedDoc.docType === 'PCF') && (
                                    <>
                                        <li>บิลเงินสด / ใบเสร็จรับเงินบิล (ตัวจริง)</li>
                                        <li>ภาพถ่ายสินค้า/หน้างานประกอบ (ถ้ามี)</li>
                                    </>
                                )}
                                {(selectedDoc.docType === 'ACR') && (
                                    <>
                                        <li>รายการวัสดุ/ค่าใช้จ่ายที่คาดว่าจะเกิดขึ้น</li>
                                        <li>ภาพถ่ายหน้างานประกอบการอนุมัติ</li>
                                    </>
                                )}
                            </ul>
                        </div>
                        
                        {renderVerificationPanel(selectedDoc)}

                        <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 text-white relative">
                            <h3 className="font-bold mb-3 border-b border-slate-600 pb-2">ร่างอีเมลสำหรับฝ่ายบัญชี{selectedDoc.docType==='ACR'?'และ PM':''}</h3>
                            
                            <div className="mb-3">
                                <label className="block text-xs text-slate-400 mb-1">อีเมลผู้รับ (To:)</label>
                                <input 
                                    type="email" 
                                    value={emailTarget} 
                                    onChange={(e) => setEmailTarget(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                                    placeholder="ระบุอีเมลผู้รับ..."
                                />
                            </div>

                            <textarea readOnly className="w-full h-80 bg-slate-900 text-sm p-3 rounded border border-slate-700 font-mono text-slate-300 outline-none resize-none"
                                value={generateEmailDraft(selectedDoc)}
                            ></textarea>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => {
                                    if (!emailTarget) return toast.error('กรุณาระบุอีเมลผู้รับ');
                                    toast.loading(`กำลังส่งอีเมลพร้อมเอกสารแนบไปยัง ${emailTarget}...`, {id: 'send_email'});
                                    setTimeout(() => {
                                        toast.success('ส่งอีเมลระบบอัตโนมัติเรียบร้อยแล้ว!', {id: 'send_email'});
                                    }, 1500);
                                }} className="mt-2 w-full bg-brand-600 hover:bg-brand-500 text-white py-2 flex items-center justify-center rounded text-sm font-bold transition-colors"><Send size={16} className="mr-2" /> ส่งอีเมล (ระบบอัตโนมัติ)</button>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        navigator.clipboard.writeText(generateEmailDraft(selectedDoc));
                                        toast.success('คัดลอกร่างข้อความแล้ว');
                                    }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-[13px] font-bold transition-colors">คัดลอกข้อความ</button>
                                    <button onClick={() => {
                                        if (!emailTarget) return toast.error('กรุณาระบุอีเมลผู้รับ');
                                        const subject = encodeURIComponent(`จัดส่งเอกสาร ${selectedDoc.docTitle} [${selectedDoc.id}]`);
                                        const body = encodeURIComponent(generateEmailDraft(selectedDoc));
                                        window.open(`mailto:${emailTarget}?subject=${subject}&body=${body}`);
                                    }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 flex items-center justify-center rounded text-[13px] font-bold transition-colors"><Mail size={14} className="mr-1" /> เปิดโปรแกรมเมล</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}

