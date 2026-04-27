import React, { useState } from 'react';
import { User } from '../types';
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';

export const LoginScreen = ({ onLogin }: { onLogin?: (u: User) => void }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles: Record<string, User> = {
    'admin@pcm.com': { name: 'Admin User', email: 'admin@pcm.com', role: 'admin', roleName: 'ผู้ดูแลระบบ', avatar: 'https://ui-avatars.com/api/?name=Admin&background=111827&color=fff' },
    'owner@pcm.com': { name: 'Owner User', email: 'owner@pcm.com', role: 'owner', roleName: 'เจ้าของบริษัท', avatar: 'https://ui-avatars.com/api/?name=Owner&background=e55a30&color=fff' },
    'sales@pcm.com': { name: 'Sales User', email: 'sales@pcm.com', role: 'sales', roleName: 'ฝ่ายขาย', avatar: 'https://ui-avatars.com/api/?name=Sales&background=ef4444&color=fff' },
    'engineer@pcm.com': { name: 'Engineer User', email: 'engineer@pcm.com', role: 'engineer', roleName: 'วิศวกร', avatar: 'https://ui-avatars.com/api/?name=Eng&background=3b82f6&color=fff' },
    'architect@pcm.com': { name: 'Architect User', email: 'architect@pcm.com', role: 'architect', roleName: 'สถาปนิก', avatar: 'https://ui-avatars.com/api/?name=Arch&background=8b5cf6&color=fff' },
    'qs@pcm.com': { name: 'QS User', email: 'qs@pcm.com', role: 'qs', roleName: 'ประเมินราคา', avatar: 'https://ui-avatars.com/api/?name=QS&background=10b981&color=fff' },
    'foreman@pcm.com': { name: 'Foreman User', email: 'foreman@pcm.com', role: 'foreman', roleName: 'โฟร์แมน', avatar: 'https://ui-avatars.com/api/?name=Foreman&background=f59e0b&color=fff' },
    'accountant@pcm.com': { name: 'Accountant User', email: 'accountant@pcm.com', role: 'accountant', roleName: 'ฝ่ายบัญชี', avatar: 'https://ui-avatars.com/api/?name=Acc&background=14b8a6&color=fff' },
    'client@pcm.com': { name: 'Client User', email: 'client@pcm.com', role: 'client', roleName: 'ลูกค้า / ผู้ว่าจ้าง', avatar: 'https://ui-avatars.com/api/?name=Client&background=ec4899&color=fff' },
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast.error('ล็อกอินไม่สำเร็จ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast.error('กรุณากรอกอีเมลและรหัสผ่าน');
        return;
    }
    
    // Check mock credentials (password is always password123 for demo)
    if (password !== 'password123' || !roles[email]) {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        return;
    }

    setLoading(true);
    try {
      const chosenUser = roles[email];
      localStorage.setItem('pcm_mock_role', JSON.stringify(chosenUser));
      await signInAnonymously(auth);
      if (onLogin) {
          onLogin(chosenUser);
      }
    } catch (error: any) {
      toast.error('ล็อกอินไม่สำเร็จ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row w-full max-w-[1100px] h-full sm:h-auto min-h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transition-opacity duration-300">
        
        {/* Left Side */}
        <div className="hidden md:block md:w-1/2 relative bg-brand-900 order-2 md:order-1">
          <img 
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            src="./LINE_ALBUM_FINAL DESIGN 22042568_260420_1.jpg" 
            alt="Building View" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-4xl font-bold mb-3 tracking-tight">ยกระดับมาตรฐานงานก่อสร้าง</h2>
              <p className="text-gray-200 text-[15px] leading-relaxed">
                  แพลตฟอร์มบริหารจัดการโครงการแบบครบวงจร<br/>
                  เชื่อมต่อการทำงาน ควบคุมคุณภาพ และส่งมอบความเป็นเลิศในทุกโครงการ
              </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-14 relative order-1 md:order-2">
          <div className="w-full max-w-[360px] flex flex-col items-start justify-center mt-4 md:mt-0">
              <div className="w-full flex justify-center mb-10">
                  <img src="./Pichayamongkol_2-D1n1MbyP (1).png" alt="Pichayamongkol Construction Logo" className="w-full max-w-[320px] h-auto object-contain" referrerPolicy="no-referrer" />
              </div>

              <button disabled={loading} onClick={loginWithGoogle} type="button" className="w-full bg-white border border-gray-300 flex items-center justify-center h-12 rounded-xl hover:bg-gray-50 transition-colors shadow-sm group">
                  <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="Google Logo" className="h-6 sm:h-7 w-auto group-hover:scale-105 transition-transform" />
                  <span className="ml-3 font-medium text-gray-700">เข้าสู่ระบบด้วย Google</span>
              </button>

              <div className="flex items-center gap-4 w-full my-6">
                  <div className="w-full h-px bg-gray-200"></div>
                  <p className="whitespace-nowrap text-xs text-gray-400 font-medium uppercase tracking-wider">หรือเข้าใช้งานด้วยอีเมล</p>
                  <div className="w-full h-px bg-gray-200"></div>
              </div>

              <form onSubmit={handleManualLogin} className="w-full flex flex-col gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                      <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. admin@pcm.com" 
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-gray-400"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                      <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-gray-400"
                      />
                  </div>
                  
                  <button disabled={loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium h-12 rounded-xl shadow-lg shadow-brand-500/30 transition-colors mt-2">
                      เข้าสู่ระบบ
                  </button>
              </form>

              <div className="w-full mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-800 mb-2">บัญชีสำหรับทดสอบ (รหัสผ่าน: password123)</h4>
                  <ul className="text-xs text-blue-700 space-y-1 font-mono">
                      <li>• admin@pcm.com (ผู้ดูแลระบบ)</li>
                      <li>• owner@pcm.com (เจ้าของบริษัท)</li>
                      <li>• sales@pcm.com (ฝ่ายขาย)</li>
                      <li>• engineer@pcm.com (วิศวกร)</li>
                      <li>• architect@pcm.com (สถาปนิก)</li>
                      <li>• qs@pcm.com (ประเมินราคา)</li>
                      <li>• foreman@pcm.com (โฟร์แมน)</li>
                      <li>• accountant@pcm.com (บัญชี)</li>
                      <li>• client@pcm.com (ลูกค้า)</li>
                  </ul>
              </div>

              <p className="text-center w-full text-gray-500 text-sm mt-8">
                  ต้องการขอสิทธิ์เข้าใช้งานระบบ? <a className="font-medium text-brand-600 hover:text-brand-700 transition-colors" href="#">ติดต่อผู้ดูแลระบบ (Admin)</a>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
