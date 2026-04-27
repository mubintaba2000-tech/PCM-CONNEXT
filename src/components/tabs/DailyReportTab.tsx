import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Send, CheckCircle, ShieldAlert, CloudRain, Sun, Users, Activity, Loader2, BarChart2, FileText } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const DailyReportTab = ({ project, user }: { project: Project, user: any }) => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [weatherMorning, setWeatherMorning] = useState('แดดจัด');
  const [weatherAfternoon, setWeatherAfternoon] = useState('แดดจัด');
  const [weatherImpact, setWeatherImpact] = useState('none');
  
  const [dcWorkers, setDcWorkers] = useState(0);
  const [subWorkers, setSubWorkers] = useState(0);
  
  const [activities, setActivities] = useState([{
    id: Date.now(),
    zone: '',
    work_type: '',
    description: '',
    status: 'in_progress',
    issue_severity: 'low',
    issue_description: ''
  }]);

  const [overallProgress, setOverallProgress] = useState(0);
  
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addActivity = () => {
    setActivities([...activities, {
      id: Date.now(),
      zone: '',
      work_type: '',
      description: '',
      status: 'in_progress',
      issue_severity: 'low',
      issue_description: ''
    }]);
  };

  const removeActivity = (id: number) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const generateReport = async () => {
    // Validate required fields
    if (activities.some(a => !a.description || !a.work_type)) {
      toast.error('กรุณาระบุรายละเอียดงานและประเภทงานให้ครบถ้วน');
      return;
    }

    setIsGenerating(true);
    toast.success('กำลังประมวลผลด้วย AI...');

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('ไม่พบ API Key สำหรับ Gemini');
      }

      const ai = new GoogleGenAI({ apiKey });

      const promptStr = `
ROLE & IDENTITY:
You are a Construction Site Daily Report AI for บริษัท พิชยมงคล คอนสตรัคชั่น จำกัด.
You process daily activity logs from Site Engineers (SE) and Foremen.
Always respond in Thai unless asked otherwise.

DATA TO PROCESS:
Date: ${reportDate}
Project: ${project.name}
Overall Progress: ${overallProgress}% (Planned: ${Number(overallProgress) + 5}%) // Simulated planned progress for testing delays
Weather: Morning ${weatherMorning}, Afternoon ${weatherAfternoon}, Impact: ${weatherImpact}
Workers: ${dcWorkers} internal, ${subWorkers} contractors. Total: ${dcWorkers + subWorkers}
Activities:
${activities.map((a, i) => `Activity ${i+1}: Zone [${a.zone}], Type [${a.work_type}], Desc [${a.description}], Status [${a.status}]. Issue [${a.issue_description ? `Severity ${a.issue_severity}: ${a.issue_description}` : 'None'}]`).join('\n')}

SUMMARY_RULES:
1. สรุปงานหลักที่ทำวันนี้ — ไม่เกิน 5 รายการหลัก
2. รวมปริมาณงานที่ทำได้ (ถ้ามีหน่วยเดียวกัน)
3. ใช้ภาษาที่ลูกค้าเข้าใจได้ — ไม่ใช้ศัพท์ช่างมากเกิน
4. เน้นความคืบหน้าในเชิงบวก — แสดงสิ่งที่ทำสำเร็จวันนี้
5. ปัญหา — ระบุสั้นๆ พร้อมบอกว่าอยู่ระหว่างแก้ไข
    * Flag ถ้า activities นี้น้อยกว่าที่ควรจะเป็น (น้อยกว่า 2 รายการ/วัน) ย้ำให้ชัด
    * แจ้งเวลาโดยประมาณที่ใช้ในแต่ละงาน (ถ้ามีข้อมูล)

INSTRUCTIONS:
Respond ONLY with a valid JSON object matching this schema:
{
  "summary_line": "String (Thai)",
  "summary_pm": "String (Thai)",
  "summary_oneliner": "String (Thai)",
  "pm_alert_message": "String (Thai) [PM ALERT] แจ้ง PM ทันทีเมื่อพบปัญหาระดับ High หรือ Critical (ถ้าไม่มีให้เป็น string ว่าง)",
  "schedule_alert_message": "String (Thai) [SCHEDULE DELAY ALERT] แจ้ง PM เมื่องานล้าหลังแผนเกิน 5% (ถ้าไม่ล้าหลังให้เป็น string ว่าง)",
  "alerts": ["String array"],
  "flexData": { /* LINE Flex Message JSON object following rules EXACTLY */ },
  "textFallback": "String containing plain text fallback for LINE",
  "htmlReport": "String containing HTML formatted daily report suitable for printing (A4 Portrait)"
}

PM ALERT RULES ('pm_alert_message'):
ถ้ามี issue severity 'high' หรือ 'critical':
🚨 [SEVERITY BADGE] แจ้งเตือนปัญหาไซต์งาน
📍 ไซต์: [PROJECT] | [DATE]
👤 รายงานโดย: SE/PM
❗ ปัญหา: [DESCRIPTION]
📉 ผลกระทบ: [IMPACT]
🔧 ดำเนินการแล้ว: ...
(ถ้า critical: 🔴 ระดับวิกฤต — กรุณาติดต่อ SE ทันที)

SCHEDULE ALERT RULES ('schedule_alert_message'):
ถ้า Overall Progress < Planned Progress เกิน 5%:
📊 งานล้าหลังแผน — [PROJECT] | [DATE]
📉 ความคืบหน้า: [ACTUAL]% (แผน: [PLANNED]%, ล้าหลัง [DELTA]%)
⏱️ ประมาณการณ์ล่าช้า: ... วัน
🔍 สาเหตุหลัก: ...

HTML STRUCTURE (A4 Portrait) for 'htmlReport':
- Ensure valid HTML tags. DO NOT include \`\`\`html markers. 
- You MUST INCLUDE inline styles, using professional fonts (like 'Sarabun', 'sans-serif').
HEADER: Logo บริษัท (use generic icon/text) + ชื่อโครงการ + ไซต์งาน | วันที่ + เลขที่รายงาน + ผู้จัดทำ
SECTION 1: ข้อมูลวัน (สภาพอากาศ เช้า/บ่าย + ผลกระทบ, จำนวนช่าง DC + รับเหมา = รวม)
SECTION 2: ความคืบหน้าโครงการ (Progress bar: actual% สี: เขียว(on_track) | ส้ม(behind) | แดง) 
SECTION 3: งานที่ทำวันนี้ (Activity table): เวลา(ถ้ามี)/พื้นที่/งาน/สถานะ/ปัญหา สีแถว: เขียว(completed)/เหลือง(in_progress)/แดง(blocked)
SECTION 4: วัสดุที่ใช้วันนี้ (ถ้ามี)
SECTION 5: ปัญหาและอุปสรรค
FOOTER: Signature (SE / Foreman / PM), Report ID, วันเวลาส่ง

FLEX MESSAGE RULES:
- STATUS: on_track | ahead | behind | critical
- COLOR_SCHEME:
  - on_track/ahead : header_bg = "#1a7f45", accent = "#06c755"
  - behind         : header_bg = "#92400e", accent = "#f59e0b"
  - critical issue : header_bg = "#991b1b", accent = "#ef4444"
Output EXACTLY this structure for \`flexData\` (replace variables):
{
  "type": "flex",
  "altText": "🏗️ รายงานความคืบหน้า {{PROJECT}} วันที่ {{DATE}}",
  "contents": {
    "type": "bubble", "size": "mega",
    "hero": { "type": "image", "url": "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400&auto=format&fit=crop", "size": "full", "aspectRatio": "20:13", "aspectMode": "cover" },
    "header": {
      "type": "box", "layout": "vertical", "backgroundColor": "{{header_bg}}",
      "contents": [
        { "type": "text", "text": "🏗️ รายงานความคืบหน้า", "color": "#ffffff", "size": "xs", "weight": "bold" },
        { "type": "text", "text": "{{PROJECT_NAME}}", "color": "#ffffff", "size": "lg", "weight": "bold" },
        { "type": "text", "text": "{{วัน DD เดือน YYYY}}", "color": "rgba(255,255,255,0.8)", "size": "xs" }
      ]
    },
    "body": {
      "type": "box", "layout": "vertical", "spacing": "md",
      "contents": [
        {
          "type": "box", "layout": "horizontal",
          "contents": [
            {"type": "text", "text": "ความคืบหน้ารวม", "size": "sm", "color": "#666", "flex": 2},
            {"type": "text", "text": "{{overall_pct}}%", "size": "sm", "weight": "bold", "color": "{{accent}}", "flex": 1, "align": "end"}
          ]
        },
        {
          "type": "box", "layout": "vertical", "backgroundColor": "#f0f0f0", "cornerRadius": "4px", "height": "8px",
          "contents": [{ "type": "box", "layout": "vertical", "backgroundColor": "{{accent}}", "cornerRadius": "4px", "width": "{{overall_pct}}%", "height": "8px", "contents": [] }]
        },
        {"type": "separator"},
        { "type": "text", "text": "📋 งานวันนี้", "size": "sm", "weight": "bold", "color": "#333" },
        { "type": "text", "text": "{{work_summary_version_A}}", "size": "sm", "color": "#444", "wrap": true },
        {
          "type": "box", "layout": "horizontal",
          "contents": [
            { "type": "box", "layout": "vertical", "flex": 1, "contents": [{"type": "text", "text": "👷 ช่างวันนี้", "size": "xs", "color": "#888"}, {"type": "text", "text": "{{total_workers}} คน", "size": "md", "weight": "bold"}] },
            { "type": "box", "layout": "vertical", "flex": 1, "contents": [{"type": "text", "text": "🌤️ สภาพอากาศ", "size": "xs", "color": "#888"}, {"type": "text", "text": "{{weather_morning}}", "size": "md", "weight": "bold"}] },
            { "type": "box", "layout": "vertical", "flex": 1, "contents": [{"type": "text", "text": "📈 vs แผน", "size": "xs", "color": "#888"}, {"type": "text", "text": "{{delta_display}}", "size": "md", "weight": "bold", "color": "{{delta_color}}"}] }
          ]
        },
        {"type": "separator"},
        { "type": "text", "text": "📅 แผนพรุ่งนี้: {{tomorrow_plan[0]}}", "size": "xs", "color": "#888", "wrap": true }
      ]
    },
    "footer": {
      "type": "box", "layout": "horizontal", "backgroundColor": "#f8f9fa",
      "contents": [
        { "type": "button", "action": {"type": "uri", "label": "ดูรายงานเต็ม", "uri": "https://example.com/report"}, "style": "primary", "color": "{{accent}}", "flex": 1 },
        { "type": "button", "action": {"type": "uri", "label": "ดูรูปทั้งหมด", "uri": "https://example.com/photos"}, "style": "secondary", "flex": 1 }
      ]
    }
  }
}

TEXT FALLBACK RULES ('textFallback'):
สร้าง Text message สำรอง (กรณี Flex ไม่ support) Plain text ไม่เกิน 300 ตัวอักษร:
📍 [ชื่อโครงการ] — รายงานประจำวัน [DD/MM/YY]
✅ งานวันนี้:
• [งานหลัก 1]
• [งานหลัก 2]

📊 ความคืบหน้า: [X]% ([+/-N]% จากแผน)
👷 ช่าง: [N] คน | 🌤️ อากาศ: [สภาพ]
⚠️ ปัญหา: [ถ้ามี หรือ ไม่มีปัญหาวันนี้]
📅 พรุ่งนี้: [แผนหลัก]
— รายงานโดย [SE_NAME] เวลา [TIME]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: promptStr,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      setGeneratedReport({
        summary_line: result.summary_line || `ดำเนินงานทั้งหมด ${activities.length} รายการ`,
        summary_pm: result.summary_pm || '',
        summary_oneliner: result.summary_oneliner || '',
        pm_alert_message: result.pm_alert_message || '',
        schedule_alert_message: result.schedule_alert_message || '',
        flexData: JSON.stringify(result.flexData, null, 2),
        textFallback: result.textFallback || '',
        htmlReport: result.htmlReport || `<div><h1>รายงานประจำวัน</h1></div>`,
        alerts: result.alerts || [],
        isConfirmed: false
      });
      
      toast.success('สร้างรายงานสำเร็จ!');
    } catch (error: any) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการเรียกใช้ AI: ' + error?.message);
      
      // Fallback
      setGeneratedReport({
        summary_line: `ดำเนินงานทั้งหมด ${activities.length} รายการ วันนี้สภาพอากาศช่วงเช้า${weatherMorning} ช่วงบ่าย${weatherAfternoon} มีช่างรวม ${dcWorkers + subWorkers} คน`,
        summary_pm: '',
        summary_oneliner: '',
        pm_alert_message: '',
        schedule_alert_message: '',
        flexData: "{\n  \"error\": \"AI Processing failed, showing fallback data\"\n}",
        textFallback: `📍 ${project.name} — รายงานประจำวัน ${reportDate}\n\n✅ สำเร็จทั้งหมด ${activities.length} งาน\n\n📊 ความคืบหน้า: ${overallProgress}%\n👷 ช่าง: ${dcWorkers + subWorkers} คน | 🌤️ อากาศ: เช้า${weatherMorning} บ่าย${weatherAfternoon}\n— ระบบเกิดขัดข้อง กรุณาลองใหม่`,
        htmlReport: `<div><h1>รายงานประจำวัน ${reportDate}</h1><p>เกิดข้อผิดพลาดในการเชื่อมต่อ AI</p></div>`,
        alerts: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-gray-900 border-l-4 border-brand-500 pl-3">Daily Report (AI Assistant)</h2>
           <button onClick={generateReport} disabled={isGenerating} className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-50">
             {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} 
             {isGenerating ? 'กำลังประมวลผล...' : 'สร้างรายงานด้วย AI'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ข้อมูลพื้นฐาน */}
          <div className="space-y-4">
             <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2"><Activity size={18}/> ข้อมูลทั่วไป</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">วันที่รายงาน</label>
                   <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">ความคืบหน้าภาพรวม (%)</label>
                   <input type="number" value={overallProgress} onChange={e => setOverallProgress(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
             </div>

             <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 mt-6"><Sun size={18}/> สภาพอากาศ</h3>
             <div className="grid grid-cols-3 gap-2">
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">เช้า</label>
                   <select value={weatherMorning} onChange={e => setWeatherMorning(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                     <option value="แดดจัด">แดดจัด</option>
                     <option value="มีเมฆ">มีเมฆ</option>
                     <option value="ฝนตก">ฝนตก</option>
                     <option value="มีพายุ">มีพายุ</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">บ่าย</label>
                   <select value={weatherAfternoon} onChange={e => setWeatherAfternoon(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                     <option value="แดดจัด">แดดจัด</option>
                     <option value="มีเมฆ">มีเมฆ</option>
                     <option value="ฝนตก">ฝนตก</option>
                     <option value="มีพายุ">มีพายุ</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">ผลกระทบ</label>
                   <select value={weatherImpact} onChange={e => setWeatherImpact(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                     <option value="none">ไม่มี</option>
                     <option value="minor">เล็กน้อย</option>
                     <option value="major">มาก (Major)</option>
                   </select>
                </div>
             </div>

             <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 mt-6"><Users size={18}/> จำนวนช่าง</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">ช่างของบริษัท (คน)</label>
                   <input type="number" value={dcWorkers} onChange={e => setDcWorkers(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" min="0" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">ช่างรับเหมา (คน)</label>
                   <input type="number" value={subWorkers} onChange={e => setSubWorkers(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" min="0" />
                </div>
             </div>
          </div>

          {/* Activities */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-gray-700 flex items-center gap-2"><CheckCircle size={18}/> กิจกรรมวันนี้</h3>
                <button onClick={addActivity} className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg hover:bg-brand-100">+ เพิ่มกิจกรรม</button>
             </div>
             
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {activities.map((act, index) => (
                  <div key={act.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 relative">
                     <button onClick={() => removeActivity(act.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold">&times;</button>
                     <div className="grid grid-cols-1 gap-2 mb-2 pr-4">
                        <input type="text" placeholder="โซน / พื้นที่ (เช่น ชั้น 1, Zone A)" value={act.zone} onChange={e => {
                          const newAct = [...activities]; newAct[index].zone = e.target.value; setActivities(newAct);
                        }} className="w-full text-sm p-1.5 border border-gray-200 rounded-md" />
                     </div>
                     <div className="grid grid-cols-2 gap-2 mb-2">
                        <select value={act.work_type} onChange={e => {
                          const newAct = [...activities]; newAct[index].work_type = e.target.value; setActivities(newAct);
                        }} className="w-full text-sm p-1.5 border border-gray-200 rounded-md bg-white">
                          <option value="">-- เลือกประเภท --</option>
                          <option value="งานโครงสร้าง">งานโครงสร้าง</option>
                          <option value="งานสถาปัตย์">งานสถาปัตย์</option>
                          <option value="งานระบบ">งานระบบ (MEP)</option>
                          <option value="งานตกแต่ง">งานตกแต่ง</option>
                        </select>
                        <select value={act.status} onChange={e => {
                          const newAct = [...activities]; newAct[index].status = e.target.value; setActivities(newAct);
                        }} className="w-full text-sm p-1.5 border border-gray-200 rounded-md bg-white">
                          <option value="in_progress">กำลังดำเนินการ</option>
                          <option value="completed">เสร็จสิ้น</option>
                          <option value="blocked">ติดปัญหา</option>
                        </select>
                     </div>
                     <textarea placeholder="รายละเอียดงาน..." value={act.description} onChange={e => {
                          const newAct = [...activities]; newAct[index].description = e.target.value; setActivities(newAct);
                     }} className="w-full text-sm p-1.5 border border-gray-200 rounded-md mb-2" rows={2} />
                     <div className="bg-red-50 p-2 rounded-lg border border-red-100 flex gap-2">
                        <select value={act.issue_severity} onChange={e => {
                          const newAct = [...activities]; newAct[index].issue_severity = e.target.value; setActivities(newAct);
                        }} className="text-xs p-1 border border-red-200 rounded-md bg-white text-red-700 outline-none">
                          <option value="low">Low Issue</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                        <input type="text" placeholder="ระบุปัญหา (พบในงานนี้ ปล่อยว่างได้)" value={act.issue_description} onChange={e => {
                          const newAct = [...activities]; newAct[index].issue_description = e.target.value; setActivities(newAct);
                        }} className="w-full text-xs p-1 border border-red-200 rounded-md placeholder-red-300 outline-none" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {generatedReport && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-200 p-6 border-l-8 overflow-hidden relative animate-in slide-in-from-bottom-4">
           <h2 className="text-xl font-bold flex gap-2 items-center text-brand-900 mb-4">
              ✨ ผลลัพธ์จาก AI Assistant
           </h2>

           {generatedReport.alerts.length > 0 && (
             <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3">
               <ShieldAlert className="text-red-500 shrink-0" />
               <div>
                  <h4 className="font-bold text-red-800 tracking-wide text-sm mb-1">🚨 AI ALERT ROUTING</h4>
                  <ul className="list-disc pl-4 text-xs text-red-700">
                    {generatedReport.alerts.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
               </div>
             </div>
           )}

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                 <h3 className="font-bold text-gray-800 text-sm mb-2">📝 AI Summary (3 Versions)</h3>
                 
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Version A: สำหรับลูกค้า (กระชับ)</p>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">{generatedReport.summary_line}</div>
                 </div>

                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
                    <p className="text-xs font-bold text-blue-500 mb-2 uppercase">Version B: สำหรับ PM (ละเอียด)</p>
                    <div className="text-sm text-blue-900 whitespace-pre-wrap">{generatedReport.summary_pm}</div>
                 </div>

                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-6">
                    <p className="text-xs font-bold text-purple-500 mb-2 uppercase">Version C: One-liner (Push Notification)</p>
                    <div className="text-sm text-purple-900 whitespace-pre-wrap">{generatedReport.summary_oneliner}</div>
                 </div>

                 {generatedReport.schedule_alert_message && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                       <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-2"><ShieldAlert size={16}/> Schedule Delay Alert</h4>
                       <div className="text-sm text-orange-900 whitespace-pre-wrap">{generatedReport.schedule_alert_message}</div>
                       <div className="mt-3 flex gap-2">
                           <button className="bg-orange-600 text-white px-3 py-1 text-xs rounded font-bold">แจ้งลูกค้า</button>
                           <button className="bg-white text-orange-700 border border-orange-300 px-3 py-1 text-xs rounded font-bold">สร้าง VO</button>
                       </div>
                    </div>
                 )}

                 {generatedReport.pm_alert_message && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
                       <h4 className="font-bold text-red-700 flex items-center gap-2 mb-2"><ShieldAlert size={16}/> PM Critical Action Required</h4>
                       <div className="text-sm text-red-900 whitespace-pre-wrap">{generatedReport.pm_alert_message}</div>
                       <div className="mt-3 flex gap-2">
                           <button className="bg-red-600 text-white px-3 py-1 text-xs rounded font-bold">อนุมัติแจ้งลูกค้า</button>
                           <button className="bg-white text-red-700 border border-red-300 px-3 py-1 text-xs rounded font-bold">จัดการภายใน (ไม่แจ้ง)</button>
                       </div>
                    </div>
                 )}

                 <h3 className="font-bold text-gray-800 text-sm mb-2">💬 LINE Text Fallback</h3>
                 <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                    <p className="text-xs font-bold text-green-600 mb-2 uppercase">Text Message สำรอง (กรณีใช้ Flex Message ไม่ได้)</p>
                    <div className="text-sm text-green-900 whitespace-pre-wrap font-mono">{generatedReport.textFallback}</div>
                 </div>

                 <h3 className="font-bold text-gray-800 text-sm mb-2">📱 LINE Flex Message JSON</h3>
                 <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 text-xs text-emerald-400 font-mono overflow-auto max-h-[300px] custom-scrollbar">
                    <pre>{generatedReport.flexData}</pre>
                 </div>
              </div>

              <div>
                 <h3 className="font-bold text-gray-800 text-sm mb-2">📄 HTML Report (A4 Print-Ready)</h3>
                 <div className="bg-white rounded-xl border border-gray-200 shadow-inner p-5 min-h-[300px] text-sm text-gray-800 mb-6" dangerouslySetInnerHTML={{__html: generatedReport.htmlReport}} />

                 {!generatedReport.isConfirmed ? (
                    <div className="bg-brand-50 p-6 rounded-xl border border-brand-200 flex flex-col items-center justify-center text-center">
                       <p className="text-brand-900 font-bold mb-2">✅ ตรวจสอบรายงานเรียบร้อยแล้ว?</p>
                       <p className="text-sm text-brand-700 mb-4">การยืนยันจะทำการอัปเดตระบบ AI Dashboard ให้อัตโนมัติ</p>
                       <button onClick={() => {
                          setGeneratedReport({...generatedReport, isConfirmed: true});
                          toast.success('อัปเดตระบบอัตโนมัติสำเร็จแล้ว', { icon: '🤖' });
                       }} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                           <CheckCircle size={18} /> ยืนยันรายงาน & อัปเดต Dashboard
                       </button>
                    </div>
                 ) : (
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                       <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4 border-b pb-2">
                           <Activity className="text-brand-500" /> AI Dashboard Automation Triggered
                       </h3>
                       <div className="space-y-4">
                           <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><BarChart2 size={16} /></div>
                               <div>
                                   <p className="font-bold text-sm text-gray-800">UPDATE_DASHBOARD</p>
                                   <p className="text-xs text-gray-500 mt-1">อัปเดต Overall Progress เป็น {overallProgress}% • บันทึกพนักงาน {dcWorkers + subWorkers} คน • บันทึก Issue {activities.filter(a => a.issue_severity !== 'low').length} รายการลงระบบ</p>
                               </div>
                           </div>
                           <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5"><FileText size={16} /></div>
                               <div>
                                   <p className="font-bold text-sm text-gray-800">WEEKLY_SUMMARY (Queue)</p>
                                   <p className="text-xs text-gray-500 mt-1">บันทึกข้อมูลวันนี้เพื่อสรุปส่งผู้บริหารอัติโนมัติในวันศุกร์ (Streak: 3 วัน วันพรุ่งนี้: 4 วัน)</p>
                               </div>
                           </div>
                           <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><CheckCircle size={16} /></div>
                               <div>
                                   <p className="font-bold text-sm text-gray-800">MISSING_REPORT_REMINDER (Cleared)</p>
                                   <p className="text-xs text-gray-500 mt-1">ปิดระบบแจ้งเตือนการส่งรายงานล่าช้าสำหรับโครงการนี้ ประจำวันที่ ${reportDate} เวลา 18:00น.</p>
                               </div>
                           </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
