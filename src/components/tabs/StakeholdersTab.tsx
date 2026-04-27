import React from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';

export const StakeholdersTab = ({ project }: { project: Project }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ผู้เกี่ยวข้องทางการของโครงการ (Stakeholders)</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('เปิดฟอร์มเพิ่มบุคลากรเข้าโครงการ')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
            เพิ่มผู้เกี่ยวข้อง
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-start gap-4">
          <img src={project.pm} alt={project.pmName} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div>
             <h4 className="font-bold text-gray-900">{project.pmName}</h4>
             <span className="px-2 py-0.5 mt-1 mb-2 inline-block bg-brand-50 text-brand-600 rounded text-xs font-bold">Project Manager</span>
             <p className="text-xs text-gray-500">บริษัท พชรมงคล พร็อพเพอร์ตี้ จำกัด</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-start gap-4">
          <img src={project.se} alt={project.seName} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div>
             <h4 className="font-bold text-gray-900">{project.seName}</h4>
             <span className="px-2 py-0.5 mt-1 mb-2 inline-block bg-orange-50 text-orange-600 rounded text-xs font-bold">Site Engineer</span>
             <p className="text-xs text-gray-500">บริษัท พชรมงคล พร็อพเพอร์ตี้ จำกัด</p>
          </div>
        </div>
      </div>
    </div>
  );
};
