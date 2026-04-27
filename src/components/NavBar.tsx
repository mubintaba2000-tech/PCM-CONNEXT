import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Maximize, Minimize, LogOut, ChevronDown, Wallet, CheckCircle, AlertTriangle, Info, X, Moon, Sun, Users } from 'lucide-react';
import { User } from '../types';
import toast from 'react-hot-toast';

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  isRead: boolean;
  type?: 'success' | 'warning' | 'info';
}

export const NavBar = ({ user, onLogout, onGoHome, onGoAdmin, onGoProfile, onGoPayment, onGoSales }: { user: User, onLogout: () => void, onGoHome: () => void, onGoAdmin?: () => void, onGoProfile?: () => void, onGoPayment?: () => void, onGoSales?: () => void }) => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', message: 'อนุมัติเอกสารเบิกเงินโครงการ AP-6701 เรียบร้อยแล้ว', time: '10 นาทีที่แล้ว', isRead: false, type: 'success' },
    { id: '2', message: 'มี RFA ใหม่รอการตรวจสอบจากคุณ (โครงการ LH-88/2)', time: '1 ชั่วโมงที่แล้ว', isRead: false, type: 'warning' },
    { id: '3', message: 'คุณถูกเพิ่มเป็นสมาชิกในโครงการใหม่ (Sansiri HQ)', time: '3 ชั่วโมงที่แล้ว', isRead: true, type: 'info' },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('ทำเครื่องหมายอ่านแล้วทั้งหมด');
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`ค้นหา: ${searchQuery}`, { icon: '🔍' });
    setSearchQuery('');
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        toast.error('เบราว์เซอร์ไม่รองรับ Fullscreen');
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 w-full sticky top-0 z-50 h-20 flex items-center transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center cursor-pointer shrink-0 group" onClick={onGoHome}>
          <img src="/logo.png" alt="Pichayamongkol Logo" className="h-10 object-contain group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
        </div>

        {/* Center: Search */}
        <div className="hidden sm:flex flex-1 items-center justify-center px-4 lg:px-8">
          <form onSubmit={handleSearch} className="flex items-center border pl-4 gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all h-[46px] rounded-full overflow-hidden max-w-md w-full shadow-sm">
            <Search size={22} className="text-gray-400 shrink-0 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาข้อมูล..." 
              className="w-full h-full outline-none text-[14px] text-gray-700 dark:text-gray-200 bg-transparent placeholder-gray-400" 
            />
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 transition-colors w-24 sm:w-28 h-9 rounded-full text-sm font-medium text-white mr-[3.5px] shrink-0">Search</button>
          </form>
        </div>

        {/* Right: Profiles & Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
           
           <div className="relative" ref={notificationRef}>
             <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 bg-[#FFF8EE] text-[#F9A826] rounded-xl hover:bg-orange-50 transition-colors cursor-pointer shrink-0 border border-[#fcefd8] focus:outline-none focus:ring-2 focus:ring-[#F9A826]/30">
                <Bell size={22} className="stroke-[1.8]" />
                {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white box-content"></span>}
             </button>

             {showNotifications && (
               <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                 <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     การแจ้งเตือน 
                     {unreadCount > 0 && <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-[11px] font-bold">{unreadCount} ใหม่</span>}
                   </h3>
                   {unreadCount > 0 && (
                     <button onClick={markAllAsRead} className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline">
                       อ่านทั้งหมด
                     </button>
                   )}
                 </div>
                 
                 <div className="max-h-[70vh] overflow-y-auto">
                   {notifications.length > 0 ? (
                     <div className="flex flex-col">
                       {notifications.map(notif => (
                         <div key={notif.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-brand-50/30'}`}>
                           {/* Icon Status */}
                           <div className="flex gap-3">
                             <div className="shrink-0 mt-0.5">
                               {notif.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
                               {notif.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
                               {notif.type === 'info' && <Info size={18} className="text-blue-500" />}
                             </div>
                             <div className="flex-1 pr-6">
                               <p className={`text-sm tracking-tight ${notif.isRead ? 'text-gray-600' : 'font-semibold text-gray-900'} line-clamp-2`}>{notif.message}</p>
                               <span className="text-[11px] font-medium text-gray-400 mt-1 block">{notif.time}</span>
                             </div>
                           </div>
                           
                           {!notif.isRead && (
                             <button onClick={(e) => markAsRead(notif.id, e)} className="absolute right-3 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100" title="ทำเครื่องหมายว่าอ่านแล้ว">
                               <CheckCircle size={14} />
                             </button>
                           )}
                           
                           {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full"></div>}
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="p-8 text-center flex flex-col items-center justify-center">
                       <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                         <Bell size={20} className="text-gray-300" />
                       </div>
                       <p className="text-sm font-medium text-gray-500">ไม่มีการแจ้งเตือนใหม่</p>
                     </div>
                   )}
                 </div>
                 
                 {notifications.length > 0 && (
                   <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                     <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">ดูการแจ้งเตือนทั้งหมด</button>
                   </div>
                 )}
               </div>
             )}
           </div>

           {user.role === 'admin' && (
             <button onClick={() => { if(onGoAdmin) onGoAdmin(); }} className="hidden sm:block p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-xl transition-colors cursor-pointer shrink-0" title="จัดการผู้ใช้งาน">
                <Settings size={20} className="stroke-[1.8]" />
             </button>
           )}

           {['sales', 'admin', 'owner'].includes(user.role) && (
               <button onClick={() => { if (onGoSales) onGoSales(); }} className="p-2 text-gray-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 rounded-xl transition-colors cursor-pointer shrink-0" title="Sales CRM Assistant">
                  <Users size={20} className="stroke-[1.8]" />
               </button>
           )}
           
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)} 
             className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-xl transition-colors cursor-pointer shrink-0" 
             title={isDarkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
           >
              {isDarkMode ? <Sun size={20} className="stroke-[1.8]" /> : <Moon size={20} className="stroke-[1.8]" />}
           </button>

           <button onClick={toggleFullscreen} className="hidden sm:block p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-xl transition-colors cursor-pointer shrink-0">
              {isFullscreen ? <Minimize size={20} className="stroke-[1.8]" /> : <Maximize size={20} className="stroke-[1.8]" />}
           </button>

           <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1"></div>

           <div className="hidden sm:flex flex-col justify-center items-end mr-1">
              <span className="text-[14px] font-bold text-gray-800 dark:text-gray-200 leading-none tracking-tight font-mono">
                  {time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                  {time.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
           </div>

            <div onClick={() => { if(onGoProfile) onGoProfile(); }} className="hidden sm:flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 pr-2.5 rounded-[1.25rem] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-[0.85rem] object-cover bg-gray-100 dark:bg-gray-800 border border-gray-100/50 dark:border-gray-700/50" referrerPolicy="no-referrer" />
              <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 tracking-tight leading-none">{user.name}</span>
                    <ChevronDown size={14} className="text-slate-500" />
                 </div>
                 <span className="text-[11.5px] font-medium text-slate-400 text-left mt-1 leading-none">{user.roleName}</span>
              </div>
           </div>

           <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block ml-1"></div>
           <button onClick={() => {
             toast.success('ออกจากระบบสำเร็จ');
             onLogout();
           }} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer shrink-0">
              <LogOut size={20} className="stroke-[2]" />
           </button>
        </div>
      </div>
    </nav>
  );
}
