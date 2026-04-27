import React from 'react';
import { Search, Plus, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminScreen = () => {
    return (
        <main id="content-users" className="flex-grow w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-10 md:pt-8 md:pb-14 block bg-slate-50 min-h-screen">
            
            {/* Page Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">จัดการผู้ใช้งาน (User Management)</h1>
                    <p className="text-gray-500 text-sm">เพิ่ม ลบ และแก้ไขสิทธิ์การเข้าถึงระบบของพนักงาน</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input type="text" placeholder="ค้นหาชื่อ, อีเมล..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    
                    <button onClick={() => toast.success('เปิดฟอร์มเพิ่มผู้ใช้งาน', { icon: '👤' })} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl shadow-md shadow-brand-500/20 font-medium transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                        <Plus size={16} />
                        เพิ่มผู้ใช้
                    </button>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b border-gray-100 rounded-tl-2xl">ชื่อผู้ใช้งาน</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">บทบาท (Role)</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">อีเมล</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100">สถานะ</th>
                                <th className="px-6 py-4 font-semibold border-b border-gray-100 text-right rounded-tr-2xl">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {/* User 1: Admin */}
                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Admin&background=111827&color=fff" className="w-9 h-9 rounded-full object-cover shadow-sm" alt="Admin" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Admin User</p>
                                            <p className="text-[11px] text-gray-500">ID: USR-001</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 tracking-wide">Administrator</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">admin@pcm.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ใช้งาน
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success('แก้ไขข้อมูล Admin User')} className="text-gray-400 hover:text-brand-600 transition-colors p-1" title="แก้ไข">
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>

                            {/* User 2: Owner */}
                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Owner&background=e55a30&color=fff" className="w-9 h-9 rounded-full object-cover shadow-sm" alt="Owner" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Owner User</p>
                                            <p className="text-[11px] text-gray-500">ID: USR-002</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-600 tracking-wide">Owner</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">owner@pcm.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ใช้งาน
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success('แก้ไขข้อมูล Owner User')} className="text-gray-400 hover:text-brand-600 transition-colors p-1" title="แก้ไข">
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>

                            {/* User 3: Accountant */}
                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Acc&background=14b8a6&color=fff" className="w-9 h-9 rounded-full object-cover shadow-sm" alt="Accountant" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Account User</p>
                                            <p className="text-[11px] text-gray-500">ID: USR-003</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-600 tracking-wide">Accountant</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">accountant@pcm.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ใช้งาน
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success('แก้ไขข้อมูล Account User')} className="text-gray-400 hover:text-brand-600 transition-colors p-1" title="แก้ไข">
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                            
                            {/* User 4: Engineer */}
                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Eng&background=3b82f6&color=fff" className="w-9 h-9 rounded-full object-cover shadow-sm" alt="Engineer" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Engineer User</p>
                                            <p className="text-[11px] text-gray-500">ID: USR-004</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-600 tracking-wide">Engineer</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">engineer@pcm.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ใช้งาน
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success('แก้ไขข้อมูล Engineer User')} className="text-gray-400 hover:text-brand-600 transition-colors p-1" title="แก้ไข">
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>

                            {/* User 5: Inactive user */}
                            <tr className="hover:bg-slate-50/50 transition-colors group opacity-60">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Old+Fore&background=94a3b8&color=fff" className="w-9 h-9 rounded-full object-cover shadow-sm grayscale" alt="Foreman" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Old Foreman</p>
                                            <p className="text-[11px] text-gray-500">ID: USR-005</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-600 tracking-wide">Foreman</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">old.foreman@pcm.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> ระงับใช้งาน
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success('แก้ไขข้อมูล Old Foreman')} className="text-gray-400 hover:text-brand-600 transition-colors p-1" title="แก้ไข">
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">แสดง 1 ถึง 5 จาก 24 รายการ</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-50 border border-brand-100 text-brand-600 font-bold text-sm">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
