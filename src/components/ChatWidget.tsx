import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-700 hover:scale-105 transition-all z-40 group"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="bg-brand-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">PCM AI Assistant</h3>
              <p className="text-xs text-brand-100">ออนไลน์พร้อมช่วยเหลือคุณ</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-brand-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="h-64 p-4 bg-gray-50 flex flex-col gap-3 overflow-y-auto">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-100 shadow-sm max-w-[85%] text-sm text-gray-700">
              สวัสดีครับ! ผมคือ AI Assistant ของ PCM
            </div>
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-100 shadow-sm max-w-[85%] text-sm text-gray-700">
              สำหรับการทดสอบฟีเจอร์ กรุณาพิมพ์คำสั่งทาง AI Studio Chat ด้านซ้ายมือนะครับ เช่น:<br/>
              - "จำลอง Role เป็นลูกค้า"<br/>
              - "PM อนุมัติส่งให้ลูกค้า VO-001"<br/>
              - "ตรวจสอบงานที่ lock ทั้งหมด"<br/>
              - "VO dashboard วันนี้"
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="relative">
              <input type="text" placeholder="พิมพ์คำถามของคุณ..." className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              <button className="absolute right-2 top-1.5 p-1 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
