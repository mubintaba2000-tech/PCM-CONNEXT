import React from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';

export const ProfileScreen = ({ user }: { user: User }) => {
    return (
        <main id="content-profile" className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pt-8 md:pb-14">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ตั้งค่าโปรไฟล์ (Profile Settings)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Online Status */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glow-card relative w-full rounded-[14px] p-0.5 bg-white text-gray-800 overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
                        <div className="glow-element pointer-events-none blur-xl bg-gradient-to-r from-blue-400 via-brand-500 to-purple-500 w-60 h-60 absolute z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ top: '-120px', left: '-120px' }}></div>
                        <div className="relative z-10 bg-white p-6 h-full w-full rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="relative inline-block mb-4 group cursor-pointer mt-2">
                                <img 
                                    id="main-profile-img"
                                    className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white group-hover:border-brand-50 transition-colors"
                                    src={user.avatar}
                                    alt={user.name} 
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    </svg>
                                </div>
                                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-4 border-white box-content"></div>
                            </div>

                            <h2 id="page-username" className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                            <p id="page-user-role" className="text-sm font-medium text-brand-600 mb-4">{user.roleName || user.role}</p>

                            <p className="text-[13px] text-gray-500 leading-relaxed mb-6 px-1">
                                มุ่งมั่นในการบริหารงานก่อสร้าง เพื่อส่งมอบผลงานคุณภาพ ตรงต่อเวลา
                                และสร้างความพึงพอใจสูงสุดให้แก่ลูกค้า
                            </p>

                            {/* Social Icons */}
                            <div className="flex space-x-4 mb-4 text-brand-600">
                                <a href="#" target="_blank" className="hover:-translate-y-0.5 hover:text-brand-700 transition">
                                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" target="_blank" className="hover:-translate-y-0.5 hover:text-brand-700 transition">
                                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                                        <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                    </svg>
                                </a>
                                <a href="#" target="_blank" className="hover:-translate-y-0.5 hover:text-brand-700 transition">
                                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="w-full flex gap-2">
                                <input type="file" id="profile-avatar-upload" accept="image/*" className="hidden" />
                                <button type="button" onClick={() => {
                                    document.getElementById('profile-avatar-upload')?.click();
                                    toast.success('กรุณาเลือกรูปภาพ', { icon: '📸' });
                                }} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 px-3">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                    </svg>
                                    เปลี่ยนรูปภาพ
                                </button>
                                <button
                                    className="py-2.5 px-3.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    title="ซิงค์จาก Google" onClick={() => toast.success('เชื่อมต่อกับบัญชี Google สำเร็จ', { icon: '✅' })}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">สถานะทีมงานเบื้องต้น</h3>
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="relative group cursor-pointer" onClick={() => toast('สมชาย ไม่อยู่ในระบบ', { icon: '😴'})}>
                                <img className="h-16 w-16 rounded-full object-cover shadow-sm group-hover:-translate-y-1 transition-transform"
                                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                                    alt="userImage1" referrerPolicy="no-referrer" />
                                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                            </div>
                            <div className="relative group cursor-pointer" onClick={() => toast('พงศ์ภัทร ไม่ว่าง (Do Not Disturb)', { icon: '⛔'})}>
                                <img className="h-16 w-16 rounded-full object-cover shadow-sm group-hover:-translate-y-1 transition-transform opacity-75 grayscale-[50%]"
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                                    alt="userImage2" referrerPolicy="no-referrer" />
                                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-red-500 border-2 border-white"></div>
                            </div>
                            <div className="relative group cursor-pointer" onClick={() => toast('อารีรัตน์ กำลังกลับมา (Away)', { icon: '🟡'})}>
                                <img className="h-16 w-16 rounded-full object-cover shadow-sm group-hover:-translate-y-1 transition-transform"
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                                    alt="userImage3" referrerPolicy="no-referrer" />
                                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Notifications */}
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">ข้อมูลส่วนตัวทั่วไป</h2>
                        <form id="profile-settings-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('บันทึกข้อมูลเรียบร้อยแล้ว'); }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
                                    <input type="text" id="input-name"
                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                                        defaultValue={user.name} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
                                    <input type="email" id="input-email"
                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-500 bg-gray-50 cursor-not-allowed"
                                        defaultValue={user.email} disabled />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ตำแหน่ง (Role)</label>
                                <input type="text"
                                    className="w-full h-11 px-4 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed outline-none"
                                    defaultValue={user.roleName || user.role} disabled />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit"
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">บันทึกข้อมูล (Save Changes)</button>
                            </div>
                        </form>
                    </div>

                    {/* Notifications / Feed */}
                    <div className="bg-white p-0 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">แจ้งเตือนล่าสุด (Notifications)</h2>
                            <button onClick={() => toast.success('ทำเครื่องหมายอ่านแล้วทั้งหมด')} className="text-brand-600 text-sm font-medium hover:underline">ทำเครื่องหมายอ่านแล้วทั้งหมด</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer" onClick={() => toast('เปิดโครงการ Smart Warehouse')}>
                                <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-800 font-medium font-sans">คุณได้รับมอบหมายงานใหม่ในโครงการ <strong>Smart Warehouse</strong></p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                        <span>เมื่อ 15 นาทีที่แล้ว</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer" onClick={() => toast('เรียกดูเอกสาร RFA #102')}>
                                <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-800 font-medium font-sans">เอกสาร RFA #102 ได้รับการอนุมัติแล้ว</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                        <span>เมื่อ 2 ชั่วโมงที่แล้ว</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
