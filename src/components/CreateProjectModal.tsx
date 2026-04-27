import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, UploadCloud, MapPin, Building2, UserCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { createProject, updateProject } from '../services/projectService';

export const CreateProjectModal = ({ isOpen, onClose, initialData }: { isOpen: boolean; onClose: () => void; initialData?: any }) => {
    const [step, setStep] = useState(1);
    
    // Form state
    const [name, setName] = useState(initialData?.name || '');
    const [projectType, setProjectType] = useState(initialData?.type || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [status, setStatus] = useState(initialData?.status || 'ออกแบบ');
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData?.coverImage || null);

    const [startDate, setStartDate] = useState(initialData?.start || '');
    const [endDate, setEndDate] = useState(initialData?.end || '');
    const [budget, setBudget] = useState(initialData?.budget || '');
    const [contract, setContract] = useState(initialData?.contract || '');
    const [owner, setOwner] = useState(initialData?.owner || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [siteLink, setSiteLink] = useState(initialData?.siteLink || '');
    const [pmName, setPmName] = useState(initialData?.pmName || '');
    const [seName, setSeName] = useState(initialData?.seName || '');

    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setName(initialData?.name || '');
            setProjectType(initialData?.type || '');
            setLocation(initialData?.location || '');
            setStatus(initialData?.status || 'ออกแบบ');
            setCoverImagePreview(initialData?.coverImage || null);
            setStartDate(initialData?.start || '');
            setEndDate(initialData?.end || '');
            setBudget(initialData?.budget || '');
            setContract(initialData?.contract || '');
            setOwner(initialData?.owner || '');
            setPhone(initialData?.phone || '');
            setSiteLink(initialData?.siteLink || '');
            setPmName(initialData?.pmName || '');
            setSeName(initialData?.seName || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleNext = async () => {
        if (step < 3) setStep(step + 1);
        else {
            const projectData = {
                name,
                type: projectType,
                location,
                status,
                coverImage: coverImagePreview,
                start: startDate,
                end: endDate,
                budget: Number(budget.toString().replace(/,/g, '')),
                contract,
                owner,
                phone,
                siteLink,
                pmName,
                seName,
                progress: initialData ? initialData.progress : 0,
            };
            if (initialData?.id) {
                await updateProject(initialData.id, projectData);
                toast.success('แก้ไขโครงการสำเร็จ', { icon: '🎉' });
            } else {
                await createProject(projectData);
                toast.success('สร้างโครงการใหม่สำเร็จ', { icon: '🎉' });
            }
            onClose();
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoverImagePreview(url);
            toast.success('อัปโหลดรูปภาพสำเร็จ', { icon: '📸' });
        }
    };

    const formatBudget = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="bg-white p-6 pb-5 shrink-0 border-b border-gray-100 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center border border-brand-100">
                                <Building2 className="w-6 h-6 text-brand-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 leading-tight">{initialData ? 'แก้ไขโครงการ' : 'สร้างโครงการใหม่'}</h2>
                                <p className="text-gray-500 text-[13px] mt-0.5">{initialData ? 'Edit Construction Project' : 'Create New Construction Project'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-2 transition-all focus:outline-none">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-0 mt-5">
                        <div onClick={() => setStep(1)} className="flex items-center gap-2 flex-1 cursor-pointer group">
                            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all shrink-0 ${step >= 1 ? 'bg-brand-600 text-white' : 'border border-gray-200 bg-gray-50 text-gray-400'}`}>1</div>
                            <span className={`text-[13px] font-medium hidden sm:inline ${step >= 1 ? 'text-brand-600' : 'text-gray-400'}`}>ข้อมูลโครงการ</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-100 rounded-full mx-1 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                        </div>
                        <div onClick={() => setStep(2)} className="flex items-center gap-2 flex-1 cursor-pointer group">
                            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all shrink-0 ${step >= 2 ? 'bg-brand-600 text-white' : 'border border-gray-200 bg-gray-50 text-gray-400'}`}>2</div>
                            <span className={`text-[13px] font-medium hidden sm:inline ${step >= 2 ? 'text-brand-600' : 'text-gray-400'}`}>สถานที่ & แผนงาน</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-100 rounded-full mx-1 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                        </div>
                        <div onClick={() => setStep(3)} className="flex items-center gap-2 flex-1 cursor-pointer group">
                            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all shrink-0 ${step >= 3 ? 'bg-brand-600 text-white' : 'border border-gray-200 bg-gray-50 text-gray-400'}`}>3</div>
                            <span className={`text-[13px] font-medium hidden sm:inline ${step >= 3 ? 'text-brand-600' : 'text-gray-400'}`}>ทีมงาน & สรุป</span>
                        </div>
                    </div>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* STEP 1: Project Info */}
                    {step === 1 && (
                        <div className="p-6 sm:p-8 space-y-5">
                            {/* Project Cover Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ภาพปกโครงการ (Project Cover)</label>
                                <div onClick={() => document.getElementById('cover-file-input')?.click()} className="relative border-2 border-dashed border-gray-200 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition-all group overflow-hidden">
                                    <input type="file" id="cover-file-input" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    {coverImagePreview ? (
                                        <>
                                            <img src={coverImagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white rounded-lg p-1.5 transition-colors z-10">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 transition-opacity">
                                            <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                                                <UploadCloud className="w-7 h-7 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                            </div>
                                            <p className="text-sm text-gray-500 group-hover:text-brand-600 transition-colors">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                            <p className="text-xs text-gray-400">PNG, JPG ขนาดไม่เกิน 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อโครงการ <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="เช่น บ้านเดี่ยว Phase 2 ตลิ่งชัน" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" required />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภทโครงการ <span className="text-red-500">*</span></label>
                                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white cursor-pointer" required>
                                        <option value="">— เลือกประเภท —</option>
                                        <option value="residential">ที่อยู่อาศัย (Residential)</option>
                                        <option value="commercial">อาคารพาณิชย์ (Commercial)</option>
                                        <option value="industrial">โรงงาน / คลังสินค้า (Industrial)</option>
                                        <option value="infrastructure">โครงสร้างพื้นฐาน (Infrastructure)</option>
                                        <option value="renovation">ปรับปรุง / ต่อเติม (Renovation)</option>
                                        <option value="interior">ตกแต่งภายใน (Interior)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">รหัสโครงการ</label>
                                    <input type="text" placeholder="ระบุรหัสโครงการ (เช่น PCM-2026-001)" className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รายละเอียดโครงการ</label>
                                <textarea rows={3} placeholder="อธิบายรายละเอียดเพิ่มเติมของโครงการ..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white resize-none"></textarea>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Location & Timeline */}
                    {step === 2 && (
                        <div className="p-6 sm:p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ที่ตั้งโครงการ <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="เช่น 123/45 ม.6 ต.บางรัก อ.เมือง จ.สมุทรปราการ" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" required />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">จังหวัด</label>
                                    <select className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white cursor-pointer">
                                        <option value="">— เลือกจังหวัด —</option>
                                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                        <option value="นนทบุรี">นนทบุรี</option>
                                        <option value="ปทุมธานี">ปทุมธานี</option>
                                        <option value="สมุทรปราการ">สมุทรปราการ</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เขต / อำเภอ</label>
                                    <input type="text" placeholder="เขต / อำเภอ" className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">วันเริ่มโครงการ <span className="text-red-500">*</span></label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white cursor-pointer" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">วันสิ้นสุดโครงการ (ตามแผน)</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white cursor-pointer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">มูลค่าสัญญา (บาท)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">฿</span>
                                        <input type="text" placeholder="0.00" value={budget} onChange={(e) => setBudget(formatBudget(e.target.value))} className="w-full h-12 pl-8 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เลขที่สัญญา</label>
                                    <input type="text" placeholder="เช่น CTR-2026-001" value={contract} onChange={(e) => setContract(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Team & Summary */}
                    {step === 3 && (
                        <div className="p-6 sm:p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เจ้าของโครงการ / ผู้ว่าจ้าง</label>
                                    <input type="text" placeholder="ชื่อลูกค้า / บริษัทผู้ว่าจ้าง" value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์ติดต่อ</label>
                                    <input type="text" placeholder="เช่น 081-xxx-xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Site Location (ลิงก์แผนที่)</label>
                                <input type="url" placeholder="วางลิงก์ Google Maps ที่นี่" value={siteLink} onChange={(e) => setSiteLink(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white text-blue-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">มอบหมายทีมงาน</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <UserCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-xs text-gray-500 font-medium">ผู้จัดการโครงการ (PM)</p>
                                            <input type="text" placeholder="ชื่อ PM" value={pmName} onChange={(e) => setPmName(e.target.value)} className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none mt-0.5" />
                                        </div>
                                    </div>
                                    {/* Site Engineer */}
                                    <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                            <UserCircle2 className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-xs text-gray-500 font-medium">วิศวกรสนาม (SE)</p>
                                            <input type="text" placeholder="ชื่อวิศวกร" value={seName} onChange={(e) => setSeName(e.target.value)} className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none mt-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">สถานะโครงการ</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[15px] bg-gray-50/80 focus:bg-white cursor-pointer">
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
                            </div>

                            {/* Summary Preview Card */}
                            <div className="mt-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ตัวอย่าง (Preview)</label>
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm p-4 relative">
                                    {coverImagePreview && (
                                        <div className="absolute top-0 right-0 w-24 h-24 mt-2 mr-2 rounded-lg opacity-40 overflow-hidden pointer-events-none">
                                            <img src={coverImagePreview} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{name || 'ชื่อโครงการ'}</h3>
                                        <p className="text-sm flex items-center gap-1 text-gray-500 mb-3"><MapPin size={14} />{location || 'ที่ตั้งโครงการ'}</p>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-md">{status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex justify-between items-center gap-3 shrink-0">
                    <button onClick={handlePrev} className={`px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 text-sm ${step === 1 ? 'invisible' : ''}`}>
                        <ChevronLeft size={16} /> ย้อนกลับ
                    </button>
                    <div className="flex-1"></div>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95 text-sm">
                        ยกเลิก
                    </button>
                    <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-lg shadow-brand-500/20 transition-all active:scale-95 flex items-center gap-2 text-sm">
                        {step === 3 ? (initialData ? 'บันทึกการแก้ไข' : 'สร้างโครงการ') : 'ถัดไป'}
                        {step < 3 && <ChevronRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
