import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Download, AlertTriangle, ShieldAlert, CheckCircle, FileText, Server, Clock, CalendarDays, Eye, Lock } from 'lucide-react';

export const PlanTab = ({ project, user }: { project: Project, user: any }) => {
  const [activePlanType, setActivePlanType] = useState<'master' | 'actual' | '3week' | 'lock_check'>('master');
  const [showJsonDump, setShowJsonDump] = useState(false);
  const [exportData, setExportData] = useState<string>("");

  const role = user?.role || 'client';
  
  // PERMISSIONS Mapping
  const canEditMaster = ['pm', 'admin'].includes(role);
  const canEdit3Week = ['pm', 'admin', 'engineer'].includes(role);
  const canSubmitProgress = ['contractor', 'pm', 'admin'].includes(role);
  const canExport = ['pm', 'admin', 'owner'].includes(role);
  const isContractor = role === 'contractor';

  const allTasks = [
    { id: 'WC01', name: 'งานเตรียมพื้นที่และงานดิน', start: '2025-07-01', end: '2025-07-14', actual_start: '2025-07-01', actual_finish: '2025-07-13', duration: 14, expected_progress: 100, actual_progress: 100, is_critical: true, contractor: 'ผู้รับเหมาหลัก', dependencies: [], remarks: 'เสร็จก่อนกำหนด 1 วัน', recovery_plan: '', status_flag: 'completed' },
    { id: 'WC02', name: 'งานฐานราก', start: '2025-07-15', end: '2025-08-10', actual_start: '2025-07-14', actual_finish: null, duration: 27, expected_progress: 80, actual_progress: 60, is_critical: true, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC01'], remarks: 'ขยายเวลาเนื่องจากดินสภาพไม่ดี ต้องเสริม', recovery_plan: 'เพิ่มแรงงาน 5 คน', status_flag: 'critical' },
    { id: 'WC03', name: 'งานโครงสร้างชั้น 1', start: '2025-08-11', end: '2025-09-07', actual_start: null, actual_finish: null, duration: 28, expected_progress: 0, actual_progress: 0, is_critical: true, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC02'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC04', name: 'งานโครงสร้างชั้น 2', start: '2025-09-08', end: '2025-10-05', actual_start: null, actual_finish: null, duration: 28, expected_progress: 0, actual_progress: 0, is_critical: true, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC03'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC05', name: 'งานโครงสร้างชั้น 3 และหลังคา', start: '2025-10-06', end: '2025-11-09', actual_start: null, actual_finish: null, duration: 35, expected_progress: 0, actual_progress: 0, is_critical: true, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC04'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC06', name: 'งานผนัง ฉาบปูน กระเบื้อง', start: '2025-09-08', end: '2025-10-22', actual_start: null, actual_finish: null, duration: 45, expected_progress: 0, actual_progress: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC03'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC07', name: 'งานระบบไฟฟ้า (MEP-E)', start: '2025-09-08', end: '2025-10-07', actual_start: null, actual_finish: null, duration: 30, expected_progress: 0, actual_progress: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC03'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC08', name: 'งานระบบประปา (MEP-P)', start: '2025-09-08', end: '2025-10-07', actual_start: null, actual_finish: null, duration: 30, expected_progress: 0, actual_progress: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC03'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC09', name: 'งานตกแต่งภายใน', start: '2025-10-23', end: '2025-12-01', actual_start: null, actual_finish: null, duration: 40, expected_progress: 0, actual_progress: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC06', 'WC07', 'WC08'], remarks: '', recovery_plan: '', status_flag: 'not_started' },
    { id: 'WC10', name: 'งานภายนอกและภูมิสถาปัตย์', start: '2025-11-10', end: '2025-11-30', actual_start: null, actual_finish: null, duration: 21, expected_progress: 0, actual_progress: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', dependencies: ['WC05'], remarks: '', recovery_plan: '', status_flag: 'not_started' }
  ];

  const threeWeekTasks = [
    {
        id: "WC03-A",
        parent_task: "WC03",
        name: "เทคอนกรีตเสาและคานชั้น 1 Zone A",
        zone: "ชั้น 1 / Zone A",
        start: "2026-03-08",
        end: "2026-03-12",
        duration: 5,
        crew_required: { foreman: 1, skilled_worker: 4, general_worker: 8 },
        equipment: ["รถผสมคอนกรีต", "ปั้นจั่น"],
        materials: [
          {name: "คอนกรีต fc=240", quantity: 45, unit: "m³", delivery_date: "2026-03-08"},
          {name: "เหล็กเสริม DB16", quantity: 800, unit: "kg", delivery_date: "2026-03-08"}
        ],
        prerequisite_tasks: ["WC02"],
        prerequisite_inspections: ["QC-ITP-001 Pre-pour inspection"],
        constraints: "ห้ามเทในช่วงฝนตก, ต้องมี QC Inspector อยู่ตลอดการเท",
        contractor: "ผู้รับเหมาหลัก"
    }
  ];

  const lockCheckTasks = [
     { id: 'WC05', name: 'งานโครงสร้างชั้น 3 และหลังคา', start: '2025-10-06', actual_progress: 0, contractor: 'ผู้รับเหมาหลัก', gantt_locked: false },
     { id: 'WC06', name: 'งานผนัง ฉาบปูน กระเบื้อง', start: '2025-09-08', actual_progress: 0, contractor: 'ผู้รับเหมาหลัก', gantt_locked: false },
     { id: 'WC11', name: 'งานเพิ่มติดตั้งลิฟต์ (VO+)', start: '2025-12-01', actual_progress: 0, contractor: 'ผู้รับเหมาลิฟต์', gantt_locked: true, vo_no: 'BKK2568-VO-003', invoice_no: 'INV-2568-005', invoice_status: 'overdue', due_date: '2026-04-20', balance: 1070000, vo_status: 'approved' },
     { id: 'WC12', name: 'งานทาสีภายนอก (ส่วนเพิ่ม)', start: '2025-11-20', actual_progress: 0, contractor: 'ผู้รับเหมาทาสี', gantt_locked: true, vo_no: 'BKK2568-VO-004', invoice_no: 'INV-2568-006', invoice_status: 'billed', due_date: '2026-05-15', balance: 50000, vo_status: 'approved' },
     { id: 'WC13', name: 'ขยายหน้าต่างแบบพิเศษ', start: '2025-10-15', actual_progress: 0, contractor: 'ผู้รับเหมาหลัก', gantt_locked: true, vo_no: 'BKK2568-VO-005', vo_status: 'pending_approval', submit_date: '2026-04-20', pending_days: 7 }
  ];

  // Logic: Contractor sees only 3-week plan and only their own work
  let visibleTasks = allTasks;
  let visible3WeekTasks = threeWeekTasks;
  if (isContractor) {
      if (activePlanType !== '3week') {
          visibleTasks = [];
      } else {
          visibleTasks = allTasks.filter(t => t.contractor.includes('หลัก')); 
          visible3WeekTasks = threeWeekTasks.filter(t => t.contractor.includes('หลัก')); 
      }
  }

  const getVarianceBadge = (variance: number) => {
      if (variance <= -15) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold flex items-center gap-1 w-max"><ShieldAlert size={12}/> CRITICAL ({variance}%)</span>;
      if (variance <= -5) return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold flex items-center gap-1 w-max"><AlertTriangle size={12}/> WARNING ({variance}%)</span>;
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold flex items-center gap-1 w-max"><CheckCircle size={12}/> ON TRACK</span>;
  };

  const getStatusFlagString = (variance: number, actual: number) => {
      if (actual === 100) return 'completed';
      if (variance <= -15) return 'critical';
      if (variance <= -5) return 'warning';
      return 'on_track';
  }

  const generatePDFHTML = () => {
    const isMaster = activePlanType === 'master';
    const isActual = activePlanType === 'actual';
    const is3week = activePlanType === '3week';
    
    // As per requirement, Gantt is A3 Landscape
    const paperSize = "A3 landscape"; 
    const planTitle = isMaster ? "MASTER PLAN" : isActual ? "ACTUAL PLAN" : "3-WEEK PLAN";
    const reportDate = new Date().toLocaleDateString('th-TH');
    const preparedBy = user?.name || "วิศวกร";
    const approvedBy = "PM";

    let contentHTML = "";

    if (isMaster || isActual) {
        contentHTML = `
        <table class="gantt-table">
            <thead>
                <tr>
                    <th style="width: 40px;">Task ID</th>
                    <th style="width: 160px;">Task Name</th>
                    <th style="width: 80px;">Resp</th>
                    <th style="width: 35px;">Dur</th>
                    ${Array.from({length: 22}).map((_, i) => `<th style="width: 18px; font-size: 8px;">W${i+1}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${visibleTasks.map((t, idx) => {
                    const projectStart = new Date("2025-07-01");
                    const taskStart = new Date(t.start);
                    const startDiffTime = Math.max(0, taskStart.getTime() - projectStart.getTime());
                    const startDiffDays = Math.ceil(startDiffTime / (1000 * 60 * 60 * 24));
                    const startWeek = Math.floor(startDiffDays / 7);
                    
                    const durationWeeks = Math.max(1, Math.floor(t.duration / 7));
                    const endWeek = Math.min(22, startWeek + durationWeeks - 1);
                    
                    const cells = Array.from({length: 22}).map((_, i) => {
                        let innerHtml = "";
                        
                        if (i >= startWeek && i <= endWeek) {
                            if (isMaster) {
                                innerHtml = `<div class="gantt-bar master-bar"></div>`;
                            } else if (isActual) {
                                const variance = t.actual_progress - t.expected_progress;
                                const barClass = variance < -5 ? "actual-bar delayed" : "actual-bar";
                                innerHtml = `<div class="gantt-bar ${barClass}"></div>`;
                            }
                        }
                        return `<td>${innerHtml}</td>`;
                    }).join('');

                    const variance = t.actual_progress - t.expected_progress;
                    const rowClass = variance < -5 && isActual ? 'class="delayed-row"' : '';

                    return `
                    <tr ${rowClass}>
                        <td style="width: 40px;">${t.id}</td>
                        <td style="width: 160px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${t.name}</td>
                        <td style="width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${t.contractor.split(' ')[0]}</td>
                        <td style="width: 35px; text-align:center;">${t.duration}d</td>
                        ${cells}
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        `;
    } else if (is3week) {
        contentHTML = `
        <table class="gantt-table">
            <thead>
                <tr>
                    <th style="width: 40px;">Task ID</th>
                    <th style="width: 160px;">Task / Zone</th>
                    <th style="width: 80px;">Resp</th>
                    <th style="width: 35px;">Dur</th>
                    ${Array.from({length: 21}).map((_, i) => `<th style="width: 18px; font-size: 8px;">D${i+1}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${visible3WeekTasks.map(t => {
                    const durationDays = Math.min(21, t.duration);
                    
                    const cells = Array.from({length: 21}).map((_, i) => {
                        let innerHtml = "";
                        if (i < durationDays) {
                            innerHtml = `<div class="gantt-bar master-bar">
                               ${i === 1 ? '<div class="milestone-dot" style="background: #FFD600;"></div>' : ''}
                               ${i === durationDays - 1 ? '<div class="milestone-dot" style="background: #2E7D32;"></div>' : ''}
                            </div>`;
                        }
                        return `<td>${innerHtml}</td>`;
                    }).join('');

                    return `
                    <tr>
                        <td style="width: 40px;">${t.id}</td>
                        <td style="width: 160px;"><strong>${t.name}</strong><br/><span style="color:#666;">${t.zone}</span></td>
                        <td style="width: 80px;">${t.contractor.split(' ')[0]}</td>
                        <td style="width: 35px; text-align:center;">${t.duration}d</td>
                        ${cells}
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        `;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${planTitle} - ${project.name}</title>
    <style>
        @page {
            size: ${paperSize};
            margin: 12mm 15mm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #333;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        table {
            page-break-inside: auto;
        }
        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        thead {
            display: table-header-group;
        }
        tfoot {
            display: table-footer-group;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .header-left, .header-center, .header-right {
            flex: 1;
        }
        .header-center { text-align: center; }
        .header-right { text-align: right; }
        
        .logo-placeholder {
            display: inline-block;
            width: 30px; height: 30px;
            background: #eee; border: 1px solid #ccc;
            text-align: center; line-height: 30px;
            font-size: 8px; margin-right: 10px; vertical-align: bottom;
        }
        h1 { margin: 0; font-size: 16px; font-weight: bold; }
        h2 { margin: 0; font-size: 14px; }
        
        .gantt-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 20px;
        }
        .gantt-table th, .gantt-table td {
            border: 1px solid #ccc;
            padding: 4px;
            vertical-align: middle;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
        }
        .gantt-table th { background: #f5f5f5; font-weight: bold; text-align: center; }
        .gantt-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
        .gantt-table tbody tr:nth-child(odd) { background-color: #ffffff; }
        .delayed-row { background-color: #ffebee !important; }
        
        .gantt-bar {
            height: 12px;
            border-radius: 2px;
            display: block;
            width: 100%;
            position: relative;
        }
        .master-bar { background-color: rgba(21, 101, 192, 0.3); } 
        .actual-bar { background-color: #2E7D32; }
        .actual-bar.delayed { background-color: #C62828; }
        
        .milestone-dot {
           width: 6px; height: 6px; border-radius: 50%;
           position: absolute; bottom: 3px; left: 5px;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 8px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .signature-block {
            margin-top: 40px;
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        .signature-block th, .signature-block td {
            border: 1px solid #333;
            width: 33.33%;
            padding: 5px;
            text-align: center;
        }
        .signature-block th { background: #f5f5f5; }
        .signature-space { height: 60px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="logo-placeholder">LOGO</div>
            <div style="display:inline-block; vertical-align:bottom;">
                <strong>${project.name || 'Project Name'}</strong><br/>
                สัญญาเลขที่ XXXX
            </div>
        </div>
        <div class="header-center">
            <h1>${planTitle}</h1>
        </div>
        <div class="header-right">
            Rev 1.0<br/>
            หน้า 1
        </div>
    </div>

    ${contentHTML}

    <table class="signature-block">
        <thead>
            <tr>
                <th>จัดทำโดย</th>
                <th>ตรวจสอบโดย</th>
                <th>อนุมัติโดย</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="signature-space">
                   <div style="margin-top: 45px;">
                      วิศวกร<br/>
                      วันที่: ____________
                   </div>
                </td>
                <td class="signature-space">
                   <div style="margin-top: 45px;">
                      PM<br/>
                      วันที่: ____________
                   </div>
                </td>
                <td class="signature-space">
                   <div style="margin-top: 45px;">
                      เจ้าของ<br/>
                      วันที่: ____________
                   </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        เอกสารนี้จัดทำโดยระบบ Construction Management | พิมพ์วันที่ ${reportDate}
    </div>
</body>
</html>`;

    setExportData(html);
    setShowJsonDump(true);
    toast.success("สร้าง HTML สำหรับพิมพ์ PDF สำเร็จ");
    
    try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
        }
    } catch(e) {
        console.warn('Could not open print window automatically', e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">แผนงาน (Schedule Management)</h2>
          <p className="text-sm text-gray-500 mt-1">จัดการแผนงาน Master Plan, Actual Plan และ 3-Week Look-Ahead</p>
        </div>
        <div className="flex gap-2">
          {canExport && (
            <button onClick={generatePDFHTML} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition-all flex items-center gap-2">
              <Download size={16} /> ส่งออก PDF
            </button>
          )}
        </div>
      </div>

      {showJsonDump && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg relative flex flex-col gap-2 max-h-[80vh]">
             <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <span className="text-xs font-bold text-gray-700">HTML Source Code (Copy & Save as .html, then open in browser to Print)</span>
                <button onClick={() => setShowJsonDump(false)} className="text-gray-500 hover:text-gray-900 p-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-bold">Close</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
                 <div className="flex flex-col h-full">
                     <p className="text-xs font-bold mb-1 text-gray-600">Raw HTML String:</p>
                     <textarea className="w-full h-full p-3 font-mono text-xs bg-slate-900 text-green-400 rounded-lg outline-none resize-none" value={exportData} readOnly />
                 </div>
                 <div className="flex flex-col h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                     <p className="text-xs font-bold p-2 bg-gray-100 border-b border-gray-200 text-gray-600">Live Preview:</p>
                     <iframe title="PDF Print Preview" srcDoc={exportData} className="w-full h-full border-none bg-white"></iframe>
                 </div>
             </div>
          </div>
      )}

      {/* Alerts */}
      {visibleTasks.some(t => t.status_flag === 'critical' || t.status_flag === 'warning') && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" />
              <div>
                  <h4 className="font-bold text-red-900">แจ้งเตือนงานล่าช้ากว่าแผน (Schedule Delays Detected)</h4>
                  <ul className="text-sm text-red-800 mt-2 list-disc pl-5 space-y-1">
                      {visibleTasks.filter(t => t.status_flag === 'critical' || t.status_flag === 'warning').map(t => (
                          <li key={t.id}>
                              <strong>{t.id} {t.name}</strong> - ล่าช้า ({t.actual_progress} / {t.expected_progress}%) 
                              {t.remarks ? <span className="ml-1 text-red-600">[{t.remarks}]</span> : ''}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      {/* Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
             <span className="text-gray-500 font-bold mb-1">Total Tasks</span>
             <span className="text-3xl font-bold text-gray-900">{visibleTasks.length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
             <span className="text-gray-500 font-bold mb-1">Completed</span>
             <span className="text-3xl font-bold text-emerald-600">{visibleTasks.filter(t => t.status_flag === 'completed').length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
             <span className="text-gray-500 font-bold mb-1">Delayed (Critical)</span>
             <span className="text-3xl font-bold text-red-600">{visibleTasks.filter(t => t.status_flag === 'critical').length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
             <span className="text-gray-500 font-bold mb-1">Schedule Variance</span>
             <span className={`text-3xl font-bold ${Math.round(visibleTasks.reduce((a,b)=>a+b.actual_progress,0)/visibleTasks.length) - Math.round(visibleTasks.reduce((a,b)=>a+b.expected_progress,0)/visibleTasks.length) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                 {Math.round(visibleTasks.reduce((a,b)=>a+b.actual_progress,0)/visibleTasks.length) - Math.round(visibleTasks.reduce((a,b)=>a+b.expected_progress,0)/visibleTasks.length)}%
             </span>
             <span className={`text-[10px] sm:text-xs mt-1 truncate max-w-full ${Math.round(visibleTasks.reduce((a,b)=>a+b.actual_progress,0)/visibleTasks.length) - Math.round(visibleTasks.reduce((a,b)=>a+b.expected_progress,0)/visibleTasks.length) < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {visibleTasks.filter(t => t.status_flag === 'critical')[0] ? `${visibleTasks.filter(t => t.status_flag === 'critical')[0].id} ล่าช้าที่สุด` : 'ดำเนินงานตามแผน'}
             </span>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto custom-scrollbar">
         {!isContractor && (
           <>
             <button 
                onClick={() => setActivePlanType('master')}
                className={`py-3 px-5 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activePlanType === 'master' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <Server size={16}/> Master Plan
             </button>
             <button 
                onClick={() => setActivePlanType('actual')}
                className={`py-3 px-5 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activePlanType === 'actual' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <Clock size={16}/> Actual Plan
             </button>
             <button 
                onClick={() => setActivePlanType('lock_check')}
                className={`py-3 px-5 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activePlanType === 'lock_check' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <ShieldAlert size={16}/> ตรวจสอบสถานะงาน
             </button>
           </>
         )}
         
         <button 
            onClick={() => setActivePlanType('3week')}
            className={`py-3 px-5 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activePlanType === '3week' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            <CalendarDays size={16}/> 3-Week Look-Ahead
         </button>
      </div>

      {/* Filters/Actions Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 justify-between items-center">
         <p className="text-sm text-gray-600 font-medium tracking-tight">
             แสดงข้อมูล: <span className="font-bold text-brand-700">
                 {activePlanType === 'master' ? 'แผนงานหลัก (Baseline v1.0)' : 
                  activePlanType === 'actual' ? 'ความคืบหน้าจริง (Real-time)' : 
                  activePlanType === 'lock_check' ? 'สถานะล็อคของงานบน Gantt' : 'แผนงาน 3 สัปดาห์ล่วงหน้า'}
             </span>
         </p>
         
         <div className="flex gap-2">
            {activePlanType === 'master' && canEditMaster && (
                <button className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100">แก้ไข Master Plan</button>
            )}
            {activePlanType === '3week' && canEdit3Week && (
                <button className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100">จัดการ 3-Week Plan</button>
            )}
         </div>
      </div>

      {/* Task List Table View */}
      {activePlanType === 'lock_check' ? (
          <div className="space-y-6">
              {/* KPIs for Lock Check */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border text-center p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 font-semibold mb-1">ปลดล็อกแล้ว (พร้อมดำเนินการ)</p>
                      <p className="text-2xl font-black text-emerald-600">{lockCheckTasks.filter(t => !t.gantt_locked).length}</p>
                  </div>
                  <div className="bg-white border text-center p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 font-semibold mb-1">รอชำระเงิน (Locked)</p>
                      <p className="text-2xl font-black text-red-600">{lockCheckTasks.filter(t => t.gantt_locked && ['billed','overdue'].includes(t.invoice_status || '')).length}</p>
                  </div>
                  <div className="bg-white border text-center p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 font-semibold mb-1">รออนุมัติ VO (Locked)</p>
                      <p className="text-2xl font-black text-yellow-600">{lockCheckTasks.filter(t => t.gantt_locked && t.vo_status === 'pending_approval').length}</p>
                  </div>
              </div>

              {lockCheckTasks.some(t => t.invoice_status === 'overdue') && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                      <AlertTriangle className="shrink-0 mt-0.5 text-red-600" />
                      <div>
                          <h4 className="font-bold">แจ้งเตือน: มีงานที่ถูกล็อคเนื่องจากเลยกำหนดชำระเงิน</h4>
                          <p className="text-sm mt-1">กรุณาติดตามการชำระเงินกับลูกค้า เพื่อให้สามารถดำเนินงานต่อได้ตามแผน</p>
                      </div>
                  </div>
              )}

              {/* Group 1: Ready */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex items-center gap-2">
                     <CheckCircle className="text-emerald-600 w-5 h-5"/> 
                     <span className="font-bold text-emerald-800">กลุ่ม 1 — พร้อมดำเนินการ (Unlocked)</span>
                  </div>
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                          <tr><th className="p-3">Task ID</th><th className="p-3">ชื่องาน</th><th className="p-3">วันเริ่ม</th><th className="p-3">ผู้รับผิดชอบ</th><th className="p-3 text-center">% ปัจจุบัน</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {lockCheckTasks.filter(t => !t.gantt_locked).map(t => (
                              <tr key={t.id} className="hover:bg-gray-50">
                                  <td className="p-3"><strong>{t.id}</strong></td>
                                  <td className="p-3">{t.name}</td><td className="p-3">{t.start}</td><td className="p-3">{t.contractor}</td><td className="p-3 text-center">{t.actual_progress}%</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Group 2: Waiting for Payment */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-red-50 p-3 border-b border-red-100 flex items-center gap-2">
                     <Lock className="text-red-600 w-5 h-5"/> 
                     <span className="font-bold text-red-800">กลุ่ม 2 — รอชำระเงิน VO (Locked)</span>
                  </div>
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                          <tr><th className="p-3">Task ID</th><th className="p-3">ชื่องาน</th><th className="p-3">VO No.</th><th className="p-3">Invoice No.</th><th className="p-3">กำหนดชำระ</th><th className="p-3 text-right">ยอดค้าง (THB)</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {lockCheckTasks.filter(t => t.gantt_locked && ['billed','overdue'].includes(t.invoice_status || '')).map(t => (
                              <tr key={t.id} className={`hover:bg-gray-50 ${t.invoice_status === 'overdue' ? 'bg-red-50/50' : ''}`}>
                                  <td className="p-3"><strong>{t.id}</strong></td>
                                  <td className="p-3">{t.name}</td>
                                  <td className="p-3">{t.vo_no}</td>
                                  <td className="p-3">{t.invoice_no}</td>
                                  <td className={`p-3 ${t.invoice_status === 'overdue' ? 'text-red-600 font-bold' : ''}`}>{t.due_date} {t.invoice_status === 'overdue' && '(Overdue)'}</td>
                                  <td className="p-3 text-right font-bold">{t.balance?.toLocaleString()}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Group 3: Waiting for Approval */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-yellow-50 p-3 border-b border-yellow-100 flex items-center gap-2">
                     <Clock className="text-yellow-600 w-5 h-5"/> 
                     <span className="font-bold text-yellow-800">กลุ่ม 3 — รออนุมัติ VO (Locked)</span>
                  </div>
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                          <tr><th className="p-3">Task ID</th><th className="p-3">ชื่องาน</th><th className="p-3">VO No.</th><th className="p-3">ส่งวันที่</th><th className="p-3 text-center">รอมา (วัน)</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {lockCheckTasks.filter(t => t.gantt_locked && t.vo_status === 'pending_approval').map(t => (
                              <tr key={t.id} className="hover:bg-gray-50">
                                  <td className="p-3"><strong>{t.id}</strong></td>
                                  <td className="p-3">{t.name}</td>
                                  <td className="p-3">{t.vo_no}</td>
                                  <td className="p-3">{t.submit_date}</td>
                                  <td className="p-3 text-center font-bold text-yellow-600">{t.pending_days}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      ) : (
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                         <th className="p-4">งาน (Task)</th>
                         <th className="p-4">ผู้รับผิดชอบ</th>
                         <th className="p-4">{activePlanType === 'actual' ? 'เริ่มจริง - เสร็จจริง' : 'ช่วงเวลา'}</th>
                         {activePlanType === 'master' && <th className="p-4">ประเภทเส้นทาง</th>}
                         {activePlanType === 'actual' && <th className="p-4 text-center">แผน (%)</th>}
                         {activePlanType === '3week' && <th className="p-4 text-center">กำลังคน/เครื่องจักร</th>}
                         <th className="p-4">{activePlanType === 'actual' ? 'ผลงานจริง (%)' : activePlanType === '3week' ? 'ข้อจำกัด/เงื่อนไข' : 'ผลการดำเนินงาน'}</th>
                         <th className="p-4 text-center">อัปเดต</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {activePlanType === '3week' ? (
                       visible3WeekTasks.map((task) => (
                         <tr key={task.id} className="hover:bg-gray-50/50 transition duration-150">
                             <td className="p-4">
                                 <p className="font-bold text-gray-900 text-sm">{task.name}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">ID: {task.id} | Zone: {task.zone}</p>
                             </td>
                             <td className="p-4 text-sm text-gray-600 font-medium">
                                 {task.contractor}
                             </td>
                             <td className="p-4 text-sm text-gray-600">
                                 <p className="font-mono text-xs">{task.start} ถีง {task.end}</p>
                                 <p className="text-[10px] text-gray-400">{task.duration} วัน</p>
                             </td>
                             <td className="p-4 text-center">
                                 <div className="text-[10px] flex flex-col gap-1 items-center">
                                     <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">F:{task.crew_required.foreman} S:{task.crew_required.skilled_worker} G:{task.crew_required.general_worker}</span>
                                     <span className="text-gray-500 truncate max-w-[120px]" title={task.equipment.join(', ')}>{task.equipment.length} เครื่องจักร</span>
                                 </div>
                             </td>
                             <td className="p-4">
                                 <span className="text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded inline-block max-w-[200px] truncate" title={task.constraints}>
                                     {task.constraints}
                                 </span>
                             </td>
                             <td className="p-4 text-center">
                                 {canSubmitProgress ? (
                                     <button onClick={() => toast.success('เปิดฟอร์มอัปเดตสถานะ')} className="px-3 py-1.5 bg-white border border-gray-200 text-brand-600 rounded-lg text-xs font-bold shadow-sm hover:border-brand-300 hover:bg-brand-50 transition">
                                         จัดการ
                                     </button>
                                 ) : (
                                     <button className="p-1.5 text-gray-400 hover:text-gray-600"><Eye size={18}/></button>
                                 )}
                             </td>
                         </tr>
                       ))
                     ) : (
                       visibleTasks.map((task) => (
                         <tr key={task.id} className="hover:bg-gray-50/50 transition duration-150">
                             <td className="p-4">
                                 <p className="font-bold text-gray-900 text-sm">{task.name}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">ID: {task.id}</p>
                             </td>
                             <td className="p-4 text-sm text-gray-600 font-medium">
                                 {task.contractor}
                             </td>
                             <td className="p-4 text-sm text-gray-600">
                                 {activePlanType === 'actual' ? (
                                     <>
                                        <p className="font-mono text-xs">{task.actual_start || '-'} ถีง {task.actual_finish || '-'}</p>
                                     </>
                                 ) : (
                                     <>
                                        <p className="font-mono text-xs">{task.start} ถีง {task.end}</p>
                                        <p className="text-[10px] text-gray-400">{task.duration} วัน</p>
                                     </>
                                 )}
                             </td>
                             {activePlanType === 'master' && (
                               <td className="p-4">
                                   {task.is_critical ? (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">Critical Path</span>
                                   ) : (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">Standard</span>
                                   )}
                               </td>
                             )}
                             {activePlanType === 'actual' && (
                               <td className="p-4 text-center font-bold text-gray-700">
                                   {task.expected_progress}%
                               </td>
                             )}
                             <td className="p-4">
                                 <div className="flex items-center gap-2 mb-1">
                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${task.actual_progress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold">{task.actual_progress}%</span>
                                 </div>
                                 {(activePlanType === 'actual' || task.actual_progress > 0) && getVarianceBadge(task.actual_progress - task.expected_progress)}
                                 {activePlanType === 'actual' && task.remarks && (
                                     <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] truncate" title={task.remarks}>หมายเหตุ: {task.remarks}</p>
                                 )}
                             </td>
                             <td className="p-4 text-center">
                                 {canSubmitProgress ? (
                                     <button onClick={() => toast.success('เปิดฟอร์มอัปเดต % ความคืบหน้า')} className="px-3 py-1.5 bg-white border border-gray-200 text-brand-600 rounded-lg text-xs font-bold shadow-sm hover:border-brand-300 hover:bg-brand-50 transition">
                                         อัปเดต %
                                     </button>
                                 ) : (
                                     <button className="p-1.5 text-gray-400 hover:text-gray-600"><Eye size={18}/></button>
                                 )}
                             </td>
                         </tr>
                       ))
                     )}
                     {((activePlanType !== '3week' && visibleTasks.length === 0) || (activePlanType === '3week' && visible3WeekTasks.length === 0)) && (
                         <tr>
                             <td colSpan={7} className="p-8 text-center text-gray-400 text-sm font-medium">
                                 ไม่มีรายการแผนงานที่คุณสามารถเข้าถึงได้
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>
      )}
      
    </div>
  );
};

