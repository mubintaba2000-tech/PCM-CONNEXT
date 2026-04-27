import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, MessageSquareWarning, FileQuestion, ArrowRight, User, ShieldAlert } from 'lucide-react';

const DISCIPLINES = ['Civil', 'Structural', 'MEP', 'Architectural', 'Geotechnical'];
const PRIORITIES = {
    Routine: { days: 7, color: 'bg-blue-100 text-blue-700' },
    Urgent: { days: 3, color: 'bg-amber-100 text-amber-700' },
    Critical: { days: 1, color: 'bg-red-100 text-red-700' }
};

export const RfiTab = ({ project, user }: { project: Project, user: any }) => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedRfi, setSelectedRfi] = useState<any>(null);

  const [rfiList, setRfiList] = useState([
    {
       id: 'PRJ-RFI-001',
       subject: 'Clarification on beam reinforcement B-105',
       discipline: 'Structural',
       priority: 'Urgent',
       question: 'Drawing S-102 shows 5-DB16 for bottom reinforcement, but schedule mentions 6-DB16. Please clarify.',
       references: ['S-102', 'B-Schedule'],
       impact: { schedule: false, cost: false, safety: true },
       submitted_by: 'Contractor A',
       date_submitted: '2026-04-20',
       date_required: '2026-04-23',
       status: 'OPEN',
       response: null,
       assigned_to: ['Engineer', 'PM', 'Owner']
    },
    {
       id: 'PRJ-RFI-002',
       subject: 'Substitute AC brand due to supply shortage',
       discipline: 'MEP',
       priority: 'Routine',
       question: 'Specified brand XYZ is out of stock for 3 months. Can we substitute with brand ABC equivalent model?',
       references: ['M-201', 'Spec-Mech'],
       impact: { schedule: true, cost: true, safety: false },
       submitted_by: 'Contractor B',
       date_submitted: '2026-04-10',
       date_required: '2026-04-17',
       status: 'CLOSED',
       response: 'Approved to use brand ABC model 123. Deductitive change order will be issued.',
       answered_by: 'MEP Engineer',
       assigned_to: ['PM']
    }
  ]);

  const [formData, setFormData] = useState({
      subject: '',
      discipline: 'Architectural',
      priority: 'Routine',
      question: '',
      references: '',
      impact_schedule: false,
      impact_cost: false,
      impact_safety: false
  });
  
  const role = user?.role || 'pm';
  const isContractor = role === 'contractor';
  const isEngineer = role === 'engineer';
  const isPM = role === 'pm' || role === 'admin';
  const isOwner = role === 'owner';

  const handleCreateRfi = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.subject || !formData.question) {
          toast.error("กรุณากรอกหัวข้อและคำถาม");
          return;
      }
      
      const newId = `PRJ-RFI-${String(rfiList.length + 1).padStart(3, '0')}`;
      const today = new Date();
      const reqDate = new Date();
      reqDate.setDate(today.getDate() + PRIORITIES[formData.priority as keyof typeof PRIORITIES].days);

      let assigned = ['Engineer'];
      if (formData.discipline === 'Structural' && formData.impact_safety) {
          assigned = ['Engineer', 'PM', 'Owner'];
          toast('RFI Route: Structural + Safety Impact -> Escalated to PM & Owner', { icon: '⚠️' });
      } else if (formData.impact_cost || formData.impact_schedule) {
          assigned = ['Engineer', 'PM'];
      }

      const newRfi = {
          id: newId,
          subject: formData.subject,
          discipline: formData.discipline,
          priority: formData.priority,
          question: formData.question,
          references: formData.references.split(',').map(s=>s.trim()).filter(Boolean),
          impact: {
              schedule: formData.impact_schedule,
              cost: formData.impact_cost,
              safety: formData.impact_safety
          },
          submitted_by: user?.name || 'Contractor',
          date_submitted: today.toISOString().split('T')[0],
          date_required: reqDate.toISOString().split('T')[0],
          status: 'OPEN',
          response: null,
          assigned_to: assigned
      };

      setRfiList([newRfi, ...rfiList]);
      toast.success(`ระบบสร้าง RFI หมายเลข ${newId} สำเร็จ`);
      setActiveView('list');
      setFormData({
         subject: '', discipline: 'Architectural', priority: 'Routine', 
         question: '', references: '', impact_schedule: false, impact_cost: false, impact_safety: false
      });
  };

  const handleResponse = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const resp = form.response.value;
      if (!resp) return;

      if (isContractor) {
          toast.error("ผู้รับเหมาไม่สามารถตอบ RFI ได้");
          return;
      }

      if (selectedRfi.impact.cost || selectedRfi.impact.schedule) {
           if (isEngineer) {
               toast("RFI นี้มีผลต่อ Cost/Schedule -> ส่งร่างคำตอบให้ PM อนุมัติ", { icon: 'ℹ️' });
               return; // Mock draft
           }
      }

      setRfiList(list => list.map(item => {
          if (item.id === selectedRfi.id) {
              return { ...item, status: 'CLOSED', response: resp, answered_by: user?.name || 'Engineer' };
          }
          return item;
      }));
      toast.success("บันทึกคำตอบและปิด RFI สำเร็จ");
      setActiveView('list');
      setSelectedRfi(null);
  };

  const calculateAging = (dateStr: string) => {
      const sub = new Date(dateStr);
      const today = new Date('2026-04-26');
      return Math.floor((today.getTime() - sub.getTime()) / (1000 * 3600 * 24));
  };

  const visibleRfi = isContractor 
    ? rfiList.filter(rfi => rfi.submitted_by === (user?.name || 'Contractor A')) 
    : rfiList;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 gap-4">
           <div>
              <h2 className="text-xl font-bold text-gray-900">ระเบียนข้อสงสัย (Request for Information)</h2>
              <p className="text-sm text-gray-500 mt-1">จัดการคำถามทางเทคนิคระหว่างผู้รับเหมา วิศวกร และผู้ออกแบบ</p>
           </div>
           <div className="flex gap-2">
               {isPM && activeView === 'list' && (
                  <button onClick={() => toast.success('Export RFI Log (Excel) สำเร็จ')} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition">
                      Export Log
                  </button>
               )}
               {activeView === 'list' && (isContractor || isEngineer || isPM) && (
                  <button onClick={() => setActiveView('create')} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center gap-2">
                     <Plus size={18} /> สร้าง RFI
                  </button>
               )}
               {activeView !== 'list' && (
                  <button onClick={() => { setActiveView('list'); setSelectedRfi(null); }} className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                     กลับไปหน้ารวม
                  </button>
               )}
           </div>
       </div>

       {activeView === 'list' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                  <div className="relative flex-1 max-w-md">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="ระบุ RFI No หรือหัวข้อ..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                     <Filter size={16} /> กรอง
                  </button>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                               <th className="p-4 w-32">RFI No</th>
                               <th className="p-4">หัวข้อ (Subject)</th>
                               <th className="p-4">หมวดงาน</th>
                               <th className="p-4 text-center">Impacts</th>
                               <th className="p-4">สถานะ</th>
                               <th className="p-4">วันที่รับ / กำหนดตอบ</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {visibleRfi.map(rfi => {
                               const age = calculateAging(rfi.date_submitted);
                               const isOverdue = rfi.status === 'OPEN' && new Date(rfi.date_required) < new Date('2026-04-26');
                               
                               return (
                               <tr key={rfi.id} onClick={() => { setSelectedRfi(rfi); setActiveView('detail'); }} className="hover:bg-brand-50/50 transition cursor-pointer group">
                                   <td className="p-4 font-mono text-sm font-bold text-brand-600">{rfi.id}</td>
                                   <td className="p-4">
                                       <div className="flex items-center gap-2">
                                          {rfi.priority === 'Critical' && <ShieldAlert size={14} className="text-red-500" />}
                                          <p className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">{rfi.subject}</p>
                                       </div>
                                       <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${PRIORITIES[rfi.priority as keyof typeof PRIORITIES].color}`}>
                                           {rfi.priority}
                                       </span>
                                   </td>
                                   <td className="p-4">
                                       <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">{rfi.discipline}</span>
                                   </td>
                                   <td className="p-4">
                                       <div className="flex justify-center gap-1">
                                          {rfi.impact.schedule && <span className="w-5 h-5 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold" title="Schedule Impact">S</span>}
                                          {rfi.impact.cost && <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold" title="Cost Impact">$</span>}
                                          {rfi.impact.safety && <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold" title="Safety Impact">!</span>}
                                          {(!rfi.impact.schedule && !rfi.impact.cost && !rfi.impact.safety) && <span className="text-xs text-gray-400">-</span>}
                                       </div>
                                   </td>
                                   <td className="p-4">
                                       {rfi.status === 'OPEN' ? (
                                           <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">Open</span>
                                       ) : (
                                           <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">Closed</span>
                                       )}
                                       {rfi.status === 'OPEN' && age > 7 && <span className="ml-2 text-[10px] text-red-500 font-bold hidden md:inline-block">Aging {age}d</span>}
                                   </td>
                                   <td className="p-4">
                                       <div className="flex flex-col gap-0.5 text-xs">
                                          <span className="text-gray-500">Submitted: {rfi.date_submitted}</span>
                                          <span className={`font-bold ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>Due: {rfi.date_required}</span>
                                       </div>
                                   </td>
                               </tr>
                           )})}
                       </tbody>
                   </table>
               </div>
           </div>
       )}

       {activeView === 'create' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-3xl mx-auto">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><FileQuestion className="text-brand-600"/> สร้าง RFI ใหม่</h3>
               <form onSubmit={handleCreateRfi} className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">หมวดงาน (Discipline) *</label>
                           <select value={formData.discipline} onChange={e=>setFormData({...formData, discipline: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required>
                               {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">ความเร่งด่วน (Priority) *</label>
                           <select value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required>
                               <option value="Routine">Routine (7 days)</option>
                               <option value="Urgent">Urgent (3 days)</option>
                               <option value="Critical">Critical (24 hours)</option>
                           </select>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">หัวข้อ (Subject) *</label>
                       <input type="text" value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} placeholder="สรุปใจความสำคัญสั้นๆ" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required />
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">คำถาม (Question) *  <span className="font-normal text-gray-400 font-mono ml-2 text-xs">{formData.question.length}/500</span></label>
                       <textarea value={formData.question} onChange={e=>setFormData({...formData, question: e.target.value})} maxLength={500} rows={4} placeholder="รายละเอียดคำถาม หรือข้อสงสัย..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors resize-none" required></textarea>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">เอกสาร/แบบอ้างอิง (References)</label>
                       <input type="text" value={formData.references} onChange={e=>setFormData({...formData, references: e.target.value})} placeholder="เช่น S-101, A-205 (คั่นด้วยลูกน้ำ)" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" />
                   </div>

                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                       <label className="block text-sm font-bold text-gray-700 mb-3">ผลกระทบที่คาดว่าจะเกิด (Potential Impact)</label>
                       <div className="flex flex-wrap gap-4">
                           <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" checked={formData.impact_schedule} onChange={e=>setFormData({...formData, impact_schedule: e.target.checked})} className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                               <span className="text-sm text-gray-700">ผลกระทบต่อเวลา (Schedule)</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" checked={formData.impact_cost} onChange={e=>setFormData({...formData, impact_cost: e.target.checked})} className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                               <span className="text-sm text-gray-700">ผลกระทบต่อค่าใช้จ่าย (Cost)</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" checked={formData.impact_safety} onChange={e=>setFormData({...formData, impact_safety: e.target.checked})} className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                               <span className="text-sm text-gray-700 font-bold text-red-600">ผลกระทบต่อความปลอดภัย (Safety)</span>
                           </label>
                       </div>
                   </div>
                   
                   <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                       <button type="button" onClick={() => setActiveView('list')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">ยกเลิก</button>
                       <button type="submit" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm">สร้าง RFI</button>
                   </div>
               </form>
           </div>
       )}

       {activeView === 'detail' && selectedRfi && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                       <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                           <div>
                               <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-2xl font-bold text-gray-900">{selectedRfi.subject}</h3>
                               </div>
                               <p className="text-gray-500 text-sm font-mono">{selectedRfi.id} • {selectedRfi.discipline} Discipline</p>
                           </div>
                           <div className="text-right">
                               <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${selectedRfi.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                   {selectedRfi.status}
                               </span>
                           </div>
                       </div>
                       
                       <div className="prose prose-sm max-w-none text-gray-700 mb-8 leading-relaxed">
                           <p className="whitespace-pre-wrap">{selectedRfi.question}</p>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 bg-gray-50 rounded-xl p-4">
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</p>
                               <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${PRIORITIES[selectedRfi.priority as keyof typeof PRIORITIES].color}`}>{selectedRfi.priority}</span>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">References</p>
                               <p className="text-sm font-mono font-bold text-gray-900">{selectedRfi.references.join(', ') || '-'}</p>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted By</p>
                               <p className="text-sm font-bold text-gray-900">{selectedRfi.submitted_by}</p>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Required By</p>
                               <p className="text-sm font-bold text-red-600">{selectedRfi.date_required}</p>
                           </div>
                       </div>
                   </div>

                   {selectedRfi.status === 'CLOSED' ? (
                       <div className="bg-brand-50 rounded-[24px] border border-brand-100 shadow-sm p-6 relative">
                           <h4 className="font-bold text-brand-900 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-brand-600"/> Official Response</h4>
                           <div className="prose prose-sm max-w-none text-brand-800 leading-relaxed bg-white p-4 rounded-xl border border-brand-100 mb-4">
                               <p className="whitespace-pre-wrap">{selectedRfi.response}</p>
                           </div>
                           <p className="text-xs text-brand-600 font-medium">Answered by {selectedRfi.answered_by}</p>
                       </div>
                   ) : (
                       (!isContractor && !isOwner) && (
                       <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                           <h4 className="font-bold text-gray-900 mb-4">Draft Response</h4>
                           <form onSubmit={handleResponse}>
                               <textarea name="response" rows={5} placeholder="พิมพ์คำตอบทางเทคนิคที่นี่..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:bg-white resize-none mb-4" required></textarea>
                               <button type="submit" className="w-full px-4 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm transition">
                                   บันทึกและปิด RFI
                               </button>
                               {(selectedRfi.impact.cost || selectedRfi.impact.schedule) && (
                                   <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center gap-1"><AlertCircle size={12}/> RFI นี้มีผลกระทบด้าน Cost/Schedule ต้องให้ PM อนุมัติ</p>
                               )}
                           </form>
                       </div>
                       )
                   )}
               </div>

               <div className="space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                       <h4 className="font-bold text-gray-900 mb-4 whitespace-nowrap">Impact Analysis</h4>
                       <div className="space-y-3">
                           <div className={`p-3 rounded-xl border flex items-center justify-between ${selectedRfi.impact.schedule ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                               <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  <span className="text-sm font-bold">Schedule Impact</span>
                               </div>
                               <span>{selectedRfi.impact.schedule ? 'Yes' : 'No'}</span>
                           </div>
                           <div className={`p-3 rounded-xl border flex items-center justify-between ${selectedRfi.impact.cost ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                               <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg leading-none pl-1">$</span>
                                  <span className="text-sm font-bold">Cost Impact</span>
                               </div>
                               <span>{selectedRfi.impact.cost ? 'Yes' : 'No'}</span>
                           </div>
                           <div className={`p-3 rounded-xl border flex items-center justify-between ${selectedRfi.impact.safety ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                               <div className="flex items-center gap-2">
                                  <ShieldAlert size={16} />
                                  <span className="text-sm font-bold">Safety Impact</span>
                               </div>
                               <span>{selectedRfi.impact.safety ? 'Yes' : 'No'}</span>
                           </div>
                       </div>
                       
                       {selectedRfi.impact.safety && isPM && (
                           <button onClick={() => toast.success('Auto-link to Issues module')} className="mt-4 w-full px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                               <ArrowRight size={14} /> Create Incident/Issue Record
                           </button>
                       )}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
