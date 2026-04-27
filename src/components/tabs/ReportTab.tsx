import React, { useState } from 'react';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle, AlertCircle, Clock, CheckSquare, Printer, LayoutDashboard, FileText, Download, ShieldAlert, Info } from 'lucide-react';

export const ReportTab = ({ project, user }: { project: Project, user: any }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'weekly_report'>('dashboard');
  const [annotation, setAnnotation] = useState('');

  const isOwner = user?.role === 'owner' || user?.role === 'admin';
  const isPM = user?.role === 'pm' || user?.role === 'admin';
  const isEngineer = user?.role === 'engineer' || user?.role === 'architect' || user?.role === 'qs';
  
  // Data from Master Plan
  const allTasks = [
    { id: 'WC01', name: 'งานเตรียมพื้นที่และงานดิน', start: '2025-07-01', end: '2025-07-14', actual_start: '2025-07-01', actual_finish: '2025-07-13', duration: 14, planned_pct: 100, actual_pct: 100, is_critical: true, contractor: 'ผู้รับเหมาหลัก', remarks: 'เสร็จก่อนกำหนด 1 วัน', status_flag: 'completed' },
    { id: 'WC02', name: 'งานฐานราก', start: '2025-07-15', end: '2025-08-10', actual_start: '2025-07-14', actual_finish: null, duration: 27, planned_pct: 80, actual_pct: 60, is_critical: true, contractor: 'ผู้รับเหมาหลัก', remarks: 'ขยายเวลาเนื่องจากดินสภาพไม่ดี ต้องเสริม', status_flag: 'critical' },
    { id: 'WC03', name: 'งานโครงสร้างชั้น 1', start: '2025-08-11', end: '2025-09-07', actual_start: null, actual_finish: null, duration: 28, planned_pct: 0, actual_pct: 0, is_critical: true, contractor: 'ผู้รับเหมาหลัก', remarks: '', status_flag: 'not_started' },
    { id: 'WC04', name: 'งานโครงสร้างชั้น 2', start: '2025-09-08', end: '2025-10-05', actual_start: null, actual_finish: null, duration: 28, planned_pct: 0, actual_pct: 0, is_critical: true, contractor: 'ผู้รับเหมาหลัก', remarks: '', status_flag: 'not_started' },
    { id: 'WC06', name: 'งานผนัง ฉาบปูน กระเบื้อง', start: '2025-09-08', end: '2025-10-22', actual_start: null, actual_finish: null, duration: 45, planned_pct: 0, actual_pct: 0, is_critical: false, contractor: 'ผู้รับเหมาหลัก', remarks: '', status_flag: 'not_started' },
  ];

  // Calculate variances
  const tasksWithVariance = allTasks.map(t => ({
      ...t,
      variance: t.actual_pct - t.planned_pct,
      status: t.actual_pct === 100 ? 'เสร็จสมบูรณ์' : 
              (t.actual_pct === 0 && t.planned_pct === 0) ? 'ยังไม่เริ่ม' :
              (t.actual_pct < t.planned_pct) ? 'ล่าช้า' : 'กำลังดำเนินการ'
  }));

  const totalPlanned = Math.round(tasksWithVariance.reduce((a, b) => a + b.planned_pct, 0) / tasksWithVariance.length);
  const totalActual = Math.round(tasksWithVariance.reduce((a, b) => a + b.actual_pct, 0) / tasksWithVariance.length);
  const overallVariance = totalActual - totalPlanned;
  
  const delayedTasks = tasksWithVariance.filter(t => t.variance < 0);
  const criticalDelayed = delayedTasks.filter(t => t.variance <= -15).length;
  const warningDelayed = delayedTasks.filter(t => t.variance > -15 && t.variance <= -5).length;

  const handlePrint = () => {
      const reportDate = new Date().toLocaleDateString('th-TH');
      const preparedBy = user?.name || "วิศวกรควบคุมงาน";
      
      const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Report - ${project.name}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
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
        .page-break {
            page-break-after: always;
        }
        table {
            page-break-inside: auto;
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 8.5px;
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
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
            vertical-align: middle;
        }
        th {
            background-color: #f1f5f9;
            font-weight: bold;
            color: #475569;
            text-transform: uppercase;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 { margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase; }
        .header p { margin: 5px 0 0 0; font-size: 10px; color: #666; }

        .card-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 20px;
            border-spacing: 10px;
        }
        .card {
            display: table-cell;
            border: 1px solid #e2e8f0;
            background: #fff;
            padding: 10px;
            vertical-align: top;
            border-radius: 4px;
        }
        .card-title { font-size: 8px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
        .card-value { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0; line-height: 1; }
        .card-subtext { font-size: 9px; color: #64748b; margin-top: 4px; }
        .text-red { color: #dc2626 !important; }
        .text-green { color: #16a34a !important; }
        .text-yellow { color: #d97706 !important; }
        
        .section-title { font-size: 12px; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; margin-top: 20px; text-transform: uppercase; }

        .alert-box {
            border: 1px solid #e2e8f0;
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
        }
        .alert-box.critical { background: #fef2f2; border-color: #fecaca; }
        .alert-box.warning { background: #fffbeb; border-color: #fde68a; }
        .alert-box.info { background: #f0fdf4; border-color: #bbf7d0; }
        .alert-title { font-size: 9px; font-weight: bold; margin-bottom: 2px; }
        .critical .alert-title { color: #991b1b; }
        .warning .alert-title { color: #92400e; }
        .info .alert-title { color: #166534; }
        
        .badge {
            display: inline-block;
            padding: 2px 4px;
            font-size: 7px;
            font-weight: bold;
            border-radius: 2px;
            border: 1px solid #cbd5e1;
            text-transform: uppercase;
        }
        .badge-success { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .badge-danger { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .badge-warning { background: #fff8eb; color: #d97706; border-color: #fde68a; }
        
        .s-curve {
            width: 100%;
            height: 180px;
            border: 1px solid #e2e8f0;
            margin-bottom: 20px;
            position: relative;
        }

        .gantt-table th { font-size: 8px; padding: 2px; text-align: center; }
        .gantt-table td { font-size: 8px; padding: 2px; height: 16px; }
        .gantt-bar { height: 10px; width: 100%; background: #333; display: block; }
        .gantt-bar-empty { border: 1px solid #cbd5e1; background: transparent; height: 8px; }

        .signature-block {
            margin-top: 40px;
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        .signature-block th, .signature-block td {
            border: 1px solid #333;
            width: 50%;
            padding: 5px;
            text-align: center;
            font-size: 10px;
        }
        .signature-block th { background: #f5f5f5; }
        .signature-space { height: 60px; }
    </style>
</head>
<body>
    <!-- PAGE 1: KPI + S-Curve + Alerts -->
    <div class="header">
        <h1>Dashboard Report</h1>
        <p>Project: ${project.name || 'โครงการก่อสร้าง'}</p>
        <p>วันที่รายงาน: ${reportDate} | สัปดาห์ที่: 12</p>
    </div>

    <div class="card-grid">
        <div class="card">
            <div class="card-title">1. ความคืบหน้ารวม</div>
            <p class="card-value">${totalActual}% <span style="font-size: 8px; font-weight: normal; color: #666;">vs ${totalPlanned}% (Plan)</span></p>
            <p class="card-subtext ${overallVariance < 0 ? 'text-red' : 'text-green'}">Variance ${overallVariance > 0 ? '+' : ''}${overallVariance}%</p>
        </div>
        <div class="card">
            <div class="card-title">2. สถานะงาน</div>
            <p class="card-value text-green">${tasksWithVariance.filter(t=>t.actual_pct===100).length} <span style="font-size: 8px; font-weight: normal; color: #666;">เสร็จสมบูรณ์</span></p>
            <p class="card-subtext">ที่เหลือ: ${tasksWithVariance.filter(t=>t.actual_pct>0 && t.actual_pct<100).length} ทำอยู่ / ${tasksWithVariance.filter(t=>t.actual_pct===0).length} ยังไม่เริ่ม</p>
        </div>
        <div class="card">
            <div class="card-title">3. งานล่าช้า</div>
            <p class="card-value ${delayedTasks.length > 0 ? 'text-red' : ''}">${delayedTasks.length} รายการ</p>
            <p class="card-subtext">Critical: ${criticalDelayed} | Warning: ${warningDelayed}</p>
        </div>
        <div class="card">
            <div class="card-title">4. คาดการณ์แล้วเสร็จ</div>
            <p class="card-value">15 มิ.ย. 2026</p>
            <p class="card-subtext">อิงจาก SPI 0.85 ปัจจุบัน</p>
        </div>
    </div>

    <div class="section-title">S-Curve Progress</div>
    <div class="s-curve">
        <svg width="100%" height="180" viewBox="0 0 800 180" preserveAspectRatio="none">
             <line x1="0" y1="150" x2="800" y2="150" stroke="#f1f5f9" stroke-width="2" />
             <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" stroke-width="1" />
             <line x1="0" y1="50"  x2="800" y2="50"  stroke="#f1f5f9" stroke-width="1" />
             
             <text x="100" y="170" font-size="12" fill="#94a3b8" text-anchor="middle">W4</text>
             <text x="300" y="170" font-size="12" fill="#94a3b8" text-anchor="middle">W8</text>
             <text x="500" y="170" font-size="12" fill="#94a3b8" text-anchor="middle">W12</text>
             <text x="700" y="170" font-size="12" fill="#94a3b8" text-anchor="middle">W16</text>
             
             <!-- Planned Line -->
             <path d="M 0 150 Q 200 130, 400 80 T 800 20" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="8,8" />
             <!-- Actual Line -->
             <path d="M 0 150 Q 150 140, 300 100" fill="none" stroke="#1e293b" stroke-width="3" />
             <!-- Today Line -->
             <line x1="300" y1="20" x2="300" y2="150" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4" />
             
             <!-- Labels -->
             <circle cx="300" cy="100" r="4" fill="#0f172a" />
             <text x="315" y="105" font-size="12" fill="#0f172a" font-weight="bold">${totalActual}% Actual</text>
             
             <circle cx="800" cy="20" r="4" fill="#64748b" />
             <text x="760" y="15" font-size="12" fill="#64748b" font-weight="bold">100% Plan</text>
        </svg>
    </div>

    <div class="section-title">Alert Summary</div>
    <div class="alert-box critical">
        <div class="alert-title">CRITICAL: งานที่ล่าช้า &gt; 15%</div>
        <p style="margin: 2px 0;">WC02 ล่าช้ากว่าแผน 20% (SV&lt;-15%) ต้องส่งรายงานแจ้ง Owner และขอทบทวนแผนงานด่วน</p>
    </div>
    <div class="alert-box warning">
        <div class="alert-title">WARNING: งานที่ล่าช้า &gt; 5%</div>
        <p style="margin: 2px 0;">คาดการณ์งานโครงสร้างชั้น 1 (WC03) อาจเริ่มล่าช้าเนื่องจากผลกระทบจาก WC02</p>
    </div>
    <div class="alert-box info">
        <div class="alert-title">INFO: การดำเนินงานสัปดาห์นี้</div>
        <p style="margin: 2px 0;">นัดหมายตรวจ Inspection งานฐานราก วันศุกร์นี้ 10:00 น.</p>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 2: Task Status Table -->
    <div class="header">
        <h1>Task Status Summary</h1>
        <p>Project: ${project.name || 'โครงการก่อสร้าง'} | วันที่รายงาน: ${reportDate}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 30%;">Task Name</th>
                <th style="width: 15%;">Resp</th>
                <th style="width: 8%; text-align: center;">Plan</th>
                <th style="width: 8%; text-align: center;">Actual</th>
                <th style="width: 8%; text-align: center;">SV</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 11%;">Remarks</th>
            </tr>
        </thead>
        <tbody>
            ${tasksWithVariance.map(t => {
                let badgeClass = "badge ";
                if (t.status === 'เสร็จสมบูรณ์') badgeClass += "badge-success";
                else if (t.status === 'ล่าช้า') badgeClass += "badge-danger";
                else if (t.status === 'กำลังดำเนินการ') badgeClass += "badge-warning";
                else badgeClass += "";
                
                return `
                <tr>
                    <td style="font-weight: bold;">${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.contractor.split(' ')[0]}</td>
                    <td style="text-align: center;">${t.planned_pct}%</td>
                    <td style="text-align: center; font-weight: bold;">${t.actual_pct}%</td>
                    <td style="text-align: center; font-weight: bold;" class="${t.variance < 0 ? 'text-red' : 'text-green'}">${t.variance > 0 ? '+' : ''}${t.variance}%</td>
                    <td><span class="${badgeClass}">${t.status}</span></td>
                    <td style="font-size: 7px;">${t.remarks}</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    </table>

    <div class="page-break"></div>

    <!-- PAGE 3: 3-Week Gantt + Signature -->
    <div class="header">
        <h1>3-Week Mini Gantt</h1>
        <p>Project: ${project.name || 'โครงการก่อสร้าง'} | วันที่รายงาน: ${reportDate}</p>
    </div>

    <table class="gantt-table">
        <thead>
            <tr>
                <th style="width: 40%;">Task Name</th>
                ${Array.from({length: 3}).map((_, i) => `<th style="width: 20%;">Week ${i+1}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="font-weight: bold;">WC01 เตรียมพื้นที่</td>
                <td><div class="gantt-bar"></div></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td style="font-weight: bold;">WC02 งานฐานราก</td>
                <td><div class="gantt-bar-empty"></div></td>
                <td><div class="gantt-bar text-yellow" style="width: 70%;"></div></td>
                <td></td>
            </tr>
            <tr>
                <td style="font-weight: bold;">WC03 โครงสร้างชั้น 1</td>
                <td></td>
                <td><div class="gantt-bar-empty" style="width: 30%; margin-left: 70%;"></div></td>
                <td><div class="gantt-bar-empty"></div></td>
            </tr>
        </tbody>
    </table>

    <table class="signature-block">
        <thead>
            <tr>
                <th>จัดทำโดย (Prepared By)</th>
                <th>ตรวจสอบและอนุมัติโดย (Approved By)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="signature-space">
                   <div style="margin-top: 40px;">
                      ( ${preparedBy} )<br/>
                      วิศวกรควบคุมงาน<br/>
                      วันที่: ____________
                   </div>
                </td>
                <td class="signature-space">
                   <div style="margin-top: 40px;">
                      ( ___________________________ )<br/>
                      ผู้จัดการโครงการ<br/>
                      วันที่: ____________
                   </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
        เอกสารนี้จัดทำโดยระบบ Construction Management | พิมพ์วันที่ ${reportDate}
    </div>
</body>
</html>`;

      try {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
              printWindow.document.write(html);
              printWindow.document.close();
              toast.success("สร้าง HTML สำหรับ Export เป็น PDF สำเร็จ");
          }
      } catch(e) {
          console.warn('Could not open print window automatically', e);
          toast.error("ไม่สามารถเปิดหน้าต่างพิมพ์ได้ (Pop-up blocked)");
      }
  };

  const getRowClass = (sv: number, status: string) => {
      if (status === 'เสร็จสมบูรณ์') return 'bg-emerald-50 text-emerald-900 border-emerald-100';
      if (sv <= -15) return 'bg-red-50 text-red-900 border-red-100';
      if (sv < -5) return 'bg-amber-50 text-amber-900 border-amber-100';
      return 'bg-white text-gray-900 border-gray-100';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 print:p-0 print:m-0 print:bg-white print:pb-0">
      
      {/* Header controls (hidden in print) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[24px] rounded-tl-sm shadow-sm border border-gray-100 gap-4 print:hidden">
          <div>
              <h2 className="text-xl font-bold text-gray-900">Project Reports & Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">สรุปความคืบหน้าและรายงานโครงการ</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                  onClick={() => setActiveView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'dashboard' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                  <LayoutDashboard size={16} /> ภาพรวม (Dashboard)
              </button>
              <button 
                  onClick={() => setActiveView('weekly_report')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'weekly_report' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                  <FileText size={16} /> รายงานสัปดาห์ (Weekly Report)
              </button>
              <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200 ml-2"
              >
                  <Printer size={16} /> พิมพ์ / PDF
              </button>
          </div>
      </div>

      {activeView === 'dashboard' && (
          <div className="space-y-6 print:block">
              <div className="hidden print:block text-center mb-8">
                  <h1 className="text-2xl font-black text-gray-900 uppercase">Dashboard สรุปภาพรวมโครงการ</h1>
                  <p className="text-sm text-gray-600 mt-2">วันที่รายงาน: {new Date().toLocaleDateString('th-TH')} | จัดทำโดย: {user?.name || 'วิศวกรควบคุมงาน'}</p>
                 <div className="w-full h-px bg-gray-300 mt-4"></div>
              </div>

              {/* [SECTION A — KPI CARDS] */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">1. ความคืบหน้ารวม</span>
                     <div className="flex items-end gap-2">
                         <span className="text-3xl font-black text-gray-900">{totalActual}%</span>
                         <span className="text-sm font-bold text-gray-500 mb-1">vs {totalPlanned}% (Plan)</span>
                     </div>
                     <span className={`text-sm font-bold mt-2 flex items-center gap-1 ${overallVariance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                         Variance {overallVariance > 0 ? '+' : ''}{overallVariance}%
                     </span>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. สถานะงาน (Tasks)</span>
                     <div className="flex justify-between items-end mt-1">
                         <div className="text-center"><p className="text-xl font-black text-emerald-600">{tasksWithVariance.filter(t=>t.actual_pct===100).length}</p><span className="text-[10px] uppercase font-bold text-gray-500">เสร็จ</span></div>
                         <div className="text-center"><p className="text-xl font-black text-blue-600">{tasksWithVariance.filter(t=>t.actual_pct>0 && t.actual_pct<100).length}</p><span className="text-[10px] uppercase font-bold text-gray-500">กำลังทำ</span></div>
                         <div className="text-center"><p className="text-xl font-black text-amber-500">{delayedTasks.length}</p><span className="text-[10px] uppercase font-bold text-gray-500">ล่าช้า</span></div>
                         <div className="text-center"><p className="text-xl font-black text-gray-400">{tasksWithVariance.filter(t=>t.actual_pct===0).length}</p><span className="text-[10px] uppercase font-bold text-gray-500">ยังไม่เริ่ม</span></div>
                     </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">3. งานล่าช้า ({delayedTasks.length} รายการ)</span>
                     <div className="flex items-center gap-4 mt-1">
                         <div className="flex items-center gap-2">
                             <ShieldAlert className="text-red-500" size={20} />
                             <div>
                                 <p className="text-xl font-black text-red-600">{criticalDelayed}</p>
                                 <p className="text-[10px] uppercase font-bold text-gray-500">Critical</p>
                             </div>
                         </div>
                         <div className="h-8 w-px bg-gray-200"></div>
                         <div className="flex items-center gap-2">
                             <AlertTriangle className="text-amber-500" size={20} />
                             <div>
                                 <p className="text-xl font-black text-amber-600">{warningDelayed}</p>
                                 <p className="text-[10px] uppercase font-bold text-gray-500">Warning</p>
                             </div>
                         </div>
                     </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">4. คาดการณ์วันแล้วเสร็จ (ECD)</span>
                     <p className="text-2xl font-black text-brand-700">15 มิ.ย. 2026</p>
                     <p className="text-xs text-brand-600/80 font-medium mt-2">Drawn from current SPI: 0.85 (ล่าช้ากว่าแผน ~45 วัน)</p>
                  </div>
              </div>

              {/* [SECTION B — S-CURVE & SECTION E — ALERTS & FLAGS] */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">S-Curve Progress</h3>
                     <div className="w-full relative h-[220px]">
                        <svg width="100%" height="220" viewBox="0 0 800 220" preserveAspectRatio="none">
                           {/* BG Grid */}
                           <line x1="0" y1="200" x2="800" y2="200" stroke="#f1f5f9" strokeWidth="2" />
                           <line x1="0" y1="150" x2="800" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                           <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                           <line x1="0" y1="50"  x2="800" y2="50"  stroke="#f1f5f9" strokeWidth="1" />
                           {/* X Axis Weeks */}
                           <text x="100" y="215" fontSize="12" fill="#94a3b8" textAnchor="middle">W4</text>
                           <text x="300" y="215" fontSize="12" fill="#94a3b8" textAnchor="middle">W8</text>
                           <text x="500" y="215" fontSize="12" fill="#94a3b8" textAnchor="middle">W12</text>
                           <text x="700" y="215" fontSize="12" fill="#94a3b8" textAnchor="middle">W16</text>
                           
                           {/* Planned Line (Blue Dashed #1565C0) */}
                           <path d="M 0 200 Q 200 180, 400 100 T 800 20" fill="none" stroke="#1565C0" strokeWidth="3" strokeDasharray="8,8" />
                           
                           {/* Actual Line (Green Solid #2E7D32) */}
                           <path d="M 0 200 Q 150 190, 300 140" fill="none" stroke={overallVariance < 0 ? '#dc2626' : '#2E7D32'} strokeWidth="4" />
                           
                           {/* Today Line (Red Dashed) */}
                           <line x1="300" y1="20" x2="300" y2="200" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                           <rect x="270" y="5" width="60" height="20" rx="4" fill="#ef4444" />
                           <text x="300" y="19" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">TODAY</text>
                           
                           {/* Labels */}
                           <circle cx="300" cy="140" r="5" fill={overallVariance < 0 ? '#dc2626' : '#2E7D32'} />
                           <text x="315" y="145" fontSize="14" fill={overallVariance < 0 ? '#dc2626' : '#2E7D32'} fontWeight="bold">{totalActual}% Actual</text>
                           
                           <circle cx="800" cy="20" r="5" fill="#1565C0" />
                           <text x="760" y="15" fontSize="14" fill="#1565C0" fontWeight="bold">100% Plan</text>
                        </svg>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Alerts & Flags</h3>
                     <div className="space-y-3">
                         <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex gap-3 items-start">
                             <ShieldAlert className="text-red-600 mt-0.5 shrink-0" size={18} />
                             <div>
                                 <p className="text-xs font-black text-red-800 uppercase tracking-wider">Critical Action</p>
                                 <p className="text-sm font-medium text-red-900 mt-1">WC02 ล่าช้ากว่าแผน 20% (SV&lt;-15%) ต้องส่งรายงานแจ้ง Owner และขอทบทวนแผนงาน</p>
                             </div>
                         </div>
                         <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 items-start">
                             <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
                             <div>
                                 <p className="text-xs font-black text-amber-800 uppercase tracking-wider">Warning</p>
                                 <p className="text-sm font-medium text-amber-900 mt-1">คาดการณ์งานโครงสร้างชั้น 1 (WC03) อาจเริ่มล่าช้าเนื่องจากผลกระทบจาก WC02</p>
                             </div>
                         </div>
                         <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-3 items-start">
                             <Info className="text-blue-600 mt-0.5 shrink-0" size={18} />
                             <div>
                                 <p className="text-xs font-black text-blue-800 uppercase tracking-wider">Information</p>
                                 <p className="text-sm font-medium text-blue-900 mt-1">นัดหมายตรวจ Inspection งานฐานราก วันศุกร์นี้ 10:00 น.</p>
                             </div>
                         </div>
                     </div>
                  </div>
              </div>

              {/* [SECTION C — TASK STATUS TABLE] */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 break-inside-avoid">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Task Status Overview</h3>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse text-sm">
                         <thead>
                             <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs">รหัส</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs">ชื่องาน</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs">ผู้รับผิดชอบ</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">แผน %</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">จริง %</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">SV %</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs">สถานะ</th>
                                 <th className="p-3 font-bold uppercase tracking-wider text-xs">หมายเหตุ</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                             {tasksWithVariance.map(t => (
                                 <tr key={t.id} className={getRowClass(t.variance, t.status)}>
                                     <td className="p-3 font-mono text-xs font-bold">{t.id}</td>
                                     <td className="p-3 font-medium">{t.name}</td>
                                     <td className="p-3 text-xs">{t.contractor}</td>
                                     <td className="p-3 text-center">{t.planned_pct}%</td>
                                     <td className="p-3 text-center font-bold">{t.actual_pct}%</td>
                                     <td className={`p-3 text-center font-bold ${t.variance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                         {t.variance > 0 ? '+' : ''}{t.variance}%
                                     </td>
                                     <td className="p-3">
                                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border bg-white
                                            ${t.status === 'เสร็จสมบูรณ์' ? 'text-emerald-700 border-emerald-200' : 
                                              t.status === 'ล่าช้า' ? 'text-red-700 border-red-200' : 
                                              t.status === 'กำลังดำเนินการ' ? 'text-blue-700 border-blue-200' : 'text-gray-500 border-gray-200'}`}>
                                             {t.status}
                                         </span>
                                     </td>
                                     <td className="p-3 text-xs opacity-80">{t.remarks}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
              </div>

              {/* [SECTION D — 3-WEEK MINI GANTT] */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 break-inside-avoid">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">3-Week Mini Gantt (Look Ahead)</h3>
                 <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-x-auto">
                     {/* Simplified visual representation for the dashboard */}
                     <div className="min-w-[700px]">
                         <div className="flex border-b border-gray-200 pb-2 mb-3">
                             <div className="w-[200px] text-xs font-bold text-gray-500 uppercase tracking-wider">Task</div>
                             <div className="flex-1 flex justify-between px-2">
                                 <span className="text-xs font-bold text-gray-400">Week 1</span>
                                 <span className="text-xs font-bold text-brand-600">Week 2 (Current)</span>
                                 <span className="text-xs font-bold text-gray-400">Week 3</span>
                             </div>
                         </div>
                         
                         <div className="space-y-3 relative">
                             <div className="absolute left-[200px] bottom-0 top-0 w-px bg-gray-200"></div>
                             <div className="absolute left-[400px] bottom-0 top-0 w-px bg-red-400 border-l border-dashed border-red-500 z-0"></div>
                             <div className="absolute left-[600px] bottom-0 top-0 w-px bg-gray-200"></div>

                             <div className="flex items-center relative z-10">
                                 <div className="w-[200px] pr-4"><p className="text-xs font-bold truncate">WC01 เตรียมพื้นที่</p></div>
                                 <div className="flex-1 relative h-6">
                                     <div className="absolute left-0 w-[30%] h-full bg-emerald-500 rounded-md border border-emerald-600 flex items-center px-2">
                                         <span className="text-[9px] text-white font-bold">100% เสร็จแล้ว</span>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="flex items-center relative z-10">
                                 <div className="w-[200px] pr-4"><p className="text-xs font-bold truncate text-red-700">WC02 งานฐานราก</p></div>
                                 <div className="flex-1 relative h-6">
                                     {/* Planned */}
                                     <div className="absolute left-[25%] w-[45%] h-full bg-blue-100 rounded-md border border-blue-300"></div>
                                     {/* Actual */}
                                     <div className="absolute left-[25%] w-[35%] h-4 top-1 bg-amber-500 rounded-sm border border-amber-600 flex items-center px-2 shadow-sm">
                                         <span className="text-[9px] text-white font-bold">Delay -20%</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="flex items-center relative z-10">
                                 <div className="w-[200px] pr-4"><p className="text-xs text-gray-500 truncate">WC03 โครงสร้างชั้น 1</p></div>
                                 <div className="flex-1 relative h-6">
                                     <div className="absolute left-[65%] w-[40%] h-full bg-blue-100 rounded-md border border-blue-300 opacity-50"></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
              </div>
          </div>
      )}

      {activeView === 'weekly_report' && (
          <div className="bg-white print:bg-white w-full max-w-[210mm] mx-auto print:mx-0 shadow-lg border border-gray-200 print:shadow-none print:border-none">
              {/* PAGE 1: Executive Summary */}
              <div className="p-10 min-h-[297mm] break-after-page">
                  <div className="text-center mb-10 border-b border-gray-800 pb-6">
                      <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Weekly Progress Report</h1>
                      <h2 className="text-lg font-medium text-gray-600 mt-2">รายงานความก้าวหน้าโครงการประจำสัปดาห์</h2>
                      <div className="mt-4 flex justify-between text-sm font-bold text-gray-800">
                          <span>Project: {project.name || 'บ้าน 3 ชั้น — รัชดาภิเษก'}</span>
                          <span>Week: 12 | Date: {new Date().toLocaleDateString('th-TH')}</span>
                      </div>
                  </div>

                  <div className="mb-10">
                      <h3 className="text-lg font-black bg-gray-100 p-2 uppercase tracking-widest border-l-4 border-brand-600 text-gray-900 mb-4">1. Executive Summary</h3>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                              <p className="font-bold text-gray-500 uppercase text-xs mb-1">Overall Status</p>
                              {criticalDelayed > 0 ? (
                                  <p className="font-black text-red-600 text-lg">AT RISK (ล่าช้าต้องเร่งรัด)</p>
                              ) : warningDelayed > 0 ? (
                                  <p className="font-black text-amber-600 text-lg">DELAYED (ล่าช้าเล็กน้อย)</p>
                              ) : (
                                  <p className="font-black text-emerald-600 text-lg">ON TRACK (ตามแผน)</p>
                              )}
                          </div>
                          <div>
                              <p className="font-bold text-gray-500 uppercase text-xs mb-1">Progress Overview</p>
                              <p className="font-medium">Planned: <span className="font-bold">{totalPlanned}%</span> | Actual: <span className="font-bold">{totalActual}%</span></p>
                              <p className="text-red-600 text-xs font-bold mt-1">Variance: {overallVariance}%</p>
                          </div>
                      </div>
                  </div>

                  <div className="mb-10 space-y-6">
                      <div>
                          <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">1.1 Work Completed This Week</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                              <li>งานเตรียมพื้นที่และงานดิน (WC01) แล้วเสร็จ 100% (เร็วกว่าแผน 1 วัน)</li>
                              <li>เตรียมการสำรวจเข็มและ Test Pile เสร็จสิ้น</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">1.2 Work Planned For Next Week</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                              <li>เร่งรัดงานฐานราก (WC02) ให้ได้ 80% ภายในวันศุกร์</li>
                              <li>สกัดหัวเข็มและเตรียมเหล็กเสริมโครงสร้าง</li>
                              <li>เริ่มตรวจประเมินหน้างานสำหรับการวางผังระดับพื้นชั้น 1</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1 text-red-700">1.3 Issues & Mitigations (ปัญหาและการแก้ไข)</h4>
                          <ul className="list-disc pl-5 text-sm space-y-2 text-gray-800">
                              <li>
                                  <span className="font-bold">ปัญหา:</span> ฝนตกหนักต่อเนื่อง 3 วัน ทำให้ดินสภาพไม่ดี มีน้ำขังในหลุมฐานราก (ส่งผลให้ WC02 ล่าช้า)
                                  <br/><span className="font-bold text-brand-700">การแก้ไข:</span> ติดตั้งปั๊มน้ำเพิ่ม 2 ตัว ดำเนินการสูบน้ำ และนำทรายมาเสริมปรับระดับ พร้อมทั้งเพิ่มแรงงาน 5 คนในสัปดาห์หน้าเพื่อเร่งงาน
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>

              {/* PAGE 2: Gantt & S-Curve */}
              <div className="p-10 min-h-[297mm] break-after-page">
                  <h3 className="text-lg font-black bg-gray-100 p-2 uppercase tracking-widest border-l-4 border-brand-600 text-gray-900 mb-6">2. Gantt Summary & S-Curve</h3>
                  
                  <div className="mb-10">
                      <h4 className="font-bold text-gray-900 mb-4 pb-1 border-b border-gray-200">S-Curve Progress Comparison</h4>
                      <div className="w-full relative h-[250px] border border-gray-200 rounded p-4 bg-gray-50">
                          {/* Re-use S-Curve SVG from dashboard */}
                          <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                               <line x1="0" y1="180" x2="800" y2="180" stroke="#cbd5e1" strokeWidth="2" />
                               <path d="M 0 180 Q 200 160, 400 80 T 800 20" fill="none" stroke="#1565C0" strokeWidth="3" strokeDasharray="8,8" />
                               <path d="M 0 180 Q 150 170, 300 120" fill="none" stroke={overallVariance < 0 ? '#dc2626' : '#2E7D32'} strokeWidth="4" />
                               <line x1="300" y1="20" x2="300" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                               
                               <text x="320" y="125" fontSize="14" fill={overallVariance < 0 ? '#dc2626' : '#2E7D32'} fontWeight="bold">{totalActual}% Actual</text>
                               <text x="760" y="15" fontSize="14" fill="#1565C0" fontWeight="bold">100% Plan</text>
                          </svg>
                      </div>
                  </div>

                  <div className="mb-10">
                      <h4 className="font-bold text-gray-900 mb-4 pb-1 border-b border-gray-200">Schedule Details</h4>
                      <table className="w-full text-left border-collapse text-xs">
                          <thead>
                               <tr className="bg-gray-100 border-b-2 border-gray-400">
                                   <th className="p-2 font-bold uppercase">Task Group</th>
                                   <th className="p-2 font-bold uppercase">Plan Start</th>
                                   <th className="p-2 font-bold uppercase">Plan End</th>
                                   <th className="p-2 font-bold uppercase text-center">% Plan</th>
                                   <th className="p-2 font-bold uppercase text-center">% Act</th>
                               </tr>
                          </thead>
                          <tbody>
                               <tr className="border-b border-gray-200">
                                   <td className="p-2 font-bold">1. งานเตรียมพื้นที่และโครงสร้างใต้ดิน</td><td className="p-2">01/07/2025</td><td className="p-2">10/08/2025</td><td className="p-2 text-center text-gray-500">90%</td><td className="p-2 text-center font-bold text-red-600">80%</td>
                               </tr>
                               <tr className="border-b border-gray-200">
                                   <td className="p-2 font-bold">2. งานโครงสร้างเหนือพื้นดิน</td><td className="p-2">11/08/2025</td><td className="p-2">09/11/2025</td><td className="p-2 text-center text-gray-500">0%</td><td className="p-2 text-center font-bold">0%</td>
                               </tr>
                               <tr className="border-b border-gray-200">
                                   <td className="p-2 font-bold">3. งานสถาปัตยกรรมและ MEP</td><td className="p-2">08/09/2025</td><td className="p-2">22/10/2025</td><td className="p-2 text-center text-gray-500">0%</td><td className="p-2 text-center font-bold">0%</td>
                               </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* PAGE 3: Details & Logs */}
              <div className="p-10 min-h-[297mm]">
                  <h3 className="text-lg font-black bg-gray-100 p-2 uppercase tracking-widest border-l-4 border-brand-600 text-gray-900 mb-6">3. Action Items & Open Issues</h3>
                  
                  <div className="space-y-8">
                      <div>
                          <h4 className="font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">Open Quality Issues (NCR)</h4>
                          <table className="w-full text-left border-collapse text-xs border border-gray-200">
                              <thead className="bg-gray-100">
                                   <tr>
                                       <th className="p-2 border border-gray-200">Ref No.</th>
                                       <th className="p-2 border border-gray-200">Description</th>
                                       <th className="p-2 border border-gray-200">Severity</th>
                                       <th className="p-2 border border-gray-200">Status</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                       <td className="p-2 border border-gray-200 font-mono">NCR-001</td>
                                       <td className="p-2 border border-gray-200">ผลทดสอบดิน (Soil Test) จุดที่ 3 ไม่ผ่านเกณฑ์</td>
                                       <td className="p-2 border border-gray-200 text-red-600 font-bold">High</td>
                                       <td className="p-2 border border-gray-200">รอวิศวกรออกแบบตอกเข็มเพิ่ม</td>
                                   </tr>
                              </tbody>
                          </table>
                      </div>

                      <div>
                          <h4 className="font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">Pending Approvals (RFA / RFI)</h4>
                          <table className="w-full text-left border-collapse text-xs border border-gray-200">
                              <thead className="bg-gray-100">
                                   <tr>
                                       <th className="p-2 border border-gray-200">Ref No.</th>
                                       <th className="p-2 border border-gray-200">Type</th>
                                       <th className="p-2 border border-gray-200">Subject</th>
                                       <th className="p-2 border border-gray-200">Days Open</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                       <td className="p-2 border border-gray-200 font-mono">RFI-004</td>
                                       <td className="p-2 border border-gray-200">Design</td>
                                       <td className="p-2 border border-gray-200">ระยะห่างเหล็กเสริมคานคอดิน B1</td>
                                       <td className="p-2 border border-gray-200 text-amber-600 font-bold">3 Days</td>
                                   </tr>
                              </tbody>
                          </table>
                      </div>

                      <div className="pt-20 mt-20 flex justify-around">
                          <div className="text-center">
                              <div className="w-48 border-b border-gray-600 mb-2"></div>
                              <p className="text-sm font-bold text-gray-900">({user?.name || 'นายวิศวกร ควบคุมงาน'})</p>
                              <p className="text-xs text-gray-500">Site Engineer / Inspector</p>
                          </div>
                          <div className="text-center">
                              <div className="w-48 border-b border-gray-600 mb-2"></div>
                              <p className="text-sm font-bold text-gray-900">(นายผู้จัดการ โครงการ)</p>
                              <p className="text-xs text-gray-500">Project Manager</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

