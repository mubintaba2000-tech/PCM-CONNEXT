import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { FileText, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, FileCheck2, User, Download, Upload, X } from 'lucide-react';

const DOC_TYPES = {
  SD: 'Shop Drawing',
  MS: 'Material Submittal',
  MTD: 'Method Statement',
  ITP: 'Inspection & Test Plan'
};

const STATUS_CODES = {
  PENDING: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  ESCALATED: { label: 'Escalated', color: 'bg-red-100 text-red-700 border-red-200' },
  A: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  AB: { label: 'Approved w/ Comments', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  B: { label: 'Not Approved', color: 'bg-red-100 text-red-700 border-red-200' },
  C: { label: 'For Information Only', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export const RfaTab = ({ project, user }: { project: Project, user: any }) => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedRfa, setSelectedRfa] = useState<any>(null);
  
  const [rfaList, setRfaList] = useState([
    {
       id: 'RFA-SD-001',
       doc_type: 'SD',
       doc_number: 'STR-001',
       revision: 0,
       title: 'Shop Drawing for Ground Floor Columns',
       submitted_by: 'Contractor A',
       date: '2026-04-18',
       status: 'PENDING',
       assigned_to: ['Site Engineer', 'PM'],
       due_date: '2026-04-27',
       related_drawings: ['S-101', 'S-102'],
       files: ['column_details.pdf']
    },
    {
       id: 'RFA-MS-001',
       doc_type: 'MS',
       doc_number: 'ARCH-015',
       revision: 1,
       title: 'Ceramic Floor Tiles - Phase 1',
       submitted_by: 'Contractor A',
       date: '2026-04-10',
       status: 'B',
       assigned_to: ['QC Inspector', 'PM'],
       due_date: '2026-04-19',
       related_drawings: ['A-201'],
       files: ['tile_specs.pdf']
    },
    {
       id: 'RFA-MTD-002',
       doc_type: 'MTD',
       doc_number: 'C-002',
       revision: 0,
       title: 'Method Statement for Deep Excavation',
       submitted_by: 'Contractor B',
       date: '2026-04-20',
       status: 'PENDING',
       assigned_to: ['PM', 'Owner'],
       due_date: '2026-04-24',
       related_drawings: ['C-100'],
       files: ['excavation_method.pdf']
    }
  ]);

  const [formData, setFormData] = useState({
     doc_type: 'SD',
     doc_number: '',
     revision: '0',
     title: '',
     related_drawings: '',
     files: null as FileList | null
  });

  const role = user?.role || 'pm';
  const isContractor = role === 'contractor';
  const isEngineer = role === 'engineer';
  const isPM = role === 'pm' || role === 'admin';
  const isOwner = role === 'owner';
  const isQC = role === 'qc';

  const handleCreateRfa = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.doc_number || !formData.title || !formData.doc_type) {
          toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
          return;
      }
      if (parseInt(formData.revision) > 3) {
          toast('Revision มากกว่า 3 - ระบบจะแจ้งเตือนให้ PM ทราบเป็นพิเศษ', { icon: '⚠️' });
      }

      let assigned: string[] = [];
      if (formData.doc_type === 'SD' || formData.doc_type === 'ITP') {
          assigned = ['Site Engineer', 'PM'];
      } else if (formData.doc_type === 'MS') {
          assigned = ['QC Inspector', 'PM'];
      } else if (formData.doc_type === 'MTD') {
          assigned = ['PM', 'Owner'];
      }

      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 7);

      const newRfa = {
         id: `RFA-${formData.doc_type}-${String(rfaList.length + 1).padStart(3, '0')}`,
         doc_type: formData.doc_type,
         doc_number: formData.doc_number,
         revision: parseInt(formData.revision),
         title: formData.title,
         submitted_by: user?.name || 'Contractor',
         date: today.toISOString().split('T')[0],
         status: 'PENDING',
         assigned_to: assigned,
         due_date: dueDate.toISOString().split('T')[0],
         related_drawings: formData.related_drawings.split(',').map(s=>s.trim()).filter(Boolean),
         files: ['uploaded_file.pdf']
      };

      setRfaList([newRfa, ...rfaList]);
      toast.success("ส่งเอกสารเพื่อขออนุมัติเรียบร้อยแล้ว");
      setActiveView('list');
      setFormData({ doc_type: 'SD', doc_number: '', revision: '0', title: '', related_drawings: '', files: null });
  };

  const handleReview = (rfaId: string, status: string) => {
      if (isOwner) {
          toast.error("คุณมีสิทธิ์ในการดูเอกสารเท่านั้น");
          return;
      }
      if (isContractor) {
          toast.error("ผู้รับเหมาไม่สามารถกำหนดสถานะเอกสารได้");
          return;
      }
      if (isEngineer && ['A', 'AB', 'B', 'C'].includes(status)) {
           toast("วิศวกรสามารถเพิ่มคอมเมนต์และ Markup ได้ แต่ PM จะเป็นคนอนุมัติขั้นสุดท้าย", { icon: 'ℹ️' });
           return;
      }
      if (isQC && !['MS', 'ITP'].includes(rfaList.find(r=>r.id===rfaId)?.doc_type || '')) {
           toast.error("QC สามารถพิจารณาได้เฉพาะ Material Submittal และ ITP");
           return;
      }

      setRfaList(list => list.map(item => {
         if (item.id === rfaId) {
             return { ...item, status };
         }
         return item;
      }));
      toast.success("อัปเดตสถานะเอกสารสำเร็จ ระบบได้แจ้งเตือนผู้เกี่ยวข้องแล้ว");
      setActiveView('list');
      setSelectedRfa(null);
  };

  const calculateDaysRemaining = (dueDateStr: string) => {
      const due = new Date(dueDateStr);
      const today = new Date('2026-04-26');
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return diff;
  };

  const getStatusBadge = (rfa: any) => {
      let statusKey = rfa.status;
      const daysLeft = calculateDaysRemaining(rfa.due_date);
      if (rfa.status === 'PENDING' && daysLeft <= 2) {
          statusKey = 'ESCALATED'; // auto escalate warning if <= 2 days
      }
      const st = STATUS_CODES[statusKey as keyof typeof STATUS_CODES] || STATUS_CODES.PENDING;
      return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${st.color}`}>{st.label}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 gap-4">
           <div>
              <h2 className="text-xl font-bold text-gray-900">ขออนุมัติเอกสาร (RFA / Submittals)</h2>
              <p className="text-sm text-gray-500 mt-1">Shop Drawings, Material Submittals, Method Statements</p>
           </div>
           {activeView === 'list' && (isContractor || isPM) && (
              <button onClick={() => setActiveView('create')} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center gap-2">
                 <Plus size={18} /> สร้าง RFA
              </button>
           )}
           {activeView !== 'list' && (
              <button onClick={() => { setActiveView('list'); setSelectedRfa(null); }} className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                 กลับไปหน้ารวม
              </button>
           )}
       </div>

       {activeView === 'list' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                  <div className="relative flex-1 max-w-md">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="ระบุ Doc No หรือพิมพ์เพื่อค้นหา..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                     <Filter size={16} /> กรอง
                  </button>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                               <th className="p-4">RFA ID</th>
                               <th className="p-4">ประเภท</th>
                               <th className="p-4">ชื่อเอกสาร / Doc No</th>
                               <th className="p-4">Rev</th>
                               <th className="p-4">ส่งโดย</th>
                               <th className="p-4">สถานะ</th>
                               <th className="p-4">ครบกำหนด</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {rfaList.map(rfa => (
                               <tr key={rfa.id} onClick={() => { setSelectedRfa(rfa); setActiveView('detail'); }} className="hover:bg-brand-50/50 transition cursor-pointer group">
                                   <td className="p-4 font-mono text-sm font-bold text-brand-600">{rfa.id}</td>
                                   <td className="p-4">
                                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded" title={DOC_TYPES[rfa.doc_type as keyof typeof DOC_TYPES]}>{rfa.doc_type}</span>
                                   </td>
                                   <td className="p-4">
                                       <p className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">{rfa.title}</p>
                                       <p className="text-xs text-gray-500 mt-0.5">Ref: {rfa.doc_number}</p>
                                   </td>
                                   <td className="p-4 text-center font-mono text-sm">{rfa.revision}</td>
                                   <td className="p-4 text-sm text-gray-600">{rfa.submitted_by}</td>
                                   <td className="p-4">{getStatusBadge(rfa)}</td>
                                   <td className="p-4">
                                       <div className="flex items-center gap-1.5 text-sm">
                                          <Clock size={14} className={calculateDaysRemaining(rfa.due_date) <= 2 && rfa.status === 'PENDING' ? 'text-red-500' : 'text-gray-400'} />
                                          <span className={calculateDaysRemaining(rfa.due_date) <= 2 && rfa.status === 'PENDING' ? 'text-red-600 font-bold' : 'text-gray-600'}>{rfa.due_date}</span>
                                       </div>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}

       {activeView === 'create' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-3xl mx-auto">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><FileCheck2 className="text-brand-600"/> สร้างรายการขออนุมัติเอกสารใหม่</h3>
               <form onSubmit={handleCreateRfa} className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">ประเภทเอกสาร (Doc Type) *</label>
                           <select value={formData.doc_type} onChange={e=>setFormData({...formData, doc_type: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required>
                               {Object.entries(DOC_TYPES).map(([k,v]) => <option key={k} value={k}>{k} - {v}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">เลขที่อ้างอิงเอกสาร (Doc Number) *</label>
                           <input type="text" value={formData.doc_number} onChange={e=>setFormData({...formData, doc_number: e.target.value})} placeholder="e.g. STR-001" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required />
                       </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                       <div className="col-span-3">
                           <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อเอกสาร (Title) *</label>
                           <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="รายละเอียดที่ต้องการขออนุมัติ" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Revision *</label>
                           <input type="number" min="0" value={formData.revision} onChange={e=>setFormData({...formData, revision: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" required />
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">แบบที่เกี่ยวข้อง (Related Drawings)</label>
                       <input type="text" value={formData.related_drawings} onChange={e=>setFormData({...formData, related_drawings: e.target.value})} placeholder="Dwg No. (คั่นด้วยลูกน้ำ)" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white transition-colors" />
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">แนบไฟล์ (Files) *</label>
                       <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-brand-50 hover:border-brand-300 transition cursor-pointer">
                           <Upload className="text-gray-400 mb-2" size={24} />
                           <p className="text-sm text-gray-600 font-medium">ลากไฟล์มาปล่อยที่นี่ หรือคลิกเพื่ออัปโหลด</p>
                           <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ PDF, JPG ขนาดไม่เกิน 20MB</p>
                       </div>
                   </div>
                   
                   <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                       <button type="button" onClick={() => setActiveView('list')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">ยกเลิก</button>
                       <button type="submit" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm">บันทึกและส่ง</button>
                   </div>
               </form>
           </div>
       )}

       {activeView === 'detail' && selectedRfa && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                       <div className="flex justify-between items-start mb-6">
                           <div>
                               <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-2xl font-bold text-gray-900">{selectedRfa.title}</h3>
                                   {getStatusBadge(selectedRfa)}
                               </div>
                               <p className="text-gray-500 text-sm font-mono">{selectedRfa.id} • Rev {selectedRfa.revision}</p>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-50 my-6">
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ประเภท</p>
                               <p className="text-sm font-bold text-gray-900">{DOC_TYPES[selectedRfa.doc_type as keyof typeof DOC_TYPES]}</p>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Doc Number</p>
                               <p className="text-sm font-bold text-gray-900">{selectedRfa.doc_number}</p>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted By</p>
                               <p className="text-sm font-bold text-gray-900">{selectedRfa.submitted_by}</p>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                               <p className="text-sm font-bold text-gray-900">{selectedRfa.date}</p>
                           </div>
                       </div>

                       <div className="mb-6">
                           <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText size={16} /> Attached Files</h4>
                           <div className="flex flex-col gap-2">
                               {selectedRfa.files.map((f: string, i: number) => (
                                   <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                                       <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                                           <span className="text-sm font-medium text-gray-700">{f}</span>
                                       </div>
                                       <Download className="text-gray-400" size={16} />
                                   </div>
                               ))}
                           </div>
                       </div>
                       
                       {selectedRfa.related_drawings?.length > 0 && (
                           <div>
                               <h4 className="text-sm font-bold text-gray-900 mb-2">Related Drawings</h4>
                               <div className="flex flex-wrap gap-2">
                                   {selectedRfa.related_drawings.map((dwg: string, i: number) => (
                                       <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-mono">{dwg}</span>
                                   ))}
                               </div>
                           </div>
                       )}
                   </div>
               </div>

               <div className="space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                       <h4 className="font-bold text-gray-900 mb-4 whitespace-nowrap">Review Workflow</h4>
                       <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6 py-2">
                           <div className="relative">
                               <div className="absolute -left-[31px] top-0 w-6 h-6 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                                  <CheckCircle size={12} className="text-emerald-600" />
                               </div>
                               <h5 className="font-bold text-sm text-gray-900">Submitted</h5>
                               <p className="text-xs text-gray-500 mt-1">{selectedRfa.submitted_by} • {selectedRfa.date}</p>
                           </div>
                           <div className="relative">
                               <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedRfa.status === 'PENDING' ? 'bg-amber-100 border-amber-500 text-amber-600' : 'bg-emerald-100 border-emerald-500 text-emerald-600'}`}>
                                  {selectedRfa.status === 'PENDING' ? <User size={12} /> : <CheckCircle size={12} />}
                               </div>
                               <h5 className="font-bold text-sm text-gray-900">Reviewing</h5>
                               <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-wider">Assigned to:</p>
                               <ul className="text-xs text-gray-600 mt-1 list-disc ml-4 space-y-0.5">
                                   {selectedRfa.assigned_to.map((role: string, i: number) => (
                                       <li key={i}>{role}</li>
                                   ))}
                               </ul>
                               {selectedRfa.status === 'PENDING' && (
                                   <div className="mt-2 p-2 bg-amber-50/50 border border-amber-100 rounded-lg flex items-start gap-2">
                                       <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                       <p className="text-[10px] text-amber-700">Due on {selectedRfa.due_date} ({calculateDaysRemaining(selectedRfa.due_date)} days left)</p>
                                   </div>
                               )}
                           </div>
                           <div className="relative">
                               <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedRfa.status !== 'PENDING' ? 'bg-brand-100 border-brand-500' : 'bg-gray-100 border-gray-300'}`}>
                                  {selectedRfa.status !== 'PENDING' && <CheckCircle size={12} className="text-brand-600" />}
                               </div>
                               <h5 className={`font-bold text-sm ${selectedRfa.status !== 'PENDING' ? 'text-gray-900' : 'text-gray-400'}`}>Final Decision</h5>
                               {selectedRfa.status !== 'PENDING' && (
                                   <div className="mt-2 text-xs font-bold text-gray-600">
                                       Status: {getStatusBadge(selectedRfa)}
                                   </div>
                               )}
                           </div>
                       </div>
                   </div>

                   {/* ACTION PANEL */}
                   {selectedRfa.status === 'PENDING' && (isPM || isEngineer || isQC) && (
                       <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                           <h4 className="font-bold text-gray-900 mb-1">Action Required</h4>
                           <p className="text-xs text-gray-500 mb-4">Provide review status.</p>
                           
                           <div className="space-y-2">
                               {isPM ? (
                                   <>
                                      <button onClick={() => handleReview(selectedRfa.id, 'A')} className="w-full text-left px-4 py-3 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-xl text-sm font-bold text-emerald-700 transition">A - Approved</button>
                                      <button onClick={() => handleReview(selectedRfa.id, 'AB')} className="w-full text-left px-4 py-3 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl text-sm font-bold text-blue-700 transition">AB - Approved with Comments</button>
                                      <button onClick={() => handleReview(selectedRfa.id, 'B')} className="w-full text-left px-4 py-3 bg-white border border-red-200 hover:bg-red-50 rounded-xl text-sm font-bold text-red-700 transition">B - Not Approved (Revise)</button>
                                      <button onClick={() => handleReview(selectedRfa.id, 'C')} className="w-full text-left px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition">C - For Information Only</button>
                                   </>
                               ) : isEngineer ? (
                                   <>
                                      <button onClick={() => toast.success('เปิดระบบ Markup ไฟล์')} className="w-full px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-xl text-sm font-bold transition">เปิด Markup Tool</button>
                                      <button onClick={() => toast.success('ส่งความคิดเห็นสำเร็จ (รอ PM อนุมัติ)')} className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-bold transition mt-2">Submit Comments</button>
                                   </>
                               ) : isQC && ['MS', 'ITP'].includes(selectedRfa.doc_type) ? (
                                   <>
                                      <button onClick={() => toast.success('แจ้งผลการทดสอบสำเร็จ (รอ PM ชี้ขาด)')} className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-bold transition">Submit Inspection Results</button>
                                   </>
                               ) : null}
                           </div>
                       </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};
