import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Search, Filter, Plus, AlertCircle, CheckCircle, Clock, ShieldAlert, BarChart, FileJson, Info, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Safety', 'Quality', 'Design', 'Resource', 'Environment', 'Administrative'];
const SEVERITIES = {
    Critical: { color: 'bg-red-100 text-red-700', border: 'border-red-500', bg: 'bg-red-50', hours: 24 },
    High: { color: 'bg-orange-100 text-orange-700', border: 'border-orange-500', bg: 'bg-orange-50', hours: 72 },
    Medium: { color: 'bg-amber-100 text-amber-700', border: 'border-amber-500', bg: 'bg-amber-50', hours: 168 },
    Low: { color: 'bg-blue-100 text-blue-700', border: 'border-blue-500', bg: 'bg-blue-50', hours: 336 }
};

export const IssuesTab = ({ project, user }: { project: Project, user: any }) => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail' | 'dashboard'>('list');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const [issues, setIssues] = useState([
     {
         id: 'PRJ-ISS-001',
         title: 'Missing guardrail at hoistway',
         category: 'Safety',
         severity: 'Critical',
         description: 'Guardrails are missing on Level 4 hoistway opening, posing an immediate fall hazard.',
         location: { zone: 'A', level: 'L4', coordinates: '' },
         identified_by: 'Safety Officer',
         date_identified: '2026-04-26T08:00',
         status: 'OPEN',
         assigned_to: ['PM', 'Safety Officer'],
         resolution_plan: '',
         resolution_evidence: [],
         linked_to: { ncr_id: null, rfi_id: null }
     },
     {
         id: 'PRJ-ISS-002',
         title: 'Delayed rebar delivery',
         category: 'Resource',
         severity: 'High',
         description: 'Rebar supplier notified of a 2-day delay for L2 slab reinforcement delivery.',
         location: { zone: 'B', level: 'L2', coordinates: '' },
         identified_by: 'Site Engineer',
         date_identified: '2026-04-24T10:00',
         status: 'RESOLVED',
         assigned_to: ['PM'],
         resolution_plan: 'Sourced temporary supply from alternative vendor to minimize delay.',
         resolution_evidence: ['PO-12345'],
         linked_to: { ncr_id: null, rfi_id: null }
     }
  ]);

  const [formData, setFormData] = useState({
      title: '',
      category: 'Safety',
      severity: 'Medium',
      description: '',
      zone: '', level: '',
      linked_ncr: '',
      linked_rfi: ''
  });

  const [resolveData, setResolveData] = useState({
      plan: '',
      evidence: ''
  });

  const role = user?.role || 'pm';
  const isContractor = role === 'contractor';
  const isQC = role === 'qc';
  const isEngineer = role === 'engineer';
  const isPM = role === 'pm' || role === 'admin';
  const isOwner = role === 'owner';

  const handleCreateIssue = (e: React.FormEvent) => {
      e.preventDefault();
      const newId = `PRJ-ISS-${String(issues.length + 1).padStart(3, '0')}`;
      const today = new Date().toISOString();

      let assigned: string[] = [];
      if (formData.category === 'Safety') assigned = ['PM', 'Safety Officer'];
      else if (formData.category === 'Quality') assigned = ['QC Inspector'];
      else if (formData.category === 'Design') assigned = ['Engineer'];
      else if (formData.category === 'Resource') assigned = ['PM'];
      else assigned = ['PM'];

      const newIssue = {
          id: newId,
          title: formData.title,
          category: formData.category,
          severity: formData.severity,
          description: formData.description,
          location: { zone: formData.zone, level: formData.level, coordinates: '' },
          identified_by: user?.name || 'User',
          date_identified: today,
          status: 'OPEN',
          assigned_to: assigned,
          resolution_plan: '',
          resolution_evidence: [],
          linked_to: { ncr_id: formData.linked_ncr, rfi_id: formData.linked_rfi }
      };

      if (formData.severity === 'Critical') {
          toast('Notify PM + Owner immediately!', { icon: '🚨' });
      }

      setIssues([newIssue, ...issues]);
      toast.success(`ระบบสร้าง Issue หมายเลข ${newId} สำเร็จ`);
      setActiveView('list');
      setFormData({
         title: '', category: 'Safety', severity: 'Medium', description: '', zone: '', level: '', linked_ncr: '', linked_rfi: ''
      });
  };

  const handleResolveIssue = (e: React.FormEvent) => {
      e.preventDefault();
      setIssues(list => list.map(item => {
          if (item.id === selectedIssue.id) {
              return { 
                  ...item, 
                  status: 'RESOLVED', 
                  resolution_plan: resolveData.plan,
                  resolution_evidence: resolveData.evidence ? [resolveData.evidence] : []
              };
          }
          return item;
      }));
      toast.success("บันทึกการแก้ไขปัญหาแล้ว รอผู้ตรวจสอบ (Verify)");
      setResolveData({ plan: '', evidence: '' });
      setSelectedIssue(null);
      setActiveView('list');
  };

  const handleVerify = (id: string) => {
      setIssues(list => list.map(item => item.id === id ? { ...item, status: 'VERIFIED' } : item));
      toast.success("ตรวจสอบการแก้ไขเรียบร้อย");
  };

  const handleClose = (id: string, severity: string) => {
      if ((severity === 'Critical' || severity === 'High') && !isPM) {
          toast.error("Issue ระดับ Critical/High ต้องให้ PM ปิดระบบเท่านั้น");
          return;
      }
      setIssues(list => list.map(item => item.id === id ? { ...item, status: 'CLOSED' } : item));
      toast.success("ปิด Issue สำเร็จ");
  };

  const getStatusColor = (st: string) => {
      if (st === 'OPEN') return 'bg-red-100 text-red-700 border-red-200';
      if (st === 'ASSIGNED') return 'bg-amber-100 text-amber-700 border-amber-200';
      if (st === 'RESOLVED') return 'bg-blue-100 text-blue-700 border-blue-200';
      if (st === 'VERIFIED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      if (st === 'CLOSED') return 'bg-gray-100 text-gray-700 border-gray-200';
      return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 gap-4">
           <div>
              <h2 className="text-xl font-bold text-gray-900">การจัดการปัญหา (Issue Tracking)</h2>
              <p className="text-sm text-gray-500 mt-1">ติดตาม ระบุ และแก้ไขปัญหาที่เกิดขึ้นในโครงการ</p>
           </div>
           <div className="flex gap-2">
               {(isOwner || isPM) && activeView === 'list' && (
                   <button onClick={() => setActiveView('dashboard')} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition flex items-center gap-2">
                       <BarChart size={16} /> Dashboard
                   </button>
               )}
               {activeView === 'list' && !isOwner && (
                  <button onClick={() => setActiveView('create')} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center gap-2">
                     <Plus size={18} /> แจ้งปัญหาใหม่
                  </button>
               )}
               {activeView !== 'list' && (
                  <button onClick={() => { setActiveView('list'); setSelectedIssue(null); }} className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                     กลับไปหน้ารวม
                  </button>
               )}
           </div>
       </div>

       {activeView === 'dashboard' && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                   <span className="text-gray-500 font-bold mb-2">Total Issues</span>
                   <span className="text-4xl font-bold text-brand-600">{issues.length}</span>
               </div>
               <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                   <span className="text-gray-500 font-bold mb-2">Open Critical</span>
                   <span className="text-4xl font-bold text-red-600">{issues.filter(i=>i.status==='OPEN' && i.severity==='Critical').length}</span>
               </div>
               <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                   <span className="text-gray-500 font-bold mb-2">Resolved</span>
                   <span className="text-4xl font-bold text-blue-600">{issues.filter(i=>i.status==='RESOLVED').length}</span>
               </div>
               <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                   <span className="text-gray-500 font-bold mb-2">Closed</span>
                   <span className="text-4xl font-bold text-gray-600">{issues.filter(i=>i.status==='CLOSED').length}</span>
               </div>
           </div>
       )}

       {activeView === 'list' && (
           <div className="grid gap-4">
               {issues.map(iss => {
                   const sev = SEVERITIES[iss.severity as keyof typeof SEVERITIES];
                   
                   return (
                   <div key={iss.id} onClick={() => { setSelectedIssue(iss); setActiveView('detail'); }} className={`bg-white p-6 rounded-[20px] border-l-4 ${sev.border} border-y-gray-100 border-r-gray-100 flex flex-col sm:flex-row justify-between items-start cursor-pointer hover:shadow-md transition group`}>
                       <div className="flex gap-4 items-start w-full sm:w-2/3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sev.color}`}>
                               {iss.severity === 'Critical' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                           </div>
                           <div className="flex-1">
                               <div className="flex flex-wrap items-center gap-2 mb-1">
                                   <span className="text-xs font-bold text-gray-500 font-mono">{iss.id}</span>
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sev.color}`}>{iss.severity}</span>
                                   <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold">{iss.category}</span>
                               </div>
                               <h4 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-brand-600 transition-colors">{iss.title}</h4>
                               <p className="text-sm text-gray-600 line-clamp-1">{iss.description}</p>
                               
                               <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                                   <span className="flex items-center gap-1"><Clock size={12}/> {new Date(iss.date_identified).toLocaleString()}</span>
                                   <span>Zone: {iss.location.zone} L: {iss.location.level}</span>
                                   <span>Assigned: {iss.assigned_to.join(', ')}</span>
                               </div>
                           </div>
                       </div>
                       <div className="mt-4 sm:mt-0 ml-14 sm:ml-0 flex flex-col items-start sm:items-end gap-2 shrink-0">
                           <span className={`px-3 py-1 bg-white border text-[11px] font-black rounded-lg uppercase tracking-widest ${getStatusColor(iss.status)}`}>{iss.status}</span>
                       </div>
                   </div>
               )})}
           </div>
       )}

       {activeView === 'create' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-2xl mx-auto">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><AlertCircle className="text-brand-600"/> แจ้งปัญหาใหม่</h3>
               <form onSubmit={handleCreateIssue} className="space-y-5">
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">หัวข้อปัญหา (Issue Title) *</label>
                       <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">หมวดหมู่ (Category) *</label>
                           <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white">
                               {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">ความรุนแรง (Severity) *</label>
                           <select value={formData.severity} onChange={e=>setFormData({...formData, severity: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white">
                               {Object.keys(SEVERITIES).map(s=><option key={s} value={s}>{s}</option>)}
                           </select>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">รายละเอียด (Description) *</label>
                       <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} rows={3} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white resize-none"></textarea>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-5">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">โซน (Zone) *</label>
                           <input type="text" value={formData.zone} onChange={e=>setFormData({...formData, zone: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white" />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">ชั้น (Level) *</label>
                           <input type="text" value={formData.level} onChange={e=>setFormData({...formData, level: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white" />
                       </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                       <div>
                           <label className="block text-sm text-gray-600 mb-1">Linked NCR (Optional)</label>
                           <input type="text" value={formData.linked_ncr} onChange={e=>setFormData({...formData, linked_ncr: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                       <div>
                           <label className="block text-sm text-gray-600 mb-1">Linked RFI (Optional)</label>
                           <input type="text" value={formData.linked_rfi} onChange={e=>setFormData({...formData, linked_rfi: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                   </div>

                   <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                       <button type="submit" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm">สร้าง Issue</button>
                   </div>
               </form>
           </div>
       )}

       {activeView === 'detail' && selectedIssue && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                       <div className={`absolute top-0 left-0 w-1 h-full ${SEVERITIES[selectedIssue.severity as keyof typeof SEVERITIES].bg.replace('50', '500')}`}></div>
                       <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                           <div>
                               <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-2xl font-bold text-gray-900">{selectedIssue.title}</h3>
                               </div>
                               <p className="text-gray-500 text-sm font-mono">{selectedIssue.id} • {selectedIssue.category}</p>
                           </div>
                           <div className="text-right">
                               <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border ${getStatusColor(selectedIssue.status)}`}>
                                   {selectedIssue.status}
                               </span>
                           </div>
                       </div>
                       
                       <div className="prose prose-sm max-w-none text-gray-800 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl">
                           <p className="whitespace-pre-wrap">{selectedIssue.description}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                           <div className="bg-white border rounded-xl p-3">
                               <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Location</p>
                               <span className="font-bold">Zone {selectedIssue.location.zone}, Level {selectedIssue.location.level}</span>
                           </div>
                           <div className="bg-white border rounded-xl p-3">
                               <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Identified By</p>
                               <span className="font-bold">{selectedIssue.identified_by} <span className="font-normal text-xs text-gray-500">at {new Date(selectedIssue.date_identified).toLocaleString()}</span></span>
                           </div>
                       </div>
                   </div>

                   {(selectedIssue.status === 'OPEN' || selectedIssue.status === 'ASSIGNED') && !isOwner && (
                       <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                           <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-brand-600"/> Resolution Update</h4>
                           <form onSubmit={handleResolveIssue}>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Resolution Action / Plan *</label>
                               <textarea value={resolveData.plan} onChange={e=>setResolveData({...resolveData, plan: e.target.value})} rows={3} required placeholder="เราได้ดำเนินการแก้ไขอย่างไร..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:bg-white resize-none mb-3"></textarea>
                               
                               <label className="block text-sm font-bold text-gray-700 mb-1">Evidence Reference (e.g., Photo URL or Ref Code)</label>
                               <input type="text" value={resolveData.evidence} onChange={e=>setResolveData({...resolveData, evidence: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:bg-white mb-4" />
                               
                               <button type="submit" className="w-full px-4 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm transition">
                                   Mark as Resolved
                               </button>
                           </form>
                       </div>
                   )}
                   
                   {(selectedIssue.status === 'RESOLVED' || selectedIssue.status === 'VERIFIED' || selectedIssue.status === 'CLOSED') && (
                       <div className="bg-blue-50 bg-opacity-50 rounded-[24px] border border-blue-100 shadow-sm p-6 relative">
                           <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Info size={18} className="text-blue-600"/> Resolution Details</h4>
                           <div className="bg-white p-4 rounded-xl border border-blue-100 text-sm text-gray-800 mb-4">
                               {selectedIssue.resolution_plan}
                           </div>
                           {selectedIssue.resolution_evidence.length > 0 && (
                               <div className="text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg font-mono">
                                   Evidence: {selectedIssue.resolution_evidence.join(', ')}
                               </div>
                           )}
                       </div>
                   )}
               </div>

               <div className="space-y-6">
                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                       <h4 className="font-bold text-gray-900 mb-4">Issue Details</h4>
                       <div className="space-y-4 text-sm">
                           <div>
                               <p className="text-gray-500 mb-1">Severity</p>
                               <span className={`px-2 py-1 rounded text-xs font-bold ${SEVERITIES[selectedIssue.severity as keyof typeof SEVERITIES].color}`}>{selectedIssue.severity}</span>
                           </div>
                           <div>
                               <p className="text-gray-500 mb-1">Target Resolution</p>
                               <p className="font-bold text-gray-900">{SEVERITIES[selectedIssue.severity as keyof typeof SEVERITIES].hours} Hrs</p>
                           </div>
                           <div>
                               <p className="text-gray-500 mb-1">Assigned To</p>
                               <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIssue.assigned_to.map((a: string) => <span key={a} className="bg-gray-100 text-gray-700 px-2 py-1 flex rounded font-medium text-xs">{a}</span>)}
                               </div>
                           </div>
                       </div>
                       
                       <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                           {selectedIssue.status === 'RESOLVED' && !isOwner && !isContractor && (
                               <button onClick={() => handleVerify(selectedIssue.id)} className="w-full px-4 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl text-sm font-bold transition">Verify Resolution</button>
                           )}
                           {((selectedIssue.status === 'VERIFIED' || selectedIssue.status === 'RESOLVED') && (isPM || isEngineer)) && (
                               <button onClick={() => handleClose(selectedIssue.id, selectedIssue.severity)} className="w-full px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-xl text-sm font-bold transition">Close Issue</button>
                           )}
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
