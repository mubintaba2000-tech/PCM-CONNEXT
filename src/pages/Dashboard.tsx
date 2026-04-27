import React, { useState, useEffect } from 'react';
import { MapPin, Plus, MoreHorizontal, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { subscribeToProjects, deleteProject } from '../services/projectService';
import { MultiProjectVoSummary } from '../components/MultiProjectVoSummary';

import { User } from '../types';

export const DashboardScreen = ({ onSelectProject, user }: { onSelectProject: (p: any) => void, user?: User | null }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'projects' | 'vo_summary'>('projects');

  useEffect(() => {
     const unsubscribe = subscribeToProjects((fetchedProjects) => {
         setProjects(fetchedProjects);
     });
     return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setProjectToEdit(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToEdit(p);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้?')) {
        await deleteProject(id);
        toast.success('ลบโครงการสำเร็จ', { icon: '🗑️' });
     }
  };

  if (activeView === 'vo_summary') {
      return (
          <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-10">
              <MultiProjectVoSummary projects={projects} onBack={() => setActiveView('projects')} />
          </main>
      );
  }

  return (
    <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-10 md:pt-8 md:pb-14 block">
       {/* Page Header Area */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">เลือกโครงการ (Select Project)</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">ยินดีต้อนรับกลับมา กรุณาเลือกโครงการที่คุณต้องการจัดการ</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
             {/* Filters */}
             <button onClick={() => setActiveView('vo_summary')} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 whitespace-nowrap h-full transition-colors">
                <FileText size={18} />
                ดูรายงาน VO ภาพรวม
             </button>
             <div className="flex flex-1 sm:flex-none flex-wrap items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm gap-2 sm:gap-3 transition-colors">
                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <span className="text-sm font-medium hidden sm:inline">ตัวกรอง:</span>
                </div>
                
                {/* Status Filter */}
                <select className="text-sm outline-none bg-transparent text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 pr-3 cursor-pointer">
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="ออกแบบ">ออกแบบ</option>
                    <option value="เซ็นสัญญา">เซ็นสัญญา</option>
                    <option value="เขียนแบบพิมพ์เขียว">เขียนแบบพิมพ์เขียว</option>
                    <option value="ยื่นขออนุญาตก่อสร้าง">ยื่นขออนุญาตก่อสร้าง</option>
                    <option value="ใบอนุญาตออกแล้ว">ใบอนุญาตออกแล้ว</option>
                    <option value="ขอน้ำ-ไฟชั่วคราว">ขอน้ำ-ไฟชั่วคราว</option>
                    <option value="รอรื้อถอน">รอรื้อถอน</option>
                    <option value="รื้อถอนเสร็จแล้ว">รื้อถอนเสร็จแล้ว</option>
                    <option value="อยู่ระหว่างก่อสร้าง">อยู่ระหว่างก่อสร้าง</option>
                    <option value="ส่งมอบบ้าน">ส่งมอบบ้าน</option>
                </select>
                
                {/* SE Name Filter */}
                <input type="text" placeholder="ชื่อวิศวกร (SE)..." className="text-sm outline-none bg-transparent text-gray-600 dark:text-gray-300 w-full sm:w-32 placeholder-gray-400 dark:placeholder-gray-500 mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-2 sm:pt-0" />
             </div>

             {(user?.role === 'owner' || user?.role === 'engineer' || user?.role === 'admin') && (
                 <button onClick={openCreateModal} className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap h-full">
                    <Plus size={20} />
                    สร้างโครงการใหม่
                 </button>
             )}
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {projects.map((p) => {
             let colorTheme = { main: 'blue-500', bg: 'bg-blue-500', badgeText: 'text-blue-700', badgeBg: 'bg-blue-50' };
             
             if (p.status?.includes('ออกแบบ')) 
                 colorTheme = { main: 'indigo-500', bg: 'bg-indigo-500', badgeText: 'text-indigo-700', badgeBg: 'bg-indigo-100' };
                 
             if (p.status?.includes('ระหว่างก่อสร้าง')) 
                 colorTheme = { main: 'brand-500', bg: 'bg-brand-500', badgeText: 'text-brand-700', badgeBg: 'bg-brand-50 border border-brand-200' };
                 
             if (p.status?.includes('ส่งมอบ')) 
                 colorTheme = { main: 'emerald-500', bg: 'bg-emerald-500', badgeText: 'text-emerald-700', badgeBg: 'bg-emerald-100' };

             return (
               <a key={p.id} href="#" onClick={(e) => { e.preventDefault(); onSelectProject(p); }} className="relative rounded-xl p-[2px] bg-white dark:bg-gray-800 overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer group flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative z-10 bg-white dark:bg-gray-800 h-full w-full rounded-[10px] overflow-hidden flex flex-col">
                      <div className="relative overflow-hidden shrink-0 h-48">
                          <img src={p.coverImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-3 right-3 z-20 flex gap-2">
                              {(user?.role === 'owner' || user?.role === 'engineer' || user?.role === 'admin') && (
                                <>
                                  <button onClick={(e) => openEditModal(p, e)} className="w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100" title="แก้ไข">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </button>
                                  <button onClick={(e) => handleDelete(p.id, e)} className="w-8 h-8 bg-red-500/80 hover:bg-red-600/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100" title="ลบ">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </>
                              )}
                          </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-[22px] font-bold text-gray-800 dark:text-gray-100 mb-1.5 leading-tight group-hover:text-brand-600 transition-colors">{p.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 gap-1.5 font-light">
                              <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                              <span className="truncate leading-tight">{p.location}</span>
                          </div>
                          <div className="flex flex-col gap-2.5 mb-4 px-1.5 border-l-2 border-gray-100 dark:border-gray-700 py-1">
                              <div className="flex items-center justify-between text-[13.5px] text-gray-600 dark:text-gray-300 w-full gap-2">
                                  <div className="flex items-center gap-1.5 font-medium shrink-0">
                                      <span>วิศวกร</span>
                                  </div>
                                  <span className="text-brand-700 dark:text-brand-400 truncate font-bold text-[14px]">{p.seName || p.se || '-'}</span>
                              </div>
                              <div className="flex items-center justify-between text-[13.5px] text-gray-600 dark:text-gray-300 w-full gap-2">
                                  <span className="text-gray-700 dark:text-gray-300 truncate text-[12.5px] mt-0.5 tracking-tight w-full flex justify-between pr-0.5">
                                      <span>เริ่มต้น <strong className="text-gray-900 dark:text-gray-100 font-semibold">{p.start}</strong></span>
                                      <span>สิ้นสุด <strong className="text-gray-900 dark:text-gray-100 font-semibold">{p.end}</strong></span>
                                  </span>
                              </div>
                          </div>
                          <div className="w-full mb-5 z-10">
                              <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 px-0.5"><span>ความคืบหน้าโครงการ</span></div>
                              <div className="relative flex items-center w-full bg-gray-500/20 dark:bg-gray-700 h-5 rounded-full overflow-hidden shadow-inner">
                                  <div className={`${colorTheme.bg} h-5 rounded-full transition-all duration-1000`} style={{ width: `${p.progress}%` }}></div>
                                  <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${p.progress > 50 ? 'text-white drop-shadow-md' : 'text-gray-700 dark:text-gray-300'}`}>{p.progress}%</span>
                              </div>
                          </div>
                          <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                              <div className="flex -space-x-2.5">
                                  <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover bg-gray-200" src={p.pm || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.pmName || 'PM')}&background=3b82f6&color=fff`} alt={p.pmName || 'PM'} title={p.pmName || 'PM'} referrerPolicy="no-referrer" />
                                  <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover bg-gray-200" src={p.se || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.seName || 'SE')}&background=10b981&color=fff`} alt={p.seName || 'SE'} title={p.seName || 'SE'} referrerPolicy="no-referrer" />
                              </div>
                              <span className={`${colorTheme.badgeBg} ${colorTheme.badgeText} text-[13px] tracking-wide px-3 py-1.5 rounded-lg font-bold shadow-sm`}>{p.status}</span>
                          </div>
                      </div>
                  </div>
               </a>
             );
          })}
       </div>

       <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} initialData={projectToEdit} />
    </main>
  );
}
