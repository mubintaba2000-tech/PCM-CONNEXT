import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, XCircle, FileText, Download, Plus, Eye, CheckSquare, ShieldAlert } from 'lucide-react';

interface PaymentRequest {
  id: string;
  milestone_id: string;
  work_description: string;
  amount: number;
  supporting_docs: string[]; 
  submitted_by_role: string;
  submitted_by_name: string;
  status: string; // 'pending_engineer' | 'pending_pm' | 'pending_owner' | 'approved' | 'rejected' | 'paid'
  approval_chain: { role: string; action: string; date: string; remarks?: string }[];
  created_at: string;
}

export const FinanceTab = ({ project, user }: { project: Project, user: any }) => {
  const f = project.finance || { budget: 10000000, spent: 2150000, pending: 0 };
  let spentPerc = f.budget > 0 ? (f.spent / f.budget) * 100 : 0;
  if (spentPerc > 100) spentPerc = 100;

  const [requests, setRequests] = useState<PaymentRequest[]>([
    {
      id: 'PRJ-PAY-001',
      milestone_id: 'MS-01',
      work_description: 'เตรียมพื้นที่และงานฐานราก',
      amount: 2150000,
      supporting_docs: ['BOQ', 'progress_photos', 'inspection_cert'],
      submitted_by_role: 'contractor',
      submitted_by_name: 'ผู้รับเหมา A',
      status: 'paid',
      approval_chain: [
        { role: 'contractor', action: 'submitted', date: '2026-02-01' },
        { role: 'engineer', action: 'verified', date: '2026-02-02' },
        { role: 'pm', action: 'approved', date: '2026-02-03' },
        { role: 'owner', action: 'approved', date: '2026-02-04' }
      ],
      created_at: '2026-02-01'
    },
    {
      id: 'PRJ-PAY-002',
      milestone_id: 'MS-02',
      work_description: 'งานโครงสร้างชั้น 1',
      amount: 3500000,
      supporting_docs: ['BOQ', 'progress_photos'],
      submitted_by_role: 'contractor',
      submitted_by_name: 'ผู้รับเหมา A',
      status: 'pending_engineer',
      approval_chain: [
        { role: 'contractor', action: 'submitted', date: '2026-04-12' }
      ],
      created_at: '2026-04-12'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<PaymentRequest | null>(null);

  const [newReq, setNewReq] = useState({
    work_description: '',
    amount: '',
    docs: { BOQ: false, progress_photos: false, inspection_cert: false }
  });

  const role = user?.role || 'client';
  
  const canSubmit = role === 'contractor' || role === 'pm';
  const canSeeLedger = role === 'owner' || role === 'pm' || role === 'admin';
  const canViewAudit = role === 'admin';

  // "contractor: submit only, view own requests" - For demo, we assume all mock reqs are theirs if they are contractor.

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(newReq.amount.replace(/,/g, ''));
    
    // Validations
    if (amountNum <= 0) return toast.error('Amount must be greater than 0');
    if (amountNum > f.budget - f.spent) return toast.error('Amount exceeds remaining budget');
    if (!newReq.docs.BOQ || !newReq.docs.progress_photos || !newReq.docs.inspection_cert) {
        return toast.error('Missing required supporting documents (BOQ, Photos, Inspection Cert)');
    }
    
    const req: PaymentRequest = {
        id: `PRJ-PAY-00${requests.length + 1}`,
        milestone_id: 'MS-NEW',
        work_description: newReq.work_description,
        amount: amountNum,
        supporting_docs: ['BOQ', 'progress_photos', 'inspection_cert'],
        submitted_by_role: role,
        submitted_by_name: user?.name || 'Unknown',
        status: 'pending_engineer',
        approval_chain: [
            { role: role, action: 'submitted', date: new Date().toISOString().split('T')[0] }
        ],
        created_at: new Date().toISOString().split('T')[0]
    };

    setRequests([req, ...requests]);
    setShowModal(false);
    toast.success('Payment Request Submitted');

    console.log(JSON.stringify({
        status: 'pending',
        approval_chain: req.approval_chain,
        next_action: 'Site Engineer verification required',
        remarks: 'Successfully routed to engineer'
    }, null, 2));
  };

  const handleAction = (req: PaymentRequest, action: 'approve' | 'reject') => {
    let nextStatus = req.status;
    let actionDesc = action === 'approve' ? 'approved' : 'rejected';

    if (action === 'reject') {
        nextStatus = 'rejected';
    } else {
        if (role === 'engineer' && req.status === 'pending_engineer') {
            nextStatus = 'pending_pm';
            actionDesc = 'verified completion';
        } else if (role === 'pm' && req.status === 'pending_pm') {
            if (req.amount > 500000) {
                 toast.error('PM can only approve up to 500,000 THB directly. Forwarding to Owner.');
                 nextStatus = 'pending_owner';
                 actionDesc = 'reviewed and forwarded';
            } else if (req.amount > 100000) {
                 nextStatus = 'pending_owner';
                 actionDesc = 'reviewed and forwarded (Amount > 100k)';
            } else {
                 nextStatus = 'approved';
            }
        } else if (role === 'owner' && req.status === 'pending_owner') {
            nextStatus = 'approved';
        } else {
            return toast.error('Not authorized for this step');
        }
    }

    const updated = {
        ...req,
        status: nextStatus,
        approval_chain: [
            ...req.approval_chain,
            { role, action: actionDesc, date: new Date().toISOString().split('T')[0] }
        ]
    };

    setRequests(requests.map(r => r.id === req.id ? updated : r));
    setShowDetail(null);
    toast.success(`Action applied: ${actionDesc}`);

    console.log(JSON.stringify({
        status: nextStatus,
        approval_chain: updated.approval_chain,
        next_action: nextStatus.includes('pending') ? `Wait for ${nextStatus.split('_')[1]}` : 'None',
        remarks: `Workflow updated by ${role}`
    }, null, 2));
  };

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'paid': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><CheckCircle size={14}/> Paid</span>;
          case 'approved': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><CheckSquare size={14}/> Approved</span>;
          case 'rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><XCircle size={14}/> Rejected</span>;
          default: return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><Clock size={14}/> {status.replace('_', ' ').toUpperCase()}</span>;
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Finance & Payment Milestones</h2>
          <p className="text-sm text-gray-500 mt-1">Manage construction payment milestones and invoices</p>
        </div>
        <div className="flex gap-2">
          {canSubmit && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-brand-700 transition flex items-center gap-2">
            <Plus size={16} /> Create Payment Request
          </button>
          )}
        </div>
      </div>

      {canSeeLedger && (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] p-6 text-white shadow-xl mb-6">
        <p className="text-slate-400 text-sm font-medium mb-1">Total Budget</p>
        <h3 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">฿{f.budget.toLocaleString()}</h3>
        
        <div className="w-full bg-slate-700/50 h-3 rounded-full overflow-hidden mb-3">
          <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${spentPerc}%` }}></div>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-emerald-400">Spent ฿{f.spent.toLocaleString()} ({Math.round(spentPerc)}%)</span>
          <span className="text-slate-400">Remaining ฿{(f.budget - f.spent).toLocaleString()}</span>
        </div>
      </div>
      )}

      {/* Payment Requests List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-3">Payment Requests</h3>
        
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                     <div>
                       <h4 className="font-bold text-gray-900 text-sm">{req.work_description}</h4>
                       <p className="text-xs text-gray-500 mt-1">ID: {req.id} | Date: {req.created_at}</p>
                     </div>
                     <p className="font-black text-gray-900 md:hidden">฿{req.amount.toLocaleString()}</p>
                   </div>
                   <div className="mt-3 flex flex-wrap gap-2">
                      {getStatusBadge(req.status)}
                      {req.status === 'approved' && <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold w-max flex items-center gap-1"><ShieldAlert size={14}/> 5% Retention Applied</span>}
                   </div>
                </div>
                <div className="flex items-center gap-4 md:w-auto w-full justify-between md:justify-end">
                   <div className="text-right hidden md:block">
                      <p className="font-black text-gray-900 text-lg">฿{req.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Submitted by: {req.submitted_by_role}</p>
                   </div>
                   <button onClick={() => setShowDetail(req)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-colors shrink-0 shadow-sm"><Eye size={20}/></button>
                </div>
            </div>
          ))}
        </div>
      </div>

      {canViewAudit && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Audit Log</h3>
          <div className="text-xs font-mono bg-slate-900 text-green-400 p-4 rounded-xl overflow-x-auto whitespace-pre">
            {JSON.stringify(requests.map(r => ({ id: r.id, chain: r.approval_chain })), null, 2)}
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold">New Payment Request</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>
                <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Work Description</label>
                        <input type="text" className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 bg-gray-50 focus:bg-white transition-all text-sm" placeholder="e.g. Foundation completion" value={newReq.work_description} onChange={e => setNewReq({...newReq, work_description: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Amount (THB)</label>
                        <input type="number" className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 bg-gray-50 focus:bg-white transition-all text-sm" placeholder="150000" value={newReq.amount} onChange={e => setNewReq({...newReq, amount: e.target.value})} required />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-sm font-bold text-blue-900 mb-3 text-center">Required Documents</label>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-100/50">
                                <input type="checkbox" checked={newReq.docs.BOQ} onChange={e => setNewReq({...newReq, docs: {...newReq.docs, BOQ: e.target.checked}})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> BOQ Document
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-100/50">
                                <input type="checkbox" checked={newReq.docs.progress_photos} onChange={e => setNewReq({...newReq, docs: {...newReq.docs, progress_photos: e.target.checked}})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> Progress Photos
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-100/50">
                                <input type="checkbox" checked={newReq.docs.inspection_cert} onChange={e => setNewReq({...newReq, docs: {...newReq.docs, inspection_cert: e.target.checked}})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> Inspection Certificate
                            </label>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full h-12 bg-brand-600 text-white rounded-xl font-bold shadow-md hover:bg-brand-700 transition">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                    <div>
                       <h3 className="text-xl font-bold">{showDetail.work_description}</h3>
                       <p className="text-xs text-gray-500">ID: {showDetail.id} | Amount: ฿{showDetail.amount.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>

                <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Approval Chain</h4>
                   <div className="space-y-4">
                     {showDetail.approval_chain.map((step, i) => (
                       <div key={i} className="flex gap-3 text-sm">
                          <div className="w-2 bg-brand-200 rounded-full mt-1.5 mb-1 relative before:absolute before:left-1/2 before:-translate-x-1/2 before:-bottom-4 before:h-4 before:w-0.5 before:bg-brand-200 last:before:hidden"></div>
                          <div>
                            <p className="font-bold text-gray-800 capitalize">{step.role} <span className="font-normal text-gray-500">({step.date})</span></p>
                            <p className="text-brand-600 font-medium text-xs">{step.action}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="flex gap-2">
                   {showDetail.status === 'paid' && <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm flex justify-center items-center gap-2 hover:bg-gray-200 transition"><Download size={16}/> Download Payment Cert</button>}
                   
                   {/* Verification logic */}
                   {role === 'engineer' && showDetail.status === 'pending_engineer' && (
                       <button onClick={() => handleAction(showDetail, 'approve')} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition">Verify On-Site Completion</button>
                   )}
                   {role === 'pm' && showDetail.status === 'pending_pm' && (
                       <button onClick={() => handleAction(showDetail, 'approve')} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition text-center px-2">Review BOQ & {showDetail.amount <= 100000 ? 'Approve' : 'Forward'}</button>
                   )}
                   {role === 'owner' && showDetail.status === 'pending_owner' && (
                       <button onClick={() => handleAction(showDetail, 'approve')} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition">Final Approval</button>
                   )}
                   {['engineer', 'pm', 'owner'].includes(role) && showDetail.status.includes('pending') && (
                       <button onClick={() => handleAction(showDetail, 'reject')} className="w-14 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl text-sm transition flex justify-center items-center shrink-0"><XCircle size={20}/></button>
                   )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
