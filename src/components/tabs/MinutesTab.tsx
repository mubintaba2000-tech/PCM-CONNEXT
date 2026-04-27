import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Users, Calendar, AlertCircle, FileText, CheckCircle, Clock, Plus, Target, ArrowRight, Eye, Edit2, Lock } from 'lucide-react';

const MEETING_TYPES = [
    'Weekly Site Meeting (WSM)',
    'Design Coordination Meeting (DCM)',
    'Emergency Meeting',
    'Owner Progress Meeting'
];

export const MinutesTab = ({ project, user }: { project: Project, user: any }) => {
    const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedMom, setSelectedMom] = useState<any>(null);

    const [moms, setMoms] = useState([
        {
            id: 'PRJ-MOM-001',
            type: 'Weekly Site Meeting (WSM)',
            date: '2026-04-20T10:00:00Z',
            location: 'Site Office 1',
            chaired_by: 'PM',
            status: 'FINALIZED',
            attendees: [
                { name: 'John Doe', company: 'ABC Construction', role: 'PM', present: true },
                { name: 'Jane Smith', company: 'Global Design', role: 'Engineer', present: true },
            ],
            agendaItems: [
                {
                    item_no: 1,
                    topic: 'Safety Review',
                    discussion: 'Reviewed missing guardrails issue.',
                    decisions: ['All sub-contractors must ensure edge protection.'],
                    action_items: [
                        { id: 'ACT-001', action: 'Install guardrails at L4', responsible: 'Contractor A', due_date: '2026-04-22', priority: 'High', status: 'Closed' }
                    ]
                }
            ],
            next_meeting: { date: '2026-04-27T10:00:00Z', agenda_preview: ['Review outstanding actions', 'Progress Update'] }
        },
        {
            id: 'PRJ-MOM-002',
            type: 'Design Coordination Meeting (DCM)',
            date: '2026-04-24T14:00:00Z',
            location: 'Meeting Room B',
            chaired_by: 'Engineer',
            status: 'DRAFT',
            attendees: [
                { name: 'Alice Wong', company: 'Build Co', role: 'Engineer', present: true },
                { name: 'Bob Lee', company: 'Owner Reps', role: 'Owner', present: false },
            ],
            agendaItems: [
                {
                    item_no: 1,
                    topic: 'HVAC Layout Conflict',
                    discussion: 'Duct clashing with cable tray at Corridor A.',
                    decisions: ['HVAC duct will be lowered by 150mm.'],
                    action_items: [
                        { id: 'ACT-002', action: 'Revise combined service drawing', responsible: 'Engineer', due_date: '2026-04-28', priority: 'Medium', status: 'Open' }
                    ]
                }
            ],
            next_meeting: { date: '2026-05-08T14:00:00Z', agenda_preview: ['Review revised drawings'] }
        }
    ]);

    const role = user?.role || 'pm';
    const isClerk = role === 'secretary' || role === 'pm' || role === 'engineer' || role === 'admin';
    const isChairperson = role === 'pm' || role === 'admin'; // simplification

    const handleFinalize = (id: string) => {
        setMoms(list => list.map(m => m.id === id ? { ...m, status: 'FINALIZED' } : m));
        toast.success('MOM Finalized & Locked. Notifications sent to attendees.');
        if (selectedMom?.id === id) {
            setSelectedMom({ ...selectedMom, status: 'FINALIZED' });
        }
    };

    const updateActionStatus = (momId: string, actionId: string, newStatus: string) => {
        setMoms(list => list.map(m => {
            if (m.id === momId) {
                return {
                    ...m,
                    agendaItems: m.agendaItems.map((ag: any) => ({
                        ...ag,
                        action_items: ag.action_items.map((act: any) => 
                            act.id === actionId ? { ...act, status: newStatus } : act
                        )
                    }))
                };
            }
            return m;
        }));
        
        if (selectedMom?.id === momId) {
            setSelectedMom((prev: any) => ({
                ...prev,
                agendaItems: prev.agendaItems.map((ag: any) => ({
                    ...ag,
                    action_items: ag.action_items.map((act: any) => 
                        act.id === actionId ? { ...act, status: newStatus } : act
                    )
                }))
            }));
        }
        toast.success(`Action Item status updated to ${newStatus}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 gap-4">
                <div>
                   <h2 className="text-xl font-bold text-gray-900">บันทึกการประชุม (Minutes of Meeting)</h2>
                   <p className="text-sm text-gray-500 mt-1">จัดการวาระการประชุมและติดตาม Action Items</p>
                </div>
                <div className="flex gap-2">
                    {activeView === 'list' && isClerk && (
                       <button onClick={() => toast.error('ฟังก์ชันสร้าง MOM ใหม่กำลังพัฒนา')} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center gap-2">
                          <Plus size={18} /> สร้างบันทึก (New MOM)
                       </button>
                    )}
                    {activeView !== 'list' && (
                       <button onClick={() => { setActiveView('list'); setSelectedMom(null); }} className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                          กลับหน้ารวม (Back)
                       </button>
                    )}
                </div>
            </div>

            {activeView === 'list' && (
                <div className="grid gap-4">
                    {moms.map(mom => (
                        <div key={mom.id} onClick={() => { setSelectedMom(mom); setActiveView('detail'); }} className={`bg-white p-6 rounded-[20px] border-l-4 ${mom.status === 'FINALIZED' ? 'border-emerald-500' : 'border-amber-500'} border-y-gray-100 border-r-gray-100 flex flex-col sm:flex-row justify-between items-start cursor-pointer hover:shadow-md transition group`}>
                            <div className="flex gap-4 items-start w-full sm:w-2/3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mom.status === 'FINALIZED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {mom.status === 'FINALIZED' ? <CheckCircle size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                    <h4 className="text-gray-900 font-bold text-lg mb-1 group-hover:text-brand-600 transition-colors">{mom.type}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1 font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{mom.id}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(mom.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Users size={14}/> {mom.attendees.filter(a=>a.present).length}/{mom.attendees.length} Attendees</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-1"><span className="font-bold">Chaired by:</span> {mom.chaired_by} • <span className="font-bold">Location:</span> {mom.location}</p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex shrink-0">
                                <span className={`px-3 py-1 bg-white border text-xs font-black rounded-lg uppercase tracking-widest ${mom.status === 'FINALIZED' ? 'text-emerald-700 border-emerald-200' : 'text-amber-700 border-amber-200 flex items-center gap-1'} `}>
                                    {mom.status}
                                    {mom.status === 'DRAFT' && <Edit2 size={12} />}
                                    {mom.status === 'FINALIZED' && <Lock size={12} className="ml-1" />}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeView === 'detail' && selectedMom && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedMom.id}</span>
                                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${selectedMom.status === 'FINALIZED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {selectedMom.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedMom.type}</h3>
                                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-4">
                                        <span><Calendar size={14} className="inline mr-1"/> {new Date(selectedMom.date).toLocaleString()}</span>
                                        <span><Target size={14} className="inline mr-1"/> {selectedMom.location}</span>
                                    </p>
                                </div>
                                {selectedMom.status === 'DRAFT' && isChairperson && (
                                    <button onClick={() => handleFinalize(selectedMom.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition">
                                        <CheckCircle size={16} /> Approve & Finalize
                                    </button>
                                )}
                            </div>

                            <div className="p-6 bg-gray-50/50">
                                <h4 className="font-bold text-gray-900 mb-4 border-l-4 border-brand-500 pl-3">Agenda & Discussion</h4>
                                <div className="space-y-6">
                                    {selectedMom.agendaItems.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                            <h5 className="font-bold text-gray-800 text-lg mb-2">{item.item_no}. {item.topic}</h5>
                                            <div className="text-sm text-gray-700 mb-4 space-y-2">
                                                <p><span className="font-medium text-gray-500">Discussion:</span> {item.discussion}</p>
                                                {item.decisions.length > 0 && (
                                                    <div>
                                                        <span className="font-medium text-gray-500">Decisions:</span>
                                                        <ul className="list-disc pl-5 mt-1 text-emerald-800">
                                                            {item.decisions.map((d: string, dIdx: number) => <li key={dIdx}>{d}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {item.action_items.length > 0 && (
                                                <div className="mt-4 border-t border-gray-100 pt-4">
                                                    <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Action Items</h6>
                                                    <div className="space-y-2">
                                                        {item.action_items.map((action: any) => (
                                                            <div key={action.id} className="flex flex-wrap md:flex-nowrap items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 gap-3">
                                                                <div className="flex-1 min-w-[200px]">
                                                                    <p className="text-sm font-medium text-gray-900">{action.action}</p>
                                                                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                                        <span className="font-mono">{action.id}</span>
                                                                        <span>Resp: <b>{action.responsible}</b></span>
                                                                        <span>Due: {action.due_date}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${action.priority === 'High' ? 'bg-red-100 text-red-700' : action.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                        {action.priority}
                                                                    </span>
                                                                    
                                                                    <select 
                                                                        value={action.status}
                                                                        onChange={(e) => updateActionStatus(selectedMom.id, action.id, e.target.value)}
                                                                        className={`text-xs font-bold rounded-md border-gray-200 outline-none p-1.5 ${action.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : action.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                                                                    >
                                                                        <option value="Open">Open</option>
                                                                        <option value="In Progress">In Progress</option>
                                                                        <option value="Closed">Closed</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                            <h4 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Meeting Details</h4>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Chairperson</p>
                                    <p className="font-medium text-gray-900">{selectedMom.chaired_by}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Attendees ({selectedMom.attendees.filter((a:any)=>a.present).length})</p>
                                    <div className="space-y-2">
                                        {selectedMom.attendees.map((attendee: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 leading-tight">{attendee.name}</p>
                                                    <p className="text-xs text-gray-500">{attendee.company} • {attendee.role}</p>
                                                </div>
                                                <div>
                                                    {attendee.present ? 
                                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">Present</span> :
                                                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Absent</span>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedMom.next_meeting && (
                            <div className="bg-brand-50 rounded-[24px] border border-brand-100 p-6">
                                <h4 className="font-bold text-brand-900 mb-3 flex items-center gap-2"><Calendar size={18}/> Next Meeting</h4>
                                <p className="text-sm font-bold text-gray-800 bg-white inline-block px-3 py-1.5 rounded-lg border border-brand-200 mb-3">
                                    {new Date(selectedMom.next_meeting.date).toLocaleString()}
                                </p>
                                <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">Agenda Preview:</p>
                                <ul className="text-sm text-brand-800 list-disc pl-4 space-y-1">
                                    {selectedMom.next_meeting.agenda_preview.map((ap: string, idx: number) => (
                                        <li key={idx}>{ap}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
