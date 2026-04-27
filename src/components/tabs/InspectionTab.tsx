import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Search, Filter, Plus, FileSignature, CheckCircle, XCircle, AlertTriangle, MessageSquare, ArrowRight, ClipboardCheck, BarChart, FileJson } from 'lucide-react';

const INSPECTION_TYPES = ['Pre-pour', 'Post-pour', 'MEP rough-in', 'Waterproof', 'Final'];

const CHECKLIST_TEMPLATES: Record<string, any[]> = {
    'Pre-pour': [
        { id: 1, desc: 'Formwork dimensions and stability checked', mandatory: true },
        { id: 2, desc: 'Reinforcement type, spacing, and cover verified', mandatory: true },
        { id: 3, desc: 'Cleanliness of forms (free of debris)', mandatory: true },
        { id: 4, desc: 'MEP sleeves and blockouts in place', mandatory: true },
        { id: 5, desc: 'Surveyor coordinate points verified', mandatory: false },
    ],
    'MEP rough-in': [
        { id: 1, desc: 'Pipe / duct routing conforms to approved shop drawing', mandatory: true },
        { id: 2, desc: 'Supports and hangers installed securely at correct spacing', mandatory: true },
        { id: 3, desc: 'Pressure testing / leak testing completed if applicable', mandatory: true },
        { id: 4, desc: 'Clearance from other services maintained', mandatory: false },
    ]
};

export const InspectionTab = ({ project, user }: { project: Project, user: any }) => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'inspect' | 'ncr' | 'dashboard'>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [inspections, setInspections] = useState([
     {
         id: 'IR-2604-001',
         inspection_type: 'Pre-pour',
         location: { zone: 'A', level: 'L1', grid_ref: 'C-D / 4-5' },
         work_item: 'Column C1, C2',
         contractor_request_date: '2026-04-27T09:00',
         ITP_ref: 'ITP-STR-01',
         requested_by: 'Contractor A',
         status: 'REQUESTED',
         checklist: [],
         ncr_ref: null,
         result: null
     },
     {
         id: 'IR-2604-002',
         inspection_type: 'MEP rough-in',
         location: { zone: 'B', level: 'L2', grid_ref: 'Corridor' },
         work_item: 'HVAC Chilled Water Ducts',
         contractor_request_date: '2026-04-25T14:00',
         ITP_ref: 'ITP-MEP-04',
         requested_by: 'Contractor B',
         status: 'FAILED',
         checklist: [], // Mock past checklist
         ncr_ref: 'NCR-MEP-001',
         result: 'FAIL'
     }
  ]);

  const [ncrs, setNcrs] = useState([
      {
          ncr_number: 'NCR-MEP-001',
          related_ir: 'IR-2604-002',
          failed_items: ['Insufficient support hangers spacing'],
          corrective_action_required: 'Add hangers at max 1.5m spacing',
          reinspection_date: '2026-04-28',
          responsible_party: 'Contractor B',
          status: 'OPEN',
          cap_submitted: false
      }
  ]);

  const role = user?.role || 'pm';
  const isContractor = role === 'contractor';
  const isQC = role === 'qc';
  const isEngineer = role === 'engineer';
  const isPM = role === 'pm' || role === 'admin';
  const isOwner = role === 'owner';

  // State for form
  const [reqData, setReqData] = useState({
      type: 'Pre-pour',
      zone: '', level: '', grid: '',
      work_item: '',
      date: '',
      itp: ''
  });

  // State for checklist inspection
  const [checklistResults, setChecklistResults] = useState<Record<number, {result: string, remark: string}>>({});

  const handleRequest = (e: React.FormEvent) => {
      e.preventDefault();
      const newIr = {
          id: `IR-2604-${String(inspections.length + 1).padStart(3, '0')}`,
          inspection_type: reqData.type,
          location: { zone: reqData.zone, level: reqData.level, grid_ref: reqData.grid },
          work_item: reqData.work_item,
          contractor_request_date: reqData.date,
          ITP_ref: reqData.itp,
          requested_by: user?.name || 'Contractor',
          status: 'REQUESTED',
          checklist: [],
          ncr_ref: null,
          result: null
      };
      setInspections([newIr, ...inspections]);
      toast.success('ส่งคำขอตรวจงานเรียบร้อยแล้ว');
      setActiveView('list');
  };

  const submitInspectionResult = (irId: string, finalResult: 'PASS' | 'FAIL' | 'CONDITIONAL') => {
      if (!isQC && !isPM) {
          toast.error("เฉพาะ QC Inspector (หรือ PM override) เท่านั้นที่บันทึกผลได้");
          return;
      }
      
      const targetIr = inspections.find(i => i.id === irId);
      if (!targetIr) return;

      const template = CHECKLIST_TEMPLATES[targetIr.inspection_type] || CHECKLIST_TEMPLATES['Pre-pour'];
      
      const hasFail = template.some(t => t.mandatory && checklistResults[t.id]?.result === 'Fail');
      if (finalResult === 'PASS' && hasFail && !isPM) {
          toast.error("มีรายการบังคับที่ Fail ไม่สามารถระบุว่าผ่านได้ (นอกเสียจาก PM Override)");
          return;
      }

      setInspections(list => list.map(item => {
          if (item.id === irId) {
              return { ...item, status: finalResult === 'PASS' ? 'RELEASED' : finalResult === 'FAIL' ? 'FAILED' : 'CONDITIONAL', result: finalResult, checklist: checklistResults };
          }
          return item;
      }));

      toast.success(`บันทึกผลเป็น ${finalResult} สำเร็จ`);

      if (finalResult === 'FAIL') {
          // Generate NCR
          const newNcr = {
              ncr_number: `NCR-${targetIr.inspection_type.split(' ')[0]}-${String(ncrs.length+1).padStart(3, '0')}`,
              related_ir: irId,
              failed_items: template.filter(t => checklistResults[t.id]?.result === 'Fail').map(t => t.desc),
              corrective_action_required: '',
              reinspection_date: '',
              responsible_party: targetIr.requested_by,
              status: 'OPEN',
              cap_submitted: false
          };
          setNcrs([newNcr, ...ncrs]);
          setInspections(list => list.map(item => item.id === irId ? { ...item, ncr_ref: newNcr.ncr_number } : item));
          toast('ระบบสร้าง NCR อัตโนมัติจากผลการตรวจ', { icon: '🚨' });
      }

      setActiveView('list');
      setChecklistResults({});
  };

  const handleCapSubmit = (ncrNumber: string) => {
      setNcrs(list => list.map(n => n.ncr_number === ncrNumber ? { ...n, cap_submitted: true } : n));
      toast.success("ส่ง Action Plan ให้ QC ตรวจพิจารณาแล้ว");
  };

  const handleCloseNcr = (ncrNumber: string) => {
      if (!isPM && !isQC) {
          toast.error("QC ตรวจสอบและ PM ลงนามปิด NCR");
          return;
      }
      setNcrs(list => list.map(n => n.ncr_number === ncrNumber ? { ...n, status: 'CLOSED' } : n));
      toast.success("ปิด NCR สำเร็จ");
  };

  const getStatusColor = (st: string) => {
      if (st === 'REQUESTED') return 'bg-blue-100 text-blue-700';
      if (st === 'RELEASED') return 'bg-emerald-100 text-emerald-700';
      if (st === 'FAILED') return 'bg-red-100 text-red-700';
      if (st === 'CONDITIONAL') return 'bg-amber-100 text-amber-700';
      return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 gap-4">
           <div>
              <h2 className="text-xl font-bold text-gray-900">Quality Control (QC / ITP)</h2>
              <p className="text-sm text-gray-500 mt-1">จัดการคำขอตรวจงาน, Checklist และ NCR</p>
           </div>
           <div className="flex gap-2">
               {(isOwner || isPM || isQC) && activeView === 'list' && (
                   <button onClick={() => setActiveView('dashboard')} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition flex items-center gap-2">
                       <BarChart size={16} /> Dashboard
                   </button>
               )}
               {activeView === 'list' && (isContractor || isPM) && (
                  <button onClick={() => setActiveView('create')} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center gap-2">
                     <Plus size={18} /> Request Inspection
                  </button>
               )}
               {activeView !== 'list' && (
                  <button onClick={() => { setActiveView('list'); setSelectedItem(null); setChecklistResults({}); }} className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                     กลับไปหน้ารวม
                  </button>
               )}
           </div>
       </div>

       {activeView === 'dashboard' && (
           <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                       <span className="text-gray-500 font-bold mb-2">First-Pass Rate</span>
                       <span className="text-4xl font-bold text-emerald-600">85%</span>
                   </div>
                   <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                       <span className="text-gray-500 font-bold mb-2">Open NCRs</span>
                       <span className="text-4xl font-bold text-red-600">{ncrs.filter(n=>n.status==='OPEN').length}</span>
                   </div>
                   <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                       <span className="text-gray-500 font-bold mb-2">Avg Days to Close NCR</span>
                       <span className="text-4xl font-bold text-amber-600">4.2</span>
                   </div>
                   <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center items-center">
                       <span className="text-gray-500 font-bold mb-2">Total Inspections</span>
                       <span className="text-4xl font-bold text-brand-600">{inspections.length}</span>
                   </div>
               </div>
               
               <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-3xl">
                   <h3 className="font-bold text-gray-900 mb-4 border-b pb-4">NCR Log</h3>
                   <div className="space-y-3">
                       {ncrs.map(ncr => (
                           <div key={ncr.ncr_number} className="p-4 border border-gray-100 bg-gray-50 rounded-xl flex justify-between items-center cursor-pointer hover:border-brand-300 hover:bg-white transition" onClick={() => { setSelectedItem(ncr); setActiveView('ncr'); }}>
                               <div>
                                   <div className="flex items-center gap-3">
                                       <span className="font-bold text-gray-900">{ncr.ncr_number}</span>
                                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ncr.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{ncr.status}</span>
                                       {ncr.cap_submitted && ncr.status === 'OPEN' && <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">QC Reviewing CAP</span>}
                                   </div>
                                   <p className="text-sm text-gray-600 mt-1">Ref IR: {ncr.related_ir} | Resp: {ncr.responsible_party}</p>
                               </div>
                               <ArrowRight size={18} className="text-gray-400" />
                           </div>
                       ))}
                   </div>
               </div>
           </div>
       )}

       {activeView === 'list' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                               <th className="p-4">IR Number</th>
                               <th className="p-4">Type & Item</th>
                               <th className="p-4">Location</th>
                               <th className="p-4">Req. Date/Time</th>
                               <th className="p-4">Status</th>
                               <th className="p-4">Action</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {inspections.map(ir => (
                               <tr key={ir.id} className="hover:bg-brand-50/50 transition">
                                   <td className="p-4 font-mono text-sm font-bold text-brand-600">{ir.id}</td>
                                   <td className="p-4">
                                       <p className="font-bold text-gray-900 text-sm">{ir.inspection_type}</p>
                                       <p className="text-xs text-gray-500 mt-0.5">{ir.work_item}</p>
                                   </td>
                                   <td className="p-4 text-sm text-gray-600">
                                       Z: {ir.location.zone} L: {ir.location.level} <br/>
                                       <span className="text-xs bg-gray-100 px-1 rounded font-mono">{ir.location.grid_ref}</span>
                                   </td>
                                   <td className="p-4 text-sm font-medium text-gray-700">{ir.contractor_request_date}</td>
                                   <td className="p-4">
                                       <div className="flex flex-col items-start gap-1">
                                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusColor(ir.status)}`}>{ir.status}</span>
                                          {ir.ncr_ref && (
                                              <span onClick={() => { setSelectedItem(ncrs.find(n=>n.ncr_number===ir.ncr_ref)); setActiveView('ncr'); }} className="text-[10px] text-red-600 font-bold underline cursor-pointer hover:text-red-800">Has NCR: {ir.ncr_ref}</span>
                                          )}
                                       </div>
                                   </td>
                                   <td className="p-4">
                                       {ir.status === 'REQUESTED' ? (
                                           <button onClick={() => {
                                               if(isQC || isPM || isEngineer) {
                                                  setSelectedItem(ir); setActiveView('inspect');
                                               } else {
                                                  toast('กำลังรอ QC ดำเนินการเข้าตรวจ');
                                               }
                                           }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition border border-gray-200">
                                               {isQC || isPM || isEngineer ? 'Inspect' : 'View'}
                                           </button>
                                       ) : (
                                           <span className="text-xs text-gray-400 font-bold">Checked</span>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}

       {activeView === 'create' && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-2xl mx-auto">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><ClipboardCheck className="text-brand-600"/> Request for Inspection</h3>
               <form onSubmit={handleRequest} className="space-y-5">
                   <div className="grid grid-cols-2 gap-5">
                       <div className="col-span-2 md:col-span-1">
                           <label className="block text-sm font-bold text-gray-700 mb-1">Inspection Type *</label>
                           <select value={reqData.type} onChange={e=>setReqData({...reqData, type: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-500 focus:bg-white">
                               {INSPECTION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                           </select>
                       </div>
                       <div className="col-span-2 md:col-span-1">
                           <label className="block text-sm font-bold text-gray-700 mb-1">ITP Reference (Optional)</label>
                           <input type="text" value={reqData.itp} onChange={e=>setReqData({...reqData, itp: e.target.value})} placeholder="e.g. ITP-STR-01" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Work Item Description *</label>
                       <input type="text" value={reqData.work_item} onChange={e=>setReqData({...reqData, work_item: e.target.value})} required placeholder="What is ready for inspection?" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Zone</label>
                           <input type="text" value={reqData.zone} onChange={e=>setReqData({...reqData, zone: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Level</label>
                           <input type="text" value={reqData.level} onChange={e=>setReqData({...reqData, level: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Grid Ref</label>
                           <input type="text" value={reqData.grid} onChange={e=>setReqData({...reqData, grid: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Requested Date & Time *</label>
                       <input type="datetime-local" value={reqData.date} onChange={e=>setReqData({...reqData, date: e.target.value})} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                   </div>

                   <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                       <button type="submit" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md text-sm">Submit Request</button>
                   </div>
               </form>
           </div>
       )}

       {activeView === 'inspect' && selectedItem && (
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-4xl mx-auto">
               <div className="flex justify-between items-start mb-6">
                   <div>
                       <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CheckCircle className="text-emerald-500"/> Inspection Checklist</h3>
                       <p className="text-gray-500 text-sm mt-1">{selectedItem.id} | {selectedItem.inspection_type} - {selectedItem.work_item}</p>
                   </div>
               </div>

               <div className="space-y-4 mb-8">
                   {(CHECKLIST_TEMPLATES[selectedItem.inspection_type] || CHECKLIST_TEMPLATES['Pre-pour']).map(item => (
                       <div key={item.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="flex-1">
                               <p className="font-medium text-sm text-gray-800">
                                   {item.desc}
                                   {item.mandatory && <span className="ml-2 text-[10px] text-red-500 bg-red-50 border border-red-100 px-1 py-0.5 rounded font-bold uppercase">Mandatory</span>}
                               </p>
                               <input type="text" placeholder="Remarks / Ref" 
                                      className="mt-2 text-xs p-1.5 border border-gray-300 rounded w-full max-w-xs focus:border-brand-500 focus:outline-none" 
                                      value={checklistResults[item.id]?.remark || ''}
                                      onChange={(e) => setChecklistResults(prev => ({...prev, [item.id]: {...(prev[item.id] || {result: ''}), remark: e.target.value}}))}
                                />
                           </div>
                           <div className="flex gap-2">
                               <button 
                                   onClick={() => setChecklistResults(prev => ({...prev, [item.id]: {...(prev[item.id] || {remark: ''}), result: 'Pass'}}))}
                                   className={`px-3 py-1.5 text-xs font-bold rounded-lg transition border ${checklistResults[item.id]?.result === 'Pass' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                                   Pass
                               </button>
                               <button 
                                   onClick={() => setChecklistResults(prev => ({...prev, [item.id]: {...(prev[item.id] || {remark: ''}), result: 'Fail'}}))}
                                   className={`px-3 py-1.5 text-xs font-bold rounded-lg transition border ${checklistResults[item.id]?.result === 'Fail' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                                   Fail
                               </button>
                               <button 
                                   onClick={() => setChecklistResults(prev => ({...prev, [item.id]: {...(prev[item.id] || {remark: ''}), result: 'N/A'}}))}
                                   className={`px-3 py-1.5 text-xs font-bold rounded-lg transition border ${checklistResults[item.id]?.result === 'N/A' ? 'bg-gray-200 border-gray-500 text-gray-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                                   N/A
                               </button>
                           </div>
                       </div>
                   ))}
               </div>

               <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                   <p className="text-sm text-gray-500">QC Inspector must ensure all mandatory items pass.</p>
                   <div className="flex gap-3 w-full md:w-auto">
                       <button onClick={() => submitInspectionResult(selectedItem.id, 'PASS')} className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow flex items-center justify-center gap-2">
                           <CheckCircle size={18} /> Release (PASS)
                       </button>
                       <button onClick={() => submitInspectionResult(selectedItem.id, 'FAIL')} className="flex-1 md:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow flex items-center justify-center gap-2">
                           <XCircle size={18} /> Issue NCR (FAIL)
                       </button>
                   </div>
               </div>
           </div>
       )}

       {activeView === 'ncr' && selectedItem && (
           <div className="bg-white rounded-[24px] border border-red-100 shadow-sm p-6 max-w-3xl mx-auto relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
               <div className="flex justify-between items-start mb-6">
                   <div>
                       <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                           <AlertTriangle className="text-red-500"/>
                           Non-Conformance Report
                       </h3>
                       <p className="text-red-600 text-sm font-mono mt-1 font-bold">{selectedItem.ncr_number} • Ref IR: {selectedItem.related_ir}</p>
                   </div>
                   <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${selectedItem.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                       {selectedItem.status}
                   </span>
               </div>

               <div className="space-y-6">
                   <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                       <h4 className="font-bold text-red-900 text-sm mb-2">Failed Items / Discrepancy</h4>
                       <ul className="list-disc ml-5 text-sm text-red-800 space-y-1">
                           {selectedItem.failed_items.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                       </ul>
                   </div>

                   {selectedItem.status === 'OPEN' && (
                       <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                           <h4 className="font-bold text-gray-900 mb-4">Corrective Action Plan (CAP)</h4>
                           
                           {isContractor && !selectedItem.cap_submitted ? (
                               <div className="space-y-4">
                                   <p className="text-sm text-gray-600">Please provide your plan to rectify the above issues and submit for QC review.</p>
                                   <textarea rows={4} placeholder="Describe rectification method..." className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:border-brand-500 resize-none"></textarea>
                                   <button onClick={() => handleCapSubmit(selectedItem.ncr_number)} className="bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-brand-700 shadow max-w-max">Submit CAP</button>
                               </div>
                           ) : selectedItem.cap_submitted ? (
                               <div className="space-y-4">
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">Contractor has submitted CAP. Awaiting QC/PM verification on site.</div>
                                    {(isQC || isPM) && (
                                        <div className="pt-4 border-t border-gray-200 flex gap-3">
                                            <button onClick={() => handleCloseNcr(selectedItem.ncr_number)} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-emerald-700 shadow">Verify & Close NCR</button>
                                            <button onClick={() => toast.error('NCR Rejected. Contractor must revise CAP.')} className="bg-white border border-red-300 text-red-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-50">Reject CAP</button>
                                        </div>
                                    )}
                               </div>
                           ) : (
                               <p className="text-sm text-amber-600 font-bold">Waiting for Contractor to submit CAP.</p>
                           )}
                       </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};
