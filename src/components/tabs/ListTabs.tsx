import React from 'react';
import { Project } from '../../types';
import { Settings, ArrowLeft, FileText, CheckCircle, AlertCircle, FileSearch, MessageSquare, Clock, DownloadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const EmptyState = ({ title, desc = 'ยังไม่มีข้อมูลในระบบ' }: { title: string, desc?: string }) => (
  <div className="h-64 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 bg-white rounded-[24px] border border-gray-100 border-dashed">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <FileSearch size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm font-medium">{desc}</p>
  </div>
);

export const RfaTab = ({ project }: { project: Project }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <div>
            <h2 className="text-xl font-bold text-gray-900">เอกสารขออนุมัติวัสดุ/แบบ (RFA)</h2>
            <p className="text-sm text-gray-500 mt-1">Request for Approval / Material / Shop Drawing</p>
         </div>
         <button onClick={() => toast.success('ฟอร์มสร้าง RFA จะเปิดขึ้นที่นี่', { icon: '📝' })} className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition">สร้าง RFA</button>
     </div>
     {!project.rfaList?.length ? <EmptyState title="ไม่พบเอกสาร RFA" /> : (
       <div className="grid gap-4">
         {project.rfaList.map((item: any) => (
           <div key={item.id} onClick={() => toast(`ดูรายละเอียด RFA: ${item.id}`)} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow group cursor-pointer">
             <div className="mb-4 sm:mb-0">
               <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md">{item.id}</span>
                 <h4 className="font-bold text-gray-900 text-[16px] group-hover:text-brand-600 transition-colors">{item.title}</h4>
               </div>
               <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                 <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">{item.by?.charAt(0) || 'U'}</span>
                 โดย {item.by} <span className="text-gray-300">•</span> {item.date}
               </p>
             </div>
             <div>
               <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                 {item.status}
               </span>
             </div>
           </div>
         ))}
       </div>
     )}
  </div>
);

export const MemoTab = ({ project }: { project: Project }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <div>
            <h2 className="text-xl font-bold text-gray-900">บันทึกข้อความ (Memo / SI)</h2>
            <p className="text-sm text-gray-500 mt-1">Site Instructions และการแจ้งเปลี่ยนแปลงต่างๆ</p>
         </div>
         <button onClick={() => toast.success('ฟอร์มบันทึกข้อความจะเปิดขึ้นที่นี่')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition">เพิ่ม Memo</button>
     </div>
     {!project.memoList?.length ? <EmptyState title="ไม่มีเอกสารสั่งการหน้างาน" /> : (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {project.memoList.map((item: any) => (
           <div key={item.id} onClick={() => toast(`เปิดเอกสาร: ${item.title}`)} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition cursor-pointer">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                 {item.title.split('-')[0] || 'SI'}
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 leading-snug">{item.title}</h4>
                 </div>
                 <p className="text-xs text-gray-500">วันที่: {item.date} | โดย: {item.from}</p>
                 <div className="mt-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">Official</span>
                 </div>
              </div>
           </div>
         ))}
       </div>
     )}
  </div>
);

export const InspectionTab = ({ project }: { project: Project }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <div>
             <h2 className="text-xl font-bold text-gray-900">การตรวจรับงาน (Inspection)</h2>
             <p className="text-sm text-gray-500 mt-1">บันทึกผลการตรวจและ QA/QC หน้างาน</p>
         </div>
         <button onClick={() => toast.success('เข้าสู่หน้านัดหมายตรวจสอบหน้างาน')} className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-teal-500/20 hover:bg-teal-700 transition">เพิ่มนัดตรวจ</button>
     </div>
     {!project.inspectionList?.length ? <EmptyState title="ไม่มีประวัติการตรวจ" /> : (
       <div className="grid gap-4">
         {project.inspectionList.map((item: any) => (
           <div key={item.id} onClick={() => toast(`ตรวจสอบรายละเอียดประวัติ: ${item.area}`)} className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 transition cursor-pointer">
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.result === 'pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {item.result === 'pass' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">{item.area}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">Date: {item.date}</p>
                 </div>
              </div>
              <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.result === 'pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                 {item.result === 'pass' ? 'Passed' : 'Failed'}
              </span>
           </div>
         ))}
       </div>
     )}
  </div>
);





export const DefectTab = ({ project }: { project: Project }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <div>
            <h2 className="text-xl font-bold text-gray-900">รายการแจ้งซ่อม (Defect)</h2>
            <p className="text-sm text-gray-500 mt-1">Non-Conformance / Rectification Report</p>
         </div>
         <button onClick={() => toast.success('เปิดฟอร์มสำหรับแจ้งตรวจสอบ Defect ใหม่')} className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:bg-red-700 transition">แจ้ง Defect</button>
     </div>
     {!project.defectList?.length ? <EmptyState title="Excellent Quality Control" desc="ยังไม่พบรายการแก้ไขในขณะนี้" /> : (
       <div className="grid gap-4">
         {project.defectList.map((item: any) => (
           <div key={item.id} onClick={() => toast(`แสดงรายละเอียดแจ้งซ่อม: ${item.title}`)} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition cursor-pointer">
             <div className="flex items-center gap-4">
               <div className={`w-2 h-12 rounded-full ${item.priority === 'high' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
               <div>
                 <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>Priority: {item.priority}</span>
               </div>
             </div>
             <button className="px-5 py-2 w-full md:w-auto bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-brand-600 transition-all text-center">ดูรายละเอียด</button>
           </div>
         ))}
       </div>
     )}
  </div>
);

export const PhotosTab = ({ project }: { project: Project }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center mb-2">
         <div>
            <h2 className="text-xl font-bold text-gray-900">คลังภาพความคืบหน้า (Site Photos)</h2>
            <p className="text-sm text-gray-500 mt-1">Daily Progress & Visual Updates</p>
         </div>
         <button onClick={() => toast.success('กรุณาเลือกไฟล์ภาพเพื่ออัปโหลด (.jpg, .png)')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition">อัปโหลดภาพ</button>
     </div>
     {!project.photoList?.length ? <EmptyState title="ยังไม่มีภาพถ่ายในระบบ" /> : (
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
         {project.photoList.map((item: any) => (
           <div key={item.id} onClick={() => toast(`แสดงภาพขนาดใหญ่: ${item.caption}`)} className="relative aspect-square rounded-[20px] overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in group shadow-sm hover:shadow-lg transition-all">
               <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="text-white font-bold text-sm leading-tight mb-1">{item.caption}</p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.date}</p>
                  </div>
               </div>
           </div>
         ))}
       </div>
     )}
  </div>
);

// Fallback Generic Tab
export const GenericTab = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500 bg-white rounded-3xl border border-gray-100">
      <div className="w-24 h-24 bg-gray-50 rounded-[20px] flex items-center justify-center mb-6 border border-gray-100">
          <Settings size={40} className="text-gray-300" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">หน้าต่างจำลองระบบ</h3>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          ส่วน <strong>{title}</strong> ใช้สำหรับการแสดงผลรูปแบบ UI เท่านั้น
      </p>
      <button onClick={onBack} className="mt-8 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> กลับไปหน้า Report
      </button>
  </div>
);
