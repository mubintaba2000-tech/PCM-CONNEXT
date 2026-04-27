import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, AlertTriangle, FileText, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export const MultiProjectVoSummary = ({ projects, onBack }: { projects: any[], onBack: () => void }) => {
    // Generate some mock multi-project VO data since real DB doesn't have it all yet
    const generateMockVOData = () => {
        return projects.map((p, idx) => ({
            id: p.id,
            name: p.name,
            voCount: Math.floor(Math.random() * 10) + 1,
            totalVoPlus: Math.floor(Math.random() * 500000),
            totalVoMinus: Math.floor(Math.random() * 100000),
            pendingAmount: Math.floor(Math.random() * 200000),
            overdueAmount: idx % 2 === 0 ? Math.floor(Math.random() * 50000) : 0,
            lockedTasks: Math.floor(Math.random() * 5),
            topVos: [
                { id: `${p.id}-VO-00${Math.floor(Math.random()*9)+1}`, title: 'เพิ่มผนังตกแต่ง', amount: Math.floor(Math.random() * 80000) },
                { id: `${p.id}-VO-00${Math.floor(Math.random()*9)+1}`, title: 'ลดสเปคกระเบื้อง', amount: -Math.floor(Math.random() * 30000) }
            ],
            alerts: idx === 0 ? [
                { type: 'overdue', message: `VO-002 เกินกำหนดชำระ 5 วัน` },
                { type: 'pending', message: `VO-003 รออนุมัตินานกว่า 7 วัน` }
            ] : []
        }));
    };

    const [voData, setVoData] = useState<any[]>([]);

    useEffect(() => {
        setVoData(generateMockVOData());
    }, [projects]);

    const printPortrait = () => {
        window.print();
    };

    const totalOutstanding = voData.reduce((acc, curr) => acc + curr.pendingAmount + curr.overdueAmount, 0);
    const totalNetChange = voData.reduce((acc, curr) => acc + (curr.totalVoPlus - curr.totalVoMinus), 0);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 min-h-[500px] animate-in fade-in duration-300 relative print:shadow-none print:border-none print:p-0">
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        .print-area, .print-area * { visibility: visible; }
                        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                        @page { size: A3 landscape; margin: 10mm; }
                    }
                `}
            </style>
            
            <div className="flex justify-between items-center mb-6 print:hidden border-b border-gray-200 pb-4">
                <button onClick={onBack} className="text-gray-600 flex items-center hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors">
                    <ArrowLeft size={16} className="mr-2"/> กลับสู่หน้า Dashboard
                </button>
                <div className="flex gap-3">
                    <button onClick={printPortrait} className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-700 shadow-md">
                        <Printer size={16}/> พิมพ์รายงาน (A3 Landscape)
                    </button>
                </div>
            </div>

            <div className="print-area">
                <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                    <h1 className="text-2xl font-black text-gray-900 uppercase">รายงานสรุปงานเพิ่ม-ลด (VO) รวมทุกโครงการ</h1>
                    <p className="text-gray-600 mt-2">พิมพ์วันที่: {new Date().toLocaleDateString('th-TH')}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                        <p className="text-gray-500 text-sm font-semibold uppercase mb-1">โครงการทั้งหมด</p>
                        <p className="text-2xl font-black text-gray-800">{voData.length}</p>
                    </div>
                    <div className="bg-brand-50 border border-brand-200 p-4 rounded-lg text-center">
                        <p className="text-brand-700 text-sm font-semibold uppercase mb-1">มูลค่าสุทธิเพิ่ม-ลด</p>
                        <p className="text-2xl font-black text-brand-800">{totalNetChange.toLocaleString()} ฿</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                        <p className="text-yellow-700 text-sm font-semibold uppercase mb-1">ยอดรอเรียกเก็บ (Pending)</p>
                        <p className="text-2xl font-black text-yellow-800">{voData.reduce((a,c)=>a+c.pendingAmount,0).toLocaleString()} ฿</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                        <p className="text-red-700 text-sm font-semibold uppercase mb-1">ยอดค้างชำระทั้งหมด <AlertTriangle className="inline w-4 h-4 mb-1"/></p>
                        <p className="text-2xl font-black text-red-800">{voData.reduce((a,c)=>a+c.overdueAmount,0).toLocaleString()} ฿</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Alerts Section */}
                    <div className="col-span-1 border border-red-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-red-50 p-3 border-b border-red-100 flex items-center font-bold text-red-800">
                            <AlertTriangle className="mr-2" size={18}/> รายการแจ้งเตือน (Alerts)
                        </div>
                        <div className="p-4 bg-white h-full">
                            <ul className="space-y-3">
                                {voData.flatMap(p => p.alerts.map((a:any) => ({...a, pName: p.name}))).length === 0 && (
                                    <p className="text-gray-500 text-sm">ไม่มีรายการแจ้งเตือน</p>
                                )}
                                {voData.flatMap(p => p.alerts.map((a:any) => ({...a, pName: p.name}))).map((alert: any, idx: number) => (
                                    <li key={idx} className="flex flex-col text-sm border-l-2 border-red-400 pl-2">
                                        <span className="font-bold text-red-600 mb-0.5">{alert.pName}</span>
                                        <span className="text-gray-700">{alert.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Top 5 VO */}
                    <div className="col-span-2 border border-brand-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-brand-50 p-3 border-b border-brand-100 flex items-center font-bold text-brand-800">
                            <BarChart3 className="mr-2" size={18}/> TOP 5 VO มูลค่าสูงสุด (รวมทุกโครงการ)
                        </div>
                        <div className="bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                                    <tr>
                                        <th className="p-3 font-semibold">Project</th>
                                        <th className="p-3 font-semibold">VO ID</th>
                                        <th className="p-3 font-semibold">Title</th>
                                        <th className="p-3 text-right font-semibold">Amount (THB)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {voData.flatMap(p => p.topVos.map((tv:any) => ({...tv, pName: p.name})))
                                            .sort((a,b) => b.amount - a.amount)
                                            .slice(0, 5)
                                            .map((v, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="p-3 text-gray-800 font-medium">{v.pName}</td>
                                            <td className="p-3 text-brand-600">{v.id}</td>
                                            <td className="p-3 text-gray-700">{v.title}</td>
                                            <td className="p-3 text-right font-mono font-bold text-gray-900">{v.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Per Project Table */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">รายละเอียดแยกตามโครงการ</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left align-middle border-collapse bg-white">
                        <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[11px] tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="p-3 border-r border-gray-200">Project</th>
                                <th className="p-3 text-center border-r border-gray-200">VO Count</th>
                                <th className="p-3 text-right">Total VO+</th>
                                <th className="p-3 text-right border-r border-gray-200">Total VO-</th>
                                <th className="p-3 text-right font-black text-brand-700 border-r border-gray-200">Net Change</th>
                                <th className="p-3 text-right text-yellow-700">Pending Amt</th>
                                <th className="p-3 text-right bg-red-50 text-red-700 border-l border-red-100">Overdue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {voData.map((d, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 border-r border-gray-100 text-gray-900 font-bold">{d.name}</td>
                                    <td className="p-3 text-center border-r border-gray-100 text-gray-600">{d.voCount}</td>
                                    <td className="p-3 text-right text-emerald-600">{d.totalVoPlus.toLocaleString()}</td>
                                    <td className="p-3 text-right text-orange-600 border-r border-gray-100">-{d.totalVoMinus.toLocaleString()}</td>
                                    <td className="p-3 text-right border-r border-gray-100 text-brand-700 font-black">{(d.totalVoPlus - d.totalVoMinus).toLocaleString()}</td>
                                    <td className="p-3 text-right text-yellow-600">{d.pendingAmount.toLocaleString()}</td>
                                    <td className="p-3 text-right bg-red-50/50 text-red-600 border-l border-red-100">{d.overdueAmount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-black text-gray-900 border-t border-gray-300">
                            <tr>
                                <td className="p-3 border-r border-gray-300 uppercase">Grand Total</td>
                                <td className="p-3 text-center border-r border-gray-300">{voData.reduce((a,c)=>a+c.voCount,0)}</td>
                                <td className="p-3 text-right text-emerald-700">{voData.reduce((a,c)=>a+c.totalVoPlus,0).toLocaleString()}</td>
                                <td className="p-3 text-right text-orange-700 border-r border-gray-300">-{voData.reduce((a,c)=>a+c.totalVoMinus,0).toLocaleString()}</td>
                                <td className="p-3 text-right border-r border-gray-300 text-brand-800">{totalNetChange.toLocaleString()}</td>
                                <td className="p-3 text-right text-yellow-800">{voData.reduce((a,c)=>a+c.pendingAmount,0).toLocaleString()}</td>
                                <td className="p-3 text-right bg-red-100 text-red-800 border-l border-red-200">{voData.reduce((a,c)=>a+c.overdueAmount,0).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    );
}
