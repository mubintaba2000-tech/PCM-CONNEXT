import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, BarChart2, FileText, 
  Users, Calendar, DollarSign, HelpCircle, 
  MessageSquare, ClipboardCheck, AlertCircle, Camera, List, Layers, ChevronDown, ChevronRight
} from 'lucide-react';
import { Project } from '../types';
import { ReportTab } from '../components/tabs/ReportTab';
import { DetailsTab } from '../components/tabs/DetailsTab';
import { FinanceTab } from '../components/tabs/FinanceTab';
import { PlanTab } from '../components/tabs/PlanTab';
import { DailyReportTab } from '../components/tabs/DailyReportTab';
import { StakeholdersTab } from '../components/tabs/StakeholdersTab';
import { RfaTab } from '../components/tabs/RfaTab';
import { RfiTab } from '../components/tabs/RfiTab';
import { InspectionTab } from '../components/tabs/InspectionTab';
import { IssuesTab } from '../components/tabs/IssuesTab';
import { MinutesTab } from '../components/tabs/MinutesTab';
import { DefectTab, PhotosTab, MemoTab, GenericTab } from '../components/tabs/ListTabs';
import { VoTab } from '../components/tabs/VoTab';
import { PaymentSystemScreen } from './PaymentSystem';

export const ProjectDetailScreen = ({ project, onBack, user }: { project: Project, onBack: () => void, user: any }) => {
  const [activeTab, setActiveTab] = useState('report');
  const [expandedTabs, setExpandedTabs] = useState<string[]>([]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedTabs.includes(id)) {
      setExpandedTabs(expandedTabs.filter(t => t !== id));
    } else {
      setExpandedTabs([...expandedTabs, id]);
    }
  };

  const TABS = [
     { id: 'report', name: 'รายงาน', icon: BarChart2 },
     { id: 'details', name: 'รายละเอียด', icon: FileText },
     { id: 'daily-report', name: 'Daily Report (AI)', icon: ClipboardCheck },
     { id: 'stakeholders', name: 'บุคลากร', icon: Users },
     { id: 'plan', name: 'แผนงาน', icon: Calendar },
     { id: 'finance', name: 'การเงิน (Finance)', icon: DollarSign, subItems: [
        { id: 'finance-summary', name: 'สรุปการเงิน' },
        { id: 'payment-system', name: 'ระบบเบิกเงิน' }
     ] },
     { id: 'vo', name: 'งานเพิ่ม-ลด (VO)', icon: Layers },
     { id: 'rfa', name: 'ขออนุมัติ (RFA)', icon: FileText },
     { id: 'rfi', name: 'คำถาม (RFI)', icon: HelpCircle },
     { id: 'memo', name: 'บันทึกข้อความ', icon: MessageSquare },
     { id: 'inspection', name: 'การตรวจ (QC)', icon: ClipboardCheck },
     { id: 'issues', name: 'ปัญหา (Issues)', icon: AlertCircle },
     { id: 'minutes', name: 'วาระประชุม (MOM)', icon: List },
     { id: 'defect', name: 'รายการแก้ไข', icon: AlertCircle },
     { id: 'photos', name: 'ภาพถ่าย', icon: Camera }
  ];

  let colorTheme = { main: 'blue-500', bg: 'bg-blue-500', badgeText: 'text-blue-700', badgeBg: 'bg-blue-50' };
  if (project.status?.includes('ออกแบบ')) colorTheme = { main: 'indigo-500', bg: 'bg-indigo-500', badgeText: 'text-indigo-700', badgeBg: 'bg-indigo-100' };
  if (project.status?.includes('ก่อสร้าง')) colorTheme = { main: 'brand-500', bg: 'bg-brand-500', badgeText: 'text-brand-700', badgeBg: 'bg-brand-50 border border-brand-200' };
  if (project.status?.includes('ส่งมอบ')) colorTheme = { main: 'emerald-500', bg: 'bg-emerald-500', badgeText: 'text-emerald-700', badgeBg: 'bg-emerald-100' };

  const renderContent = () => {
    switch (activeTab) {
      case 'report': return <ReportTab project={project} user={user} />;
      case 'details': return <DetailsTab project={project} />;
      case 'daily-report': return <DailyReportTab project={project} user={user} />;
      case 'finance':
      case 'finance-summary': return <FinanceTab project={project} user={user} />;
      case 'payment-system': return <PaymentSystemScreen user={user} onBack={() => setActiveTab('finance-summary')} />;
      case 'plan': return <PlanTab project={project} user={user} />;
      case 'stakeholders': return <StakeholdersTab project={project} />;
      case 'vo': return <VoTab project={project} user={user} />;
      case 'rfa': return <RfaTab project={project} user={user} />;
      case 'rfi': return <RfiTab project={project} user={user} />;
      case 'memo': return <MemoTab project={project} />;
      case 'inspection': return <InspectionTab project={project} user={user} />;
      case 'issues': return <IssuesTab project={project} user={user} />;
      case 'minutes': return <MinutesTab project={project} user={user} />;
      case 'defect': return <DefectTab project={project} />;
      case 'photos': return <PhotosTab project={project} />;
      default: return <GenericTab title={TABS.find(t=>t.id===activeTab)?.name || ''} onBack={() => setActiveTab('report')} />;
    }
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-[#FAFAFA] dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 flex-shrink-0 overflow-y-auto custom-scrollbar transition-colors">
         <nav className="flex md:flex-col p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-1">
            <div className="hidden md:flex p-4 mx-2 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex-col transition-colors" onClick={onBack}>
               <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><ArrowLeft size={14}/> กลับหน้าแรก</div>
               <div className="font-bold text-gray-900 dark:text-gray-100 truncate" title={project.name}>{project.name}</div>
            </div>
            {TABS.map(tab => {
               const isActive = activeTab === tab.id || (tab.subItems && tab.subItems.some(sub => sub.id === activeTab));
               const isExpanded = expandedTabs.includes(tab.id) || isActive;
               return (
                 <div key={tab.id} className="flex flex-col">
                   <button 
                      onClick={(e) => {
                         if (tab.subItems) {
                             toggleExpand(tab.id, e);
                         } else {
                             setActiveTab(tab.id);
                         }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all whitespace-nowrap md:whitespace-normal border-l-4 ${isActive && !tab.subItems || activeTab===tab.id ? 'bg-red-50/50 dark:bg-brand-900/20 text-gray-900 dark:text-brand-400 font-semibold border-brand-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent hover:text-gray-800 dark:hover:text-gray-200'}`}
                   >
                      <div className="flex items-center gap-3">
                        <tab.icon size={20} className={`shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400 opacity-100' : 'opacity-70'}`} />
                        <span className="hidden md:inline">{tab.name}</span>
                      </div>
                      {tab.subItems && (
                          <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                      )}
                   </button>
                   {tab.subItems && isExpanded && (
                       <div className="hidden md:flex flex-col ml-8 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-3">
                          {tab.subItems.map(subItem => (
                              <button
                                 key={subItem.id}
                                 onClick={() => setActiveTab(subItem.id)}
                                 className={`text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${activeTab === subItem.id ? 'bg-red-50/50 dark:bg-brand-900/20 text-gray-900 dark:text-brand-400 font-semibold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'}`}
                              >
                                 {subItem.name}
                              </button>
                          ))}
                       </div>
                   )}
                 </div>
               );
            })}
         </nav>
      </aside>

      <section className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-8">
             <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 pb-4 w-full md:border-none md:pb-0 transition-colors">
                 <div className="flex items-center gap-3 mb-1">
                     <button onClick={onBack} className="md:hidden text-gray-500 dark:text-gray-400 p-2"><ArrowLeft size={20}/></button>
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
                     <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${colorTheme.badgeBg} ${colorTheme.badgeText}`}>
                        {project.status}
                     </span>
                 </div>
                 <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-light gap-1.5 md:ml-0 ml-10 mt-1">
                     <MapPin size={16} className="text-brand-500 shrink-0" />
                     <span>{project.location}</span>
                 </div>
             </div>
         </div>

         {renderContent()}

      </section>
    </main>
  );
}
