import React, { useState } from 'react';
import { Project } from '../../types';
import { Plus, Search, FileText, CheckCircle, Clock, AlertTriangle, ChevronDown, Download, Lock, CheckSquare, Briefcase, Layers, ArrowLeft, Printer, CreditCard, Unlock, BarChart3, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

export const VoTab = ({ project, user }: { project: Project, user: any }) => {
    const [vos, setVos] = useState<any[]>([
        {
            vo_id: "BKK2568-VO-003",
            vo_revision: 0,
            vo_type: "VO+",
            title: "ติดตั้งลิฟต์บ้านพักอาศัย",
            description: "ลูกค้าต้องการเพิ่มลิฟต์โดยสารขนาดเล็กสำหรับผู้สูงอายุ",
            source_reference: { type: "client_request", ref_id: null, ref_description: "ลูกค้าแจ้งทาง Line" },
            items: [
                { item_no: 1, description: "ค่าลิฟต์ 4 คนโดยสาร", unit: "ชุด", quantity: 1, unit_price: 850000, amount: 850000 },
                { item_no: 2, description: "ค่าเตรียมบ่อลิฟต์และงานโครงสร้าง", unit: "LS", quantity: 1, unit_price: 150000, amount: 150000 }
            ],
            subtotal: 1000000,
            tax_settings: { vat_rate: 7, vat_exempt: false, withholding_tax: 0, vat_amount: 70000, wht_amount: 0, net_payable: 1070000 },
            grand_total: 1070000,
            contract_before: 10000000, 
            contract_after: 11070000,
            created_by: "pm",
            created_date: "2026-04-26",
            approval_deadline: "2026-05-10",
            status: "pending_approval",
            revision_history: [],
            approval: {},
            billing: { amount_due: 1070000, amount_paid: 0, balance: 1070000, partial_payments: [] },
            linked_tasks: ["WC-STR-04", "WC-FIN-07"],
            gantt_locked: true,
            audit_log: [
                { action: "CREATED", user: "PM", timestamp: "2026-04-26T14:00:00Z" },
                { action: "STATUS_CHANGED", status: "pending_approval", user: "PM", timestamp: "2026-04-26T14:05:00Z" }
            ]
        },
        {
            vo_id: "BKK2568-VO-001",
            vo_revision: 0,
            vo_type: "VO+",
            title: "เพิ่มหน้าต่างบานเกล็ด โซน A",
            description: "ลูกค้าขอเพิ่มหน้าต่างระบายอากาศที่ห้องเก็บของ",
            source_reference: { type: "client_request" },
            items: [
                { item_no: 1, description: "หน้าต่างบานเกล็ดอลูมิเนียม 1x1m", unit: "ชุด", quantity: 2, unit_price: 3500, amount: 7000 },
                { item_no: 2, description: "ค่าแรงติดตั้ง", unit: "LS", quantity: 1, unit_price: 2000, amount: 2000 }
            ],
            subtotal: 9000,
            tax_settings: { vat_rate: 7, vat_exempt: false, withholding_tax: 0, vat_amount: 630, wht_amount: 0, net_payable: 9630 },
            grand_total: 9630,
            contract_before: 10000000, 
            contract_after: 10009000,
            created_by: "pm",
            created_date: "2026-04-20",
            approval_deadline: "2026-05-04",
            status: "pending_approval",
            revision_history: [],
            approval: {},
            billing: { amount_due: 9630, amount_paid: 0, balance: 9630, partial_payments: [] },
            linked_tasks: ["WC03"],
            gantt_locked: true,
            audit_log: []
        },
        {
            vo_id: "BKK2568-VO-002",
            vo_revision: 1,
            vo_type: "VO-",
            title: "ลดสเปคกระเบื้องห้องน้ำ",
            description: "เปลี่ยนจากแกรนิตโต้เป็นเซรามิคธรรมดา",
            source_reference: { type: "site_change" },
            items: [
                { item_no: 1, description: "ส่วนต่างค่าวัสดุกระเบื้อง (หักลด)", unit: "ตร.ม.", quantity: 50, unit_price: -400, amount: -20000 }
            ],
            subtotal: -20000,
            tax_settings: { vat_rate: 7, vat_exempt: false, withholding_tax: 0, vat_amount: -1400, wht_amount: 0, net_payable: -21400 },
            grand_total: -21400,
            contract_before: 10009000,
            contract_after: 9989000,
            created_by: "pm",
            created_date: "2026-04-15",
            approval_deadline: "2026-04-29",
            status: "approved",
            revision_history: [{ revision_no: 1, revised_by: "admin", revised_date: "2026-04-16", reason: "อัพเดทราคา", changes_summary: "แก้ไขราคาตามตกลง" }],
            approval: { method: "client_direct", approved_by: "คุณลูกค้า", approved_date: "2026-04-17" },
            billing: { amount_due: 0, amount_paid: 0, balance: 0, partial_payments: [] },
            linked_tasks: [],
            gantt_locked: false,
            audit_log: []
        }
    ]);

    const [activeTab, setActiveTab] = useState<string>('list');
    const [selectedVo, setSelectedVo] = useState<any>(null);
    const [voForm, setVoForm] = useState<any>({
        vo_type: 'VO+', title: '', description: '', items: [{ item_no: 1, description: '', unit: '', quantity: 1, unit_price: 0, amount: 0 }],
        tax_settings: { vat_rate: 7, vat_exempt: false, withholding_tax: 0 }
    });

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-emerald-100 text-emerald-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'billed': return 'bg-blue-100 text-blue-800';
            case 'partial_payment': return 'bg-purple-100 text-purple-800';
            case 'paid': return 'bg-emerald-200 text-emerald-900';
            case 'overdue': return 'bg-red-200 text-red-900';
            case 'expired': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const getTypeStyle = (type: string) => {
        if(type === 'VO+') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if(type === 'VO-') return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }

    const calculateTotals = (items: any[], taxSettings: any) => {
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0), 0);
        let vatAmt = 0;
        if (!taxSettings.vat_exempt) {
            vatAmt = subtotal * (taxSettings.vat_rate / 100);
        }
        const grand_total = subtotal + vatAmt;
        const whtAmt = subtotal * ((taxSettings.withholding_tax || 0) / 100);
        const net_payable = grand_total - whtAmt;
        
        return { subtotal, vat_amount: vatAmt, grand_total, wht_amount: whtAmt, net_payable };
    };

    const handleCreateVO = () => {
        if (!voForm.title) return toast.error("กรุณาระบุชื่องาน VO");
        if (!voForm.items[0].description) return toast.error("กรุณาระบุรายการอย่างน้อย 1 รายการ");

        const totals = calculateTotals(voForm.items, voForm.tax_settings);
        const newVo = {
            vo_id: `BKK2568-VO-00${vos.length + 1}`,
            vo_revision: 0,
            vo_type: voForm.vo_type,
            title: voForm.title,
            description: voForm.description,
            items: voForm.items.map((it:any) => ({...it, amount: it.quantity * it.unit_price})),
            subtotal: totals.subtotal,
            tax_settings: { ...voForm.tax_settings, vat_amount: totals.vat_amount, wht_amount: totals.wht_amount, net_payable: totals.net_payable },
            grand_total: totals.grand_total,
            net_payable: totals.net_payable,
            contract_before: vos[vos.length-1].contract_after,
            contract_after: vos[vos.length-1].contract_after + totals.subtotal,
            created_by: user?.role || "pm",
            created_date: new Date().toISOString().split('T')[0],
            approval_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "draft",
            audit_log: [{ action: "CREATED", user: user?.name, timestamp: new Date().toISOString() }]
        };

        setVos([newVo, ...vos]);
        toast.success("สร้างรายการ VO สำเร็จ (Draft)");
        setActiveTab('list');
    };

    const viewDetail = (vo: any) => {
        setSelectedVo(vo);
        setActiveTab('detail');
    };

    const submitToClient = () => {
        const updated = { ...selectedVo, status: 'pending_approval' };
        updated.audit_log.push({ action: "STATUS_CHANGED", status: "pending_approval", user: user?.name, timestamp: new Date().toISOString() });
        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("PM ตรวจสอบและส่งลูกค้าเรียบร้อยแล้ว");
    };

    const rejectDirect = () => {
        const d = new Date();
        const reason = window.prompt("ระบุเหตุผลที่ปฏิเสธเพื่อส่งให้ผู้จัดการโครงการพิจารณา:");
        if (!reason && reason !== "") {
            return;
        }

        const updated = { ...selectedVo, status: 'rejected', rejection_reason: reason || 'ไม่ได้ระบุเหตุผล' };
        
        updated.audit_log.push({ action: "STATUS_CHANGED", status: "rejected", user: user?.name, timestamp: new Date().toISOString(), details: `ลูกค้าปฏิเสธ: ${updated.rejection_reason}` });
        
        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.error("บันทึกการปฏิเสธรายการแล้ว ท่านสามารถให้ผู้จัดการโครงการสร้างฉบับแก้ไขได้", {id: 'reject-vo'});
        setActiveTab('detail');
    };

    const approveDirect = () => {
        const d = new Date();
        
        const updated = { ...selectedVo, status: 'approved', approval: {
            method: "client_login",
            client_approved_by: user?.name,
            client_approved_date: d.toISOString().split('T')[0],
            evidence_type: "system_click"
        }, billing: {
            ...selectedVo.billing
        }};
        
        updated.audit_log.push({ action: "STATUS_CHANGED", status: "approved", user: user?.name, timestamp: new Date().toISOString(), details: "อนุมัติโดยระบบ (Client Login)" });
        updated.audit_log.push({ action: "AUTO_LINK", status: "pending_billing", user: "system_auto", timestamp: new Date().toISOString(), details: "ส่งประวัติเข้าสู่โมดูลการเงิน รอการออกใบแจ้งหนี้" });
        
        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("ท่านอนุมัติรายการเรียบร้อย ระบบส่งการแจ้งเตือนไปยังฝ่ายบัญชีแล้ว", {id: 'auto-link-inv'});
        setActiveTab('detail');
    };

    const approveOnBehalf = (channel: string, desc: string, file: any) => {
        if (!file) {
            toast.error("กรุณาแนบไฟล์รูปภาพการยืนยันจากลูกค้า");
            return;
        }
        if (!desc || desc.trim() === '') {
            toast.error("กรุณาระบุคำอธิบายหลักฐานให้ชัดเจน");
            return;
        }

        const d = new Date();
        
        const updated = { ...selectedVo, status: 'approved', approval: {
            method: "office_on_behalf",
            client_approved_by: "เจ้าของโครงการ",
            client_approved_date: d.toISOString().split('T')[0],
            evidence_type: channel === 'Line' ? 'line_chat' : channel === 'Email' ? 'email' : 'verbal',
            evidence_desc: desc,
            evidence_file: file.name
        }, billing: { ...selectedVo.billing }};
        
        updated.audit_log.push({ action: "STATUS_CHANGED", status: "approved", user: user?.name, timestamp: new Date().toISOString(), details: `Office On Behalf: ${desc}` });
        updated.audit_log.push({ action: "AUTO_LINK", status: "pending_billing", user: "system_auto", timestamp: new Date().toISOString(), details: "รับรองและส่งประวัติเข้าสู่โมดูลการเงิน รอพิจารณาออกใบแจ้งหนี้" });
        
        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("บันทึกการรับรองและแนบหลักฐานเรียบร้อย พร้อมแจ้งฝ่ายบัญชี", {id: 'auto-link-inv'});
        setActiveTab('detail');
    };

    const createInvoice = (dueDays: number) => {
        const d = new Date();
        const due = new Date(d.getTime() + dueDays * 24 * 60 * 60 * 1000);
        
        const updated = {
            ...selectedVo,
            status: 'billed',
            billing: {
                ...selectedVo.billing,
                invoice_no: `INV-2568-[AUTO]`,
                invoice_date: d.toISOString().split('T')[0],
                due_date: due.toISOString().split('T')[0],
                amount_due: selectedVo.grand_total,
                amount_paid: 0,
                balance: selectedVo.grand_total,
                partial_payments: []
            }
        };

        updated.audit_log.push({ action: "INVOICE_CREATED", status: "billed", user: user?.name, timestamp: new Date().toISOString(), details: `Accounts created auto invoice (Due: ${dueDays} days)` });
        
        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("ออกใบแจ้งหนี้เรียบร้อย สถานะการเก็บเงินเริ่มทำงาน");
        setActiveTab('detail');
    };
    const recordPayment = (amount: number, method: string, ref: string) => {
        if (amount > selectedVo.billing.balance) {
            toast.error("ยอดชำระเกินกว่าในบิล กรุณาตรวจสอบ");
            return;
        }

        const currentBalance = selectedVo.billing.balance;
        const newPaid = selectedVo.billing.amount_paid + amount;
        const newBalance = currentBalance - amount;
        
        let newStatus = selectedVo.status;
        if (newBalance <= 0) {
            newStatus = 'paid';
        } else {
            newStatus = 'partial_payment';
        }

        const paymentRecord = {
            paid_date: new Date().toISOString().split('T')[0],
            amount_paid: amount,
            payment_method: method,
            payment_ref: ref
        };

        const updated = {
            ...selectedVo,
            status: newStatus,
            gantt_locked: newStatus !== 'paid',
            billing: {
                ...selectedVo.billing,
                amount_paid: newPaid,
                balance: newBalance,
                partial_payments: [...(selectedVo.billing.partial_payments || []), paymentRecord]
            }
        };

        updated.audit_log.push({ action: "STATUS_CHANGED", status: newStatus, user: user?.name, timestamp: new Date().toISOString(), details: `Paid ${amount} via ${method}` });
        
        if (newStatus === 'paid') {
            const ganttTargetMsg = updated.vo_type === 'VO-' ? "มาร์คสถานะ task เป็น 'Cancelled'" : "เพิ่มรายการงานใหม่พร้อมบันทึก Planned Start";
            updated.audit_log.push({ action: "COMPLETED", status: "paid", user: "system_auto", timestamp: new Date().toISOString(), details: `Gantt Tasks Unlocked: ${ganttTargetMsg}` });
            toast.success(`รับชำระครบถ้วน! ออกใบเสร็จและระบบปลดล็อก Gantt อัตโนมัติ (${ganttTargetMsg})`, { icon: '🔓', id: 'payment_vo' });
        } else {
            toast.success("บันทึกการรับชำระเงินบางส่วน แจ้ง PM รับทราบ", { id: 'payment_vo' });
        }

        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        setActiveTab('detail');
    };

    const pmOverrideUnlock = (reason: string) => {
        if (user?.role !== 'pm' && user?.role !== 'admin') {
            toast.error("เฉพาะ PM เท่านั้นที่สามารถทำการ Override ได้");
            return;
        }

        const updated = {
            ...selectedVo,
            gantt_locked: false
        };

        updated.audit_log.push({ 
            action: "PM_OVERRIDE_UNLOCK", 
            status: selectedVo.status, 
            user: user?.name, 
            timestamp: new Date().toISOString(), 
            details: `PM Override: ${reason}` 
        });

        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("PM ยืนยันปลดล็อกงานก่อนชำระเงินครบ", { icon: '🔓' });
        setActiveTab('detail');
    };

    const cancelVO = () => {
        if (user?.role !== 'pm' && user?.role !== 'admin') {
            toast.error("เฉพาะ PM หรือ Admin เท่านั้นที่สามารถยกเลิก VO ได้");
            return;
        }
        if (!['draft', 'pending_approval', 'approved', 'rejected', 'expired'].includes(selectedVo.status)) {
            toast.error("ไม่สามารถยกเลิก VO ที่มีการเรียกเก็บเงินหรือชำระเงินแล้วได้");
            return;
        }
        
        const reason = window.prompt("กรุณาระบุเหตุผลในการยกเลิก VO นี้:");
        if (!reason) return;

        const updated = {
            ...selectedVo,
            status: 'cancelled',
            gantt_locked: false, // Unlock all tasks since VO is canceled
            cancellation_reason: reason
        };

        updated.audit_log.push({ 
            action: "CANCELLED", 
            status: "cancelled", 
            user: user?.name, 
            timestamp: new Date().toISOString(), 
            details: `Reason: ${reason}` 
        });

        setVos(vos.map(v => v.vo_id === updated.vo_id ? updated : v));
        setSelectedVo(updated);
        toast.success("ยกเลิก VO เรียบร้อยแล้ว ระบบได้ปลดล็อกงานใน Gantt ให้กลับสู่สถานะเดิม", { icon: '🚫' });
    };

    const reviseVO = () => {
        if (user?.role !== 'pm' && user?.role !== 'admin' && user?.role !== 'office') {
            toast.error("เฉพาะ PM, Admin หรือ Office เท่านั้นที่สามารถแก้ไขเพิ่มเติม VO (Revise) ได้");
            return;
        }
        
        const reason = window.prompt("กรุณาระบุเหตุผลในการทำ Revision ใหม่ (เช่น ลูกค้าให้ส่วนลด, ปรับแบบ):");
        if (!reason) {
            toast.error("ต้องระบุเหตุผลการทำ Revision");
            return;
        }

        const newRevNo = (selectedVo.vo_revision || 0) + 1;
        const newVoId = `${selectedVo.vo_id.split('-R')[0]}-R${newRevNo}`;
        
        const superseded = { ...selectedVo, status: 'superseded', superseding_vo_id: newVoId };
        superseded.audit_log.push({ action: "STATUS_CHANGED", status: "superseded", user: user?.name, timestamp: new Date().toISOString(), details: `ถูกแทนที่ด้วย ${newVoId}: ${reason}` });

        const revisedVo = {
            ...selectedVo,
            vo_id: newVoId,
            vo_revision: newRevNo,
            status: 'draft',
            rejection_reason: undefined,
            cancellation_reason: undefined,
            approval: {},
            audit_log: [
                { action: "CREATED", user: user?.name, timestamp: new Date().toISOString(), details: `Revision ใหม่จาก ${selectedVo.vo_id}: ${reason}` }
            ]
        };

        const updatedVos = vos.map(v => v.vo_id === superseded.vo_id ? superseded : v);
        setVos([revisedVo, ...updatedVos]);
        setSelectedVo(revisedVo);
        toast.success(`สร้างฉบับแก้ไข ${newVoId} สำเร็จ สถานะเป็น Draft.`);
        setActiveTab('detail');
    };

    const printReceipt = () => {
        if(!selectedVo.billing?.invoice_no || selectedVo.status !== 'paid') return;
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${selectedVo.billing.invoice_no}</title>
    <style>
        @page { size: A4 portrait; margin: 20mm; }
        body { font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; line-height: 1.5; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; color: #059669; }
        h3 { color: #065f46; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f0fdf4; color: #065f46; width: 30%; }
        .footer-sig { margin-top: 80px; display: flex; justify-content: space-between; text-align: center; }
        .sig-box { width: 30%; border-top: 1px solid #333; padding-top: 10px; }
        .print-footer { position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ใบเสร็จรับเงิน (Receipt)</h1>
        <p>อ้างอิงใบแจ้งหนี้ (Invoice Ref): ${selectedVo.billing.invoice_no}</p>
    </div>
    
    <h3>ข้อมูลลูกค้า (Client Info)</h3>
    <table>
        <tr><th>ลูกค้า (Client)</th><td>${project.owner || 'N/A'}</td></tr>
        <tr><th>โครงการ (Project)</th><td>${project.name}</td></tr>
        <tr><th>เลขที่เอกสาร VO</th><td><strong>${selectedVo.vo_id}</strong></td></tr>
        <tr><th>วันที่รับเงิน (Date Received)</th><td>${selectedVo.billing.partial_payments?.[selectedVo.billing.partial_payments.length-1]?.paid_date || new Date().toISOString().split('T')[0]}</td></tr>
    </table>

    <h3>รายละเอียดการรับชำระ (Payment Details)</h3>
    <table>
        <tr><th>จำนวนเงินที่รับชำระ (Amount Paid)</th><td><strong>${selectedVo.billing.amount_paid.toLocaleString()} THB</strong></td></tr>
        <tr><th>ช่องทางการรับชำระ (Payment Method)</th><td>${selectedVo.billing.partial_payments?.[selectedVo.billing.partial_payments.length-1]?.payment_method || '-'}</td></tr>
        <tr><th>อ้างอิงการโอน/เช็ค (Payment Ref)</th><td>${selectedVo.billing.partial_payments?.[selectedVo.billing.partial_payments.length-1]?.payment_ref || '-'}</td></tr>
        <tr><th>ยอดคงเหลือ (Balance Due)</th><td><strong>${selectedVo.billing.balance.toLocaleString()} THB</strong></td></tr>
    </table>

    <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <p><strong>หมายเหตุ (Remarks):</strong></p>
        <p>ใบเสร็จรับเงินฉบับนี้จะสมบูรณ์เมื่อบริษัทได้รับเงินเข้าบัญชีเรียบร้อยแล้ว หรือเช็คผ่านการเรียกเก็บเงินเรียบร้อยแล้ว ท่านสามารถดำเนินการในส่วนของงานที่เกี่ยวข้องในระบบ Gantt Chart ต่อไปได้</p>
    </div>

    <div class="footer-sig">
        <div class="sig-box">
            <p>ผู้รับเงิน (Receiver)</p><br/><br/>
            <p>( Accounting )</p>
        </div>
        <div class="sig-box">
            <p>วันที่รับเงิน (Date)</p><br/><br/>
            <p>(......../......../........)</p>
        </div>
    </div>
    
    <div class="print-footer">
        เอกสารอ้างอิง: ${selectedVo.billing.invoice_no} | จัดทำวันที่: ${new Date().toISOString().split('T')[0]} | Receipt of Payment
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    const printInvoice = () => {
        if(!selectedVo.billing?.invoice_no) return;
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - ${selectedVo.billing.invoice_no}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .text-right { text-align: right; }
        .footer-sig { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
        .sig-box { width: 40%; border-top: 1px solid #333; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ใบแจ้งหนี้ (Invoice)</h1>
        <p style="font-size: 14px; font-weight: bold;">บริษัท เอ็น เอส เซ็นจูรี่ เรียลเอสเตท จำกัด (สำนักงานใหญ่)</p>
        <p>123 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330 | เลขประจำตัวผู้เสียภาษี: 0105566000000</p>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="width: 60%">
            <p><strong>ชื่อลูกค้า (Client):</strong> ${project.owner || 'N/A'}</p>
            <p><strong>โครงการ (Project):</strong> ${project.name} (สัญญาเลขที่: CTR-2568-001)</p>
            <p><strong>อ้างอิงเอกสาร:</strong> VO No. ${selectedVo.vo_id} (${selectedVo.title})</p>
        </div>
        <div style="width: 35%; text-align: right; background: #fafafa; padding: 10px; border: 1px solid #eee;">
            <p><strong>Invoice No:</strong> ${selectedVo.billing.invoice_no}</p>
            <p><strong>วันที่ออกบิล (Date):</strong> ${selectedVo.billing.invoice_date}</p>
            <p style="color:red; font-weight:bold;"><strong>กำหนดชำระ (Due Date):</strong> ${selectedVo.billing.due_date}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:10%">Item</th>
                <th style="width:40%">Description</th>
                <th style="width:10%" class="text-right">Qty</th>
                <th style="width:10%" class="text-right">Unit</th>
                <th style="width:15%" class="text-right">Unit Price</th>
                <th style="width:15%" class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${selectedVo.items.map((it:any) => `
            <tr>
                <td>${it.item_no}</td>
                <td>${it.description}</td>
                <td class="text-right">${it.quantity}</td>
                <td class="text-right">${it.unit}</td>
                <td class="text-right">${it.unit_price.toLocaleString()}</td>
                <td class="text-right">${it.amount.toLocaleString()}</td>
            </tr>
            `).join('')}
        </tbody>
        <tfoot>
            <tr><th colspan="5" class="text-right">Subtotal ${selectedVo.tax_settings?.vat_exempt ? '(VAT Exempt)' : ''}</th><th class="text-right">${selectedVo.subtotal.toLocaleString()}</th></tr>
            ${selectedVo.tax_settings?.vat_exempt ? 
              `<tr><td colspan="6" class="text-right" style="color:red; font-size:10px;">*เหตุผลยกเว้น VAT: ${selectedVo.tax_settings.vat_exempt_reason || '-'}</td></tr>` : 
              `<tr><th colspan="5" class="text-right">VAT (7%)</th><th class="text-right">${(selectedVo.tax_settings?.vat_amount || 0).toLocaleString()}</th></tr>`
            }
            <tr><th colspan="5" class="text-right">Grand Total</th><th class="text-right">${selectedVo.grand_total.toLocaleString()}</th></tr>
            ${selectedVo.tax_settings?.wht_amount > 0 ? 
              `<tr><th colspan="5" class="text-right" style="color:#d97706;">หักภาษี ณ ที่จ่าย WHT (${selectedVo.tax_settings.withholding_tax}%)</th><th class="text-right" style="color:#d97706;">-${selectedVo.tax_settings.wht_amount.toLocaleString()}</th></tr>
               <tr><th colspan="5" class="text-right" style="font-size:14px; background:#e5e7eb;">NET PAYABLE (ยอดชำระสุทธิ)</th><th class="text-right" style="font-size:14px; background:#e5e7eb;">${(selectedVo.net_payable || selectedVo.grand_total).toLocaleString()}</th></tr>` : 
               `<tr><th colspan="5" class="text-right" style="font-size:14px; background:#e5e7eb;">NET PAYABLE (ยอดชำระสุทธิ)</th><th class="text-right" style="font-size:14px; background:#e5e7eb;">${selectedVo.grand_total.toLocaleString()}</th></tr>`
            }
            ${selectedVo.tax_settings?.wht_amount > 0 ? `<tr><td colspan="6" class="text-right" style="font-size:10px; color:gray;">โปรดออกหนังสือรับรองการหักภาษี ณ ที่จ่าย (Withholding Tax Certificate) ให้แก่บริษัทฯ</td></tr>` : ''}
        </tfoot>
    </table>

    <div style="margin-top: 30px; padding: 15px; border: 1px solid #ccc; background: #fafafa; border-radius: 8px;">
        <h4 style="margin-top: 0;">ข้อมูลการชำระเงิน (Payment Options)</h4>
        <p><strong>ธนาคาร (Bank):</strong> ธนาคารกสิกรไทย (KASIKORNBANK)</p>
        <p><strong>ชื่อบัญชี (Account Name):</strong> บริษัท เอ็น เอส เซ็นจูรี่ เรียลเอสเตท จำกัด</p>
        <p><strong>เลขที่บัญชี (Account No.):</strong> 123-4-56789-0</p>
        <p style="font-size: 11px; color: #666; margin-top: 10px;">*กรุณาส่งหลักฐานการชำระเงิน (Pay-in Slip) มาที่ finance@nscentury.com หรือบันทึกผ่านทางระบบ</p>
    </div>

    <div class="footer-sig">
        <div class="sig-box">
            <p>ผู้ออกใบแจ้งหนี้ / Prepared By</p><br/><br/>
            <p>( Accounting )</p>
        </div>
        <div class="sig-box">
            <p>ผู้รับวางบิล / Received By</p><br/><br/>
            <p>( Client / Owner )</p>
        </div>
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    }

    const printVODashboard = () => {
        const d = new Date().toISOString().split('T')[0];
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VO Dashboard - ${project.name}</title>
    <style>
        @page { size: A3 landscape; margin: 15mm; }
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header { display: flex; justify-content: space-between; align-items: end; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header-title { font-size: 24px; font-weight: bold; margin: 0; }
        .header-meta { font-size: 12px; color: #555; text-align: right; }
        
        .grid-kpi { display: flex; gap: 15px; margin-bottom: 20px; }
        .kpi-card { flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fafafa; }
        .kpi-title { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
        .kpi-value { font-size: 20px; font-weight: bold; margin:0; }
        
        .main-layout { display: flex; gap: 20px; }
        .col-2 { flex: 2; display: flex; flex-direction: column; gap: 20px; }
        .col-1 { flex: 1; display: flex; flex-direction: column; gap: 20px; }
        
        .section-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white; }
        .section-title { font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0; margin-bottom: 15px; }
        
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .text-right { text-align: right; }
        
        .chart-container { height: 150px; display: flex; align-items: flex-end; gap: 10px; border-bottom: 1px solid #ccc; border-left: 1px solid #ccc; padding: 10px; padding-bottom: 0px; }
        .bar { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
        .bar-fill { width: 100%; border-radius: 2px 2px 0 0; }
        .bar-label { font-size: 9px; margin-top: 5px; transform: rotate(-45deg); transform-origin: top left; position: absolute; bottom: -30px; left: 10px; white-space: nowrap; }
        
        .bg-emerald { background-color: #34d399; }
        .bg-red { background-color: #f87171; }
        .bg-gray { background-color: #9ca3af; }
        
        .status-badge { padding: 3px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef08a; color: #854d0e; }
        .status-billed { background: #dbeafe; color: #1e40af; }
        
        .print-footer { text-align: center; margin-top: 40px; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="header-title">Variation Order (VO) Dashboard</h1>
            <div style="font-size:14px; margin-top:5px; font-weight:bold;">Project: ${project.name}</div>
        </div>
        <div class="header-meta">
            Printed: ${d}<br/>
            Ref: BKK-VO-RPT-001
        </div>
    </div>

    <!-- A. KPI Cards -->
    <div class="grid-kpi">
        <div class="kpi-card">
            <div class="kpi-title">Contract Value</div>
            <div class="kpi-value">${project.budget?.toLocaleString() || 0}</div>
            <div style="font-size:11px; color:#059669; margin-top:5px; font-weight:bold;">Final: ${vos.length > 0 ? vos[vos.length-1].contract_after.toLocaleString() : (project.budget?.toLocaleString() || 0)}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Total VOs</div>
            <div class="kpi-value">${vos.length}</div>
            <div style="font-size:11px; margin-top:5px;"><span style="color:#059669">+${vos.filter(v=>v.vo_type==='VO+').length}</span> | <span style="color:#dc2626">-${vos.filter(v=>v.vo_type==='VO-').length}</span></div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Pipeline</div>
            <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:5px; font-weight:bold;"><span>Pending</span> <span>${vos.filter(v=>['draft','pending_approval'].includes(v.status)).length}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:5px; font-weight:bold; color:#059669;"><span>Approved</span> <span>${vos.filter(v=>v.status==='approved').length}</span></div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Unpaid Amount</div>
            <div class="kpi-value" style="color:#dc2626;">${vos.reduce((sum, v) => sum + (v.billing?.balance || 0), 0).toLocaleString()} THB</div>
            <div style="font-size:11px; color:#dc2626; margin-top:5px; font-weight:bold;">${vos.filter(v=>v.status==='overdue').length} Overdue</div>
        </div>
    </div>

    <div class="main-layout">
        <!-- B, C Table & Chart -->
        <div class="col-2">
            ${user?.role !== 'client' && user?.role !== 'engineer' ? `
            <div class="section-box">
                <h3 class="section-title">Cost & Cashflow Impact</h3>
                <div class="chart-container" style="margin-bottom: 30px;">
                    ${vos.map((v) => {
                        const h = Math.max(10, Math.min(100, (v.grand_total / 100000) * 100));
                        const colorClass = v.vo_type === 'VO-' ? 'bg-red' : v.vo_type === 'VO0' ? 'bg-gray' : 'bg-emerald';
                        return `<div class="bar" style="height:100%;">
                            <div class="bar-fill ${colorClass}" style="height:${h}%;"></div>
                            <div class="bar-label">${v.vo_id.split('-').pop()}</div>
                        </div>`;
                    }).join('')}
                </div>
                <div style="display:flex; justify-content:center; gap:20px; font-size:10px; font-weight:bold; margin-top:20px;">
                    <div><span style="display:inline-block; width:10px; height:10px; background:#34d399; margin-right:5px;"></span>VO+</div>
                    <div><span style="display:inline-block; width:10px; height:10px; background:#f87171; margin-right:5px;"></span>VO-</div>
                    <div><span style="display:inline-block; width:10px; height:10px; background:#9ca3af; margin-right:5px;"></span>VO0</div>
                </div>
            </div>` : ''}

            <div class="section-box">
                <h3 class="section-title">VO Pipeline & Status</h3>
                <table>
                    <thead>
                        <tr>
                            <th>VO ID</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th class="text-right">Grand Total</th>
                            <th>Status</th>
                            <th>Due/Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vos.map(v => `
                        <tr>
                            <td><strong>${v.vo_id}</strong></td>
                            <td>${v.title}</td>
                            <td>${v.vo_type}</td>
                            <td class="text-right">${v.grand_total.toLocaleString()}</td>
                            <td><span class="status-badge ${v.status==='approved'?'status-approved':v.status==='pending_approval'?'status-pending':'status-billed'}">${v.status.replace('_',' ')}</span></td>
                            <td>${v.billing?.due_date || '-'} ${v.billing?.balance > 0 ? `<br><span style="color:red;font-size:9px;">Bal: ${v.billing.balance.toLocaleString()}</span>` : ''}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- D. Timeline -->
        <div class="col-1">
            <div class="section-box" style="height:100%;">
                <h3 class="section-title">Recent Activities</h3>
                <div style="margin-top:10px; font-size:11px;">
                    ${vos.slice(0, 8).map(v => `
                        <div style="border-left:2px solid #ddd; padding-left:10px; margin-bottom:15px; position:relative;">
                            <div style="position:absolute; width:6px; height:6px; background:#333; border-radius:50%; left:-4px; top:3px;"></div>
                            <strong style="font-size:12px;">${v.vo_id}</strong>
                            <div style="color:#666; margin:2px 0;">${v.title}</div>
                            <span class="status-badge ${v.status==='approved'?'status-approved':v.status==='pending_approval'?'status-pending':'status-billed'}">${v.status.replace('_',' ')}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    
    <div class="print-footer">
        Confidential Document | Printed for Project Management Only
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    const checkOverdueVOs = () => {
        let foundOverdue = false;
        const d = new Date().toISOString().split('T')[0];
        const newVos = vos.map(v => {
            if (['billed', 'partial_payment'].includes(v.status) && v.billing?.due_date && v.billing.due_date < d) {
                foundOverdue = true;
                v.audit_log.push({ action: "STATUS_CHANGED", status: "overdue", user: user?.name, timestamp: new Date().toISOString() });
                return { ...v, status: 'overdue' };
            }
            return v;
        });
        if (foundOverdue) {
            setVos(newVos);
            toast.error("พบใบแจ้งหนี้ที่เกินกำหนดชำระแล้ว กรุณาติดตามลูกค้า", { icon: '⚠️' });
        } else {
            toast.success("ยังไม่มีใบแจ้งหนี้เกินกำหนดชำระ");
        }
    };

    const printReminderLetter = () => {
        if(!selectedVo.billing?.invoice_no) return;
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Overdue Notice - ${selectedVo.billing.invoice_no}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; margin: 50px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #ed8936; padding-bottom: 10px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; color: #c05621; }
        .box { padding: 15px; border: 1px solid #ddd; background: #fafafa; margin-bottom: 20px; }
        .text-right { text-align: right; }
        .footer-sig { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
        .sig-box { width: 40%; border-top: 1px solid #333; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>หนังสือทวงถามความคืบหน้าการชำระเงิน</h1>
        <p>(Overdue Payment Reminder)</p>
    </div>
    
    <p><strong>เรียน</strong> เจ้าของโครงการ ${project.name}</p>
    <p><strong>อ้างถึง ใบแจ้งหนี้เลขที่:</strong> ${selectedVo.billing.invoice_no} (VO: ${selectedVo.vo_id})</p>

    <div class="box">
        <p>ตามที่บริษัทฯ ได้แจ้งหนี้ค่างาน Variation Order เรื่อง: <b>${selectedVo.title}</b></p>
        <p>ขณะนี้มียอดค้างชำระ: <strong style="color:red; font-size: 16px;">${selectedVo.billing.balance.toLocaleString()} THB</strong></p>
        <p>กำหนดชำระเดิมคือวันที่: <strong>${selectedVo.billing.due_date}</strong> (ซึ่งเกินกำหนดมาแล้ว)</p>
    </div>

    <p>บริษัทฯ จึงใคร่ขอความกรุณาจากท่าน ดำเนินการชำระเงินยอดดังกล่าวโดยเร็วที่สุด เพื่อมิให้กระทบต่อความคืบหน้าของงานที่เกี่ยวข้อง</p>
    <p>หากท่านดำเนินการโอนเงินเรียบร้อยแล้ว กรุณาส่งหลักฐานการชำระเงินกลับมายังบริษัทฯ</p>

    <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; background: #fffbe6;">
        <h4>ช่องทางชำระเงิน</h4>
        <p>ธนาคารกสิกรไทย เลขที่บัญชี: 123-4-56789-0</p>
        <p>ชื่อบัญชี: บจก. ก่อสร้างดีเลิศ</p>
    </div>

    <div class="footer-sig">
        <div class="sig-box">
            <p>เจ้าหน้าที่บัญชี</p>
        </div>
        <div class="sig-box">
            <p>ผู้จัดการโครงการ (PM)</p>
        </div>
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    const printApprovalCert = () => {
        if(!selectedVo.approval?.method) return;
        const app = selectedVo.approval;
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Approval Certificate - ${selectedVo.vo_id}</title>
    <style>
        @page { size: A4 portrait; margin: 20mm; }
        body { font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; line-height: 1.5; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; color: #059669; }
        h3 { color: #065f46; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f0fdf4; color: #065f46; width: 30%; }
        .footer-sig { margin-top: 80px; display: flex; justify-content: space-between; text-align: center; }
        .sig-box { width: 30%; border-top: 1px solid #333; padding-top: 10px; }
        .print-footer { position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 5px; }
        .badge { background: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ใบรับรองการอนุมัติ (Approval Certificate)</h1>
        <p>Variation Order (VO) Approval Confirmation</p>
    </div>
    
    <h3>ข้อมูลโครงการและเอกสาร (Project & Document Info)</h3>
    <table>
        <tr><th>โครงการ (Project)</th><td>${project.name}</td></tr>
        <tr><th>ลูกค้า (Client)</th><td>${project.owner || 'N/A'}</td></tr>
        <tr><th>เลขที่ส่ง (VO No.)</th><td><strong>${selectedVo.vo_id}</strong></td></tr>
        <tr><th>ชื่องาน (Title)</th><td>${selectedVo.title}</td></tr>
        <tr><th>มูลค่ารวม (Grand Total)</th><td><strong>${selectedVo.grand_total.toLocaleString()} THB</strong></td></tr>
    </table>

    <h3>รายละเอียดการอนุมัติ (Approval Details)</h3>
    <table>
        <tr><th>สถานะอนุมัติ</th><td><span class="badge">APPROVED</span></td></tr>
        <tr><th>ช่องทางการอนุมัติ</th><td>${app.method === 'client_login' ? 'ยืนยันผ่านระบบโดยตรง (Client System Login)' : 'ออฟฟิศบันทึกแทน (Office on Behalf)'}</td></tr>
        <tr><th>ผู้อนุมัติ (Approved By)</th><td>${app.client_approved_by}</td></tr>
        <tr><th>วันที่อนุมัติ (Date)</th><td>${app.client_approved_date}</td></tr>
        ${app.evidence_type ? `<tr><th>ประเภทหลักฐาน</th><td>${app.evidence_type === 'line_chat' ? 'LINE Chat': app.evidence_type === 'email' ? 'Email' : 'Verbal/Other'}</td></tr>` : ''}
        ${app.evidence_desc ? `<tr><th>คำอธิบาย (Description)</th><td>${app.evidence_desc}</td></tr>` : ''}
    </table>

    <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <p><strong>คำประกาศ (Declaration):</strong></p>
        <p>เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นหลักฐานยืนยันว่า ลูกค้าผู้ว่าจ้างได้พิจารณาและอนุมัติให้ดำเนินการตาม Variation Order หมายเลข <strong>${selectedVo.vo_id}</strong> เรียบร้อยแล้ว ตามช่องทางและรูปแบบที่ระบุไว้ข้างต้น และยินยอมให้บริษัทฯ ดำเนินการเรียกเก็บเงินตามมูลค่างานที่ได้รับการอนุมัติ</p>
    </div>

    <div class="footer-sig">
        <div class="sig-box">
            <p>ผู้บันทึกข้อมูล (Recorded By)</p><br/><br/>
            <p>( ${app.method === 'client_login' ? 'System Auto-Record' : 'Office Staff'} )</p>
        </div>
        <div class="sig-box">
            <p>ผู้จัดการโครงการ (PM)</p><br/><br/>
            <p>( Project Manager )</p>
        </div>
        <div class="sig-box">
            <p>ลูกค้า (Client Signature)</p><br/><br/>
            <p>( ${app.client_approved_by} )</p>
            <p style="font-size:10px; color:#666; margin-top:5px;">*${app.method === 'client_login' ? 'Digital Consent Provided' : 'อ้างอิงจากหลักฐานแนบ'}</p>
        </div>
    </div>
    
    <div class="print-footer">
        เอกสารอ้างอิง: ${selectedVo.vo_id} | จัดทำวันที่: ${new Date().toISOString().split('T')[0]} | Certificate of Approval
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    const printVO = () => {
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Variation Order - ${selectedVo.vo_id}</title>
    <style>
        @page { size: A4 portrait; margin: 20mm; }
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .text-right { text-align: right; }
        .footer-sig { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
        .sig-box { width: 40%; border-top: 1px solid #333; padding-top: 10px; }
        .print-footer { position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Variation Order (VO)</h1>
        <p>Project: ${project.name} | VO No: ${selectedVo.vo_id} | Date: ${selectedVo.created_date}</p>
    </div>
    
    <div>
        <p><strong>Title:</strong> ${selectedVo.title}</p>
        <p><strong>Description:</strong> ${selectedVo.description}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:10%">Item</th>
                <th style="width:40%">Description</th>
                <th style="width:10%" class="text-right">Qty</th>
                <th style="width:10%" class="text-right">Unit</th>
                <th style="width:15%" class="text-right">Unit Price</th>
                <th style="width:15%" class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${selectedVo.items.map((it:any) => `
            <tr>
                <td>${it.item_no}</td>
                <td>${it.description}</td>
                <td class="text-right">${it.quantity}</td>
                <td class="text-right">${it.unit}</td>
                <td class="text-right">${it.unit_price.toLocaleString()}</td>
                <td class="text-right">${it.amount.toLocaleString()}</td>
            </tr>
            `).join('')}
        </tbody>
        <tfoot>
            <tr><th colspan="5" class="text-right">Subtotal ${selectedVo.tax_settings?.vat_exempt ? '(VAT Exempt)' : ''}</th><th class="text-right">${selectedVo.subtotal.toLocaleString()}</th></tr>
            ${selectedVo.tax_settings?.vat_exempt ? 
              `<tr><td colspan="6" class="text-right" style="color:red; font-size:10px;">*เหตุผลยกเว้น VAT: ${selectedVo.tax_settings.vat_exempt_reason || '-'}</td></tr>` : 
              `<tr><th colspan="5" class="text-right">VAT (7%)</th><th class="text-right">${(selectedVo.tax_settings?.vat_amount || 0).toLocaleString()}</th></tr>`
            }
            <tr><th colspan="5" class="text-right">Grand Total</th><th class="text-right">${selectedVo.grand_total.toLocaleString()}</th></tr>
            ${selectedVo.tax_settings?.wht_amount > 0 ? 
              `<tr><th colspan="5" class="text-right" style="color:#d97706;">หักภาษี ณ ที่จ่าย WHT (${selectedVo.tax_settings.withholding_tax}%)</th><th class="text-right" style="color:#d97706;">-${selectedVo.tax_settings.wht_amount.toLocaleString()}</th></tr>
               <tr><th colspan="5" class="text-right" style="font-size:14px; background:#e5e7eb;">NET PAYABLE (ยอดชำระสุทธิ)</th><th class="text-right" style="font-size:14px; background:#e5e7eb;">${(selectedVo.net_payable || selectedVo.grand_total).toLocaleString()}</th></tr>` : 
               `<tr><th colspan="5" class="text-right" style="font-size:14px; background:#e5e7eb;">NET PAYABLE (ยอดชำระสุทธิ)</th><th class="text-right" style="font-size:14px; background:#e5e7eb;">${selectedVo.grand_total.toLocaleString()}</th></tr>`
            }
            ${selectedVo.tax_settings?.wht_amount > 0 ? `<tr><td colspan="6" class="text-right" style="font-size:10px; color:gray;">โปรดออกหนังสือรับรองการหักภาษี ณ ที่จ่าย (Withholding Tax Certificate) ให้แก่บริษัทฯ</td></tr>` : ''}
        </tfoot>
    </table>

    <table style="width: 50%; margin-left: auto; margin-top: 20px;">
        <tr><th class="text-left">มูลค่าสัญญาเดิม (Original Contract)</th><td class="text-right">${selectedVo.contract_before?.toLocaleString()}</td></tr>
        <tr><th class="text-left">มูลค่าเพิ่ม-ลด (VO Amount)</th><td class="text-right">${selectedVo.vo_type === 'VO-' ? '-' : ''}${selectedVo.grand_total?.toLocaleString()}</td></tr>
        <tr><th class="text-left">มูลค่าสัญญาใหม่ (New Contract)</th><td class="text-right"><strong>${selectedVo.contract_after?.toLocaleString()}</strong></td></tr>
    </table>

    <div class="footer-sig">
        <div class="sig-box">
            <p>Prepared By</p><br/><br/>
            <p>( ${selectedVo.created_by.toUpperCase()} )</p>
        </div>
        <div class="sig-box">
            <p>Approved By</p><br/><br/>
            <p>( Client / Owner )</p>
        </div>
    </div>
    
    <div class="print-footer">
        เอกสารอ้างอิง: ${selectedVo.vo_id} | จัดทำวันที่: ${new Date().toISOString().split('T')[0]} | เอกสารนี้มีผลเมื่อได้รับการลงนามจากทั้งสองฝ่ายเท่านั้น
    </div>
</body>
</html>`;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[500px]">
           
           {activeTab === 'list' && (
               <>
               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div>
                     <h2 className="text-xl font-bold text-gray-900">ทะเบียนงานเพิ่ม-ลด (VO)</h2>
                     <div className="flex text-sm text-gray-500 mt-2 space-x-6">
                         <span className="flex items-center"><Layers size={14} className="mr-1"/> All VOs: {vos.length}</span>
                         <span className="flex items-center text-emerald-600"><CheckCircle size={14} className="mr-1"/> Approved: {vos.filter(v=>v.status === 'approved').length}</span>
                         <span className="flex items-center text-yellow-600"><Clock size={14} className="mr-1"/> Pending: {vos.filter(v=>v.status === 'pending_approval').length}</span>
                     </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                      <button onClick={() => setActiveTab('dashboard')} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-100 border border-blue-200">
                         <BarChart3 size={16} /> VO Dashboard
                      </button>
                      <button onClick={() => setActiveTab('monthly_report')} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 border border-emerald-200">
                         <FileText size={16} /> Monthly Report
                      </button>
                      <button onClick={() => setActiveTab('pending_monitor')} className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-100 border border-yellow-200">
                         <Clock size={16} /> ตรวจสถานะรอลูกค้า
                      </button>
                      <button onClick={() => setActiveTab('task_lock_status')} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 border border-gray-300">
                         <Lock size={16} /> สถานะงาน Gantt
                      </button>
                      <button onClick={checkOverdueVOs} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 border border-red-200">
                         <AlertTriangle size={16} /> ตรวจสอบเกินกำหนดชำระ
                      </button>
                      <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2">
                         <Plus size={16} /> สร้าง VO ใบใหม่
                      </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                       <thead>
                           <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                               <th className="py-3 px-4 text-left font-semibold">VO No.</th>
                               <th className="py-3 px-4 text-center font-semibold">Type</th>
                               <th className="py-3 px-4 text-left font-semibold">Description</th>
                               <th className="py-3 px-4 text-right font-semibold">Amount (THB)</th>
                               <th className="py-3 px-4 text-center font-semibold">Status</th>
                               <th className="py-3 px-4 text-center font-semibold">Gantt Lock</th>
                               <th className="py-3 px-4 pl-8 font-semibold"></th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {vos.map(vo => (
                               <tr key={vo.vo_id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => viewDetail(vo)}>
                                   <td className="py-4 px-4">
                                       <div className="font-bold text-gray-900">{vo.vo_id} {vo.vo_revision > 0 && <span className="text-brand-500 text-xs ml-1">R{vo.vo_revision}</span>}</div>
                                       <div className="text-xs text-gray-500 mt-1">{vo.created_date}</div>
                                   </td>
                                   <td className="py-4 px-4 text-center">
                                       <span className={`px-2 py-1 text-xs font-bold rounded border ${getTypeStyle(vo.vo_type)}`}>{vo.vo_type}</span>
                                   </td>
                                   <td className="py-4 px-4">
                                       <div className="font-semibold text-gray-800">{vo.title}</div>
                                       <div className="text-xs text-gray-500 max-w-[200px] truncate">{vo.description}</div>
                                   </td>
                                   <td className="py-4 px-4 text-right">
                                       <div className="font-mono font-bold text-gray-900">{vo.grand_total.toLocaleString()}</div>
                                       <div className="text-xs text-gray-400">excl VAT: {vo.subtotal.toLocaleString()}</div>
                                   </td>
                                   <td className="py-4 px-4 text-center">
                                       <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${getStatusStyle(vo.status)}`}>
                                           {vo.status.replace('_', ' ')}
                                       </span>
                                   </td>
                                   <td className="py-4 px-4 text-center">
                                       {vo.gantt_locked ? <span className="flex items-center justify-center text-red-500"><Lock size={14} className="mr-1"/> Locked</span> : <span className="flex items-center justify-center text-emerald-500"><CheckCircle size={14} className="mr-1"/> Unlocked</span>}
                                   </td>
                                   <td className="py-4 px-4 text-right">
                                       <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><Search size={16}/></button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
               </>
           )}

           {activeTab === 'create' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center mb-4 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                    <h3 className="font-bold text-xl mb-6 flex items-center"><Plus size={20} className="mr-2 text-brand-600"/> สร้างรายการ Variation Order (VO)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">VO Type</label>
                            <select className="w-full form-input bg-white" value={voForm.vo_type} onChange={e => setVoForm({...voForm, vo_type: e.target.value})}>
                                <option value="VO+">VO+ (งานเพิ่ม) ลดมูลค่าสัญญา</option>
                                <option value="VO-">VO- (งานลด) ลดมูลค่าสัญญา</option>
                                <option value="VO0">VO0 (งานสับเปลี่ยน)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input type="text" className="w-full form-input bg-white" placeholder="e.g. เพิ่มผนังเบากั้นห้อง" value={voForm.title} onChange={e => setVoForm({...voForm, title: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description / เหตุผล</label>
                            <textarea className="w-full form-input bg-white h-24" placeholder="ระบุสาเหตุการทำ VO" value={voForm.description} onChange={e => setVoForm({...voForm, description: e.target.value})} />
                        </div>

                        {/* Items */}
                        <div className="md:col-span-2 mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">รายการ (Items)</label>
                            <table className="w-full text-sm border bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-2 text-left">No.</th>
                                        <th className="p-2 text-left">รายละเอียด</th>
                                        <th className="p-2 w-20 text-center">จำนวน</th>
                                        <th className="p-2 w-24 text-center">หน่วย</th>
                                        <th className="p-2 w-32 text-right">ราคาต่อหน่วย</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {voForm.items.map((it:any, idx:number) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2 text-center text-gray-500">{it.item_no}</td>
                                            <td className="p-2"><input type="text" className="w-full border-none focus:ring-0 text-sm" placeholder="รายละเอียดรายการ" value={it.description} onChange={e => {
                                                const newItems = [...voForm.items]; newItems[idx].description = e.target.value; setVoForm({...voForm, items: newItems});
                                            }} /></td>
                                            <td className="p-2"><input type="number" className="w-full border-none focus:ring-0 text-sm text-center" value={it.quantity} onChange={e => {
                                                const newItems = [...voForm.items]; newItems[idx].quantity = e.target.value; setVoForm({...voForm, items: newItems});
                                            }} /></td>
                                            <td className="p-2"><input type="text" className="w-full border-none focus:ring-0 text-sm text-center" placeholder="เช่น ชุด" value={it.unit} onChange={e => {
                                                const newItems = [...voForm.items]; newItems[idx].unit = e.target.value; setVoForm({...voForm, items: newItems});
                                            }} /></td>
                                            <td className="p-2"><input type="number" className="w-full border-none focus:ring-0 text-sm text-right font-mono" value={it.unit_price} onChange={e => {
                                                const newItems = [...voForm.items]; newItems[idx].unit_price = e.target.value; setVoForm({...voForm, items: newItems});
                                            }} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={() => setVoForm({...voForm, items: [...voForm.items, {item_no: voForm.items.length+1, description: '', unit: '', quantity: 1, unit_price: 0, amount: 0}]})} 
                                    className="mt-2 text-brand-600 text-sm font-semibold flex items-center hover:text-brand-800">
                                <Plus size={16} className="mr-1"/> เพิ่มรายการ
                            </button>
                        </div>

                        {/* Tax Settings */}
                        <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-sm font-bold text-gray-800 mb-4">การตั้งค่าภาษี (Tax Settings)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 cursor-pointer">
                                        <input type="checkbox" className="mr-2 rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                                               checked={voForm.tax_settings.vat_exempt} 
                                               onChange={e => setVoForm({...voForm, tax_settings: {...voForm.tax_settings, vat_exempt: e.target.checked}})} />
                                        กรณีได้รับการยกเว้น VAT (VAT Exempt)
                                    </label>
                                    {voForm.tax_settings.vat_exempt && (
                                        <input type="text" className="w-full form-input bg-white text-sm mt-2" placeholder="เหตุผลที่ได้รับการยกเว้น (เช่น บริการพิเศษ)" 
                                               value={voForm.tax_settings.vat_exempt_reason || ''} 
                                               onChange={e => setVoForm({...voForm, tax_settings: {...voForm.tax_settings, vat_exempt_reason: e.target.value}})} />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">หักภาษี ณ ที่จ่าย (Withholding Tax)</label>
                                    <select className="w-full form-input bg-white text-sm" 
                                            value={voForm.tax_settings.withholding_tax} 
                                            onChange={e => setVoForm({...voForm, tax_settings: {...voForm.tax_settings, withholding_tax: parseInt(e.target.value)}})}>
                                        <option value={0}>ไม่มีการหัก ณ ที่จ่าย (0%)</option>
                                        <option value={1}>ค่าขนส่ง / อื่นๆ (1%)</option>
                                        <option value={3}>ค่าบริการ / รับจ้างทำของ (3%)</option>
                                        <option value={5}>ค่าเช่า (5%)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                        <button onClick={() => setActiveTab('list')} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors">Cancel</button>
                        <button onClick={handleCreateVO} className="btn-primary">บันทึก Draft</button>
                    </div>
               </div>
           )}

           {activeTab === 'detail' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                   <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                       <div>
                           <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center mb-2 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                           <div className="flex items-center gap-3">
                               <h2 className="text-2xl font-black text-gray-900">{selectedVo.vo_id}</h2>
                               <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusStyle(selectedVo.status)}`}>{selectedVo.status.replace('_', ' ')}</span>
                               <span className={`px-2 py-1 text-xs font-bold rounded border ${getTypeStyle(selectedVo.vo_type)}`}>{selectedVo.vo_type}</span>
                           </div>
                           <p className="text-lg font-medium text-gray-700 mt-1">{selectedVo.title}</p>
                       </div>
                       <div className="flex gap-2 text-sm flex-wrap justify-end">
                           <button onClick={printVO} className="btn-secondary flex items-center gap-2"><Printer size={16}/> Print PDF</button>
                           {selectedVo.approval?.method && (
                               <button onClick={printApprovalCert} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-100 border border-emerald-200">
                                   <FileText size={16}/> Approval Cert
                               </button>
                           )}
                           {['draft', 'pending_approval', 'approved', 'rejected', 'expired'].includes(selectedVo.status) && (
                               <button onClick={cancelVO} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-100 border border-red-200">
                                   ยกเลิก VO
                               </button>
                           )}
                           {['rejected', 'draft', 'pending_approval'].includes(selectedVo.status) && user?.role !== 'client' && user?.role !== 'engineer' && (
                               <button onClick={reviseVO} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-100 border border-blue-200">
                                   สร้างฉบับแก้ไข (Revise)
                               </button>
                           )}
                           {selectedVo.status === 'draft' && user?.role !== 'client' && user?.role !== 'engineer' && (
                               <button onClick={() => setActiveTab('submit')} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700"><CheckCircle size={16}/> Submit to Client</button>
                           )}
                           {selectedVo.status === 'pending_approval' && user?.role === 'client' && (
                               <>
                                   <button onClick={approveDirect} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-md">
                                       <CheckCircle size={16}/> อนุมัติแบบฟอร์มนี้
                                   </button>
                                   <button onClick={rejectDirect} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 shadow-md">
                                       ปฏิเสธ / ส่งกลับแก้ไข
                                   </button>
                               </>
                           )}
                           {selectedVo.status === 'pending_approval' && user?.role !== 'client' && user?.role !== 'engineer' && (
                               <button onClick={() => setActiveTab('approve')} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700"><CheckSquare size={16}/> บันทึกรับรองอนุมัติแทนลูกค้า</button>
                           )}
                           {selectedVo.status === 'approved' && user?.role !== 'client' && user?.role !== 'engineer' && (
                               <button onClick={() => setActiveTab('create_invoice')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md"><FileText size={16}/> สร้างใบแจ้งหนี้ (Invoice)</button>
                           )}
                           {['billed', 'partial_payment'].includes(selectedVo.status) && user?.role !== 'client' && (
                               <button onClick={() => setActiveTab('payment')} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700"><CreditCard size={16}/> บันทึกรับชำระเงิน</button>
                           )}
                           {['billed', 'partial_payment', 'overdue'].includes(selectedVo.status) && selectedVo.gantt_locked && (
                               <button onClick={() => setActiveTab('pm_override')} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-600"><Unlock size={16}/> PM Override</button>
                           )}
                           {['billed', 'partial_payment', 'paid', 'overdue'].includes(selectedVo.status) && (
                               <button onClick={printInvoice} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 border border-gray-300"><Printer size={16}/> พิมพ์ใบแจ้งหนี้</button>
                           )}
                           {selectedVo.status === 'paid' && (
                               <button onClick={printReceipt} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-100 border border-purple-200"><Printer size={16}/> พิมพ์ใบเสร็จ</button>
                           )}
                           {selectedVo.status === 'overdue' && (
                               <button onClick={printReminderLetter} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-100 border border-red-200"><FileText size={16}/> แจ้งหนี้ค้างชำระ (Overdue)</button>
                           )}
                       </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="md:col-span-2 p-6 bg-gray-50 rounded-xl border border-gray-200">
                           <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs border-b border-gray-200 pb-2">Items</h4>
                           <table className="w-full text-sm text-left">
                               <thead className="text-gray-500 border-b border-gray-200">
                                   <tr>
                                       <th className="py-2">No.</th>
                                       <th className="py-2">Description</th>
                                       <th className="py-2 text-right">Qty</th>
                                       <th className="py-2 text-right">Unit Price</th>
                                       <th className="py-2 text-right">Amount</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100 font-mono">
                                   {selectedVo.items.map((it:any) => (
                                       <tr key={it.item_no}>
                                           <td className="py-3">{it.item_no}</td>
                                           <td className="py-3 font-sans text-gray-800">{it.description}</td>
                                           <td className="py-3 text-right">{it.quantity} {it.unit}</td>
                                           <td className="py-3 text-right text-gray-500">{it.unit_price.toLocaleString()}</td>
                                           <td className="py-3 text-right font-bold text-gray-900">{it.amount.toLocaleString()}</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                           <div className="mt-4 flex flex-col items-end pt-4 border-t border-gray-200 text-sm font-mono">
                               <div className="flex justify-between w-64 mb-1">
                                   <span className="text-gray-600">Subtotal:</span>
                                   <span>{selectedVo.subtotal.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between w-64 mb-1 border-b border-gray-200 pb-2">
                                   <span className="text-gray-600">VAT ({(selectedVo.tax_settings.vat_rate)}%):</span>
                                   <span>{selectedVo.tax_settings.vat_amount.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between w-64 text-base font-bold text-gray-800 pt-2">
                                   <span>GRAND TOTAL:</span>
                                   <span>{selectedVo.grand_total.toLocaleString()} THB</span>
                               </div>
                               {selectedVo.tax_settings?.wht_amount > 0 && (
                                   <div className="flex justify-between w-64 mt-1 text-orange-600">
                                       <span className="font-sans text-xs">หักภาษี ณ ที่จ่าย ({selectedVo.tax_settings.withholding_tax}%):</span>
                                       <span>-{selectedVo.tax_settings.wht_amount.toLocaleString()}</span>
                                   </div>
                               )}
                               <div className="flex justify-between w-64 text-lg font-black text-brand-700 pt-2 border-t border-gray-200 mt-2">
                                   <span>NET PAYABLE:</span>
                                   <span>{(selectedVo.net_payable || selectedVo.grand_total).toLocaleString()} THB</span>
                               </div>
                           </div>
                       </div>
                       
                       <div className="space-y-4">
                           <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                               <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Contract Value Impact</h4>
                               <div className="flex justify-between text-sm mb-1 text-gray-500"><span>Before:</span> <span>{selectedVo.contract_before.toLocaleString()}</span></div>
                               <div className="flex justify-between text-sm font-bold text-brand-700"><span>After:</span> <span>{selectedVo.contract_after.toLocaleString()}</span></div>
                           </div>
                           <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                               <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Summary Info</h4>
                               <div className="text-sm space-y-2">
                                   <p><span className="text-gray-500 block text-xs">Description:</span> {selectedVo.description}</p>
                                   <p><span className="text-gray-500 block text-xs">Date Created:</span> {selectedVo.created_date}</p>
                                   <p><span className="text-gray-500 block text-xs">Deadline:</span> <span className="text-red-500 font-bold">{selectedVo.approval_deadline}</span></p>
                                   {selectedVo.cancellation_reason && (
                                       <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-800">
                                            <span className="font-bold text-xs uppercase block">Cancellation Reason:</span>
                                            {selectedVo.cancellation_reason}
                                       </div>
                                   )}
                                   {selectedVo.approval?.method && (
                                       <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-800 text-xs">
                                            <span className="font-bold uppercase block mb-1">Approval Evidence:</span>
                                            <p><strong>Approved By:</strong> {selectedVo.approval.client_approved_by}</p>
                                            <p><strong>Method:</strong> {selectedVo.approval.method === 'client_login' ? 'Client Login (System click)' : 'Office On Behalf'}</p>
                                            {selectedVo.approval.evidence_desc && <p><strong>Desc:</strong> {selectedVo.approval.evidence_desc}</p>}
                                            {selectedVo.approval.evidence_file && <p><strong>Attachment:</strong> <a href="#" className="underline text-emerald-600">{selectedVo.approval.evidence_file}</a></p>}
                                       </div>
                                   )}
                               </div>
                           </div>
                           
                           <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                               <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs border-b border-gray-100 pb-2">Audit Trail</h4>
                               <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                   {[...selectedVo.audit_log].reverse().map((log: any, i: number) => (
                                       <div key={i} className="flex gap-3 text-sm">
                                           <div className="flex flex-col items-center">
                                               <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                                               {i !== selectedVo.audit_log.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
                                           </div>
                                           <div className="pb-4">
                                               <p className="font-bold text-gray-800 text-xs">
                                                   {log.action} <span className="text-gray-400 font-normal">by {log.user || 'System'}</span>
                                               </p>
                                               <p className="text-[10px] text-gray-500 mb-1">{new Date(log.timestamp).toLocaleString()}</p>
                                               {log.details && <p className="text-gray-600 bg-gray-50 p-2 rounded text-xs mt-1 border border-gray-100">{log.details}</p>}
                                               {log.status && <span className={'inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded ' + getStatusStyle(log.status)}>{log.status.replace('_', ' ')}</span>}
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'submit' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('detail')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับ</button>
                    
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><CheckCircle className="mr-2 text-brand-600"/> PM Review & Submit to Client</h2>
                        <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">ตรวจสอบความถูกต้องก่อนส่ง VO: <strong className="text-brand-600">{selectedVo.vo_id}</strong> ให้ลูกค้าอนุมัติ</p>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            if(!e.target.c1.checked || !e.target.c2.checked || !e.target.c3.checked || !e.target.c4.checked || !e.target.c5.checked) {
                                toast.error("กรุณาตรวจสอบและติ๊กครบทุกข้อ");
                                return;
                            }
                            submitToClient();
                            setActiveTab('detail');
                        }}>
                            <div className="space-y-4 text-sm font-medium">
                                <h3 className="font-bold text-gray-900 mb-2">PM Checklist</h3>
                                <label className="flex items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="c1" className="mt-1 mr-3" required />
                                    <span>[✓] รายการและราคาถูกต้องครบถ้วน</span>
                                </label>
                                <label className="flex items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="c2" className="mt-1 mr-3" required />
                                    <span>[✓] VAT และ grand_total ถูกต้อง ({selectedVo.grand_total.toLocaleString()} THB)</span>
                                </label>
                                <label className="flex items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="c3" className="mt-1 mr-3" required />
                                    <span>[✓] linked_tasks ระบุครบ ({selectedVo.linked_tasks.join(', ') || 'ไม่มี'})</span>
                                </label>
                                <label className="flex items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="c4" className="mt-1 mr-3" required />
                                    <span>[✓] แนบเอกสารประกอบแล้ว (ถ้ามี)</span>
                                </label>
                                <label className="flex items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="c5" className="mt-1 mr-3" required />
                                    <span>[✓] ตรวจสอบ Contract After สมเหตุสมผล ({selectedVo.contract_after.toLocaleString()} THB)</span>
                                </label>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button type="button" onClick={() => setActiveTab('detail')} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200">ยกเลิก</button>
                                <button type="submit" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 shadow-sm flex items-center"><CheckCircle size={16} className="mr-2"/> ยืนยันข้อมูลถูกต้องและเปลี่ยนสถานะเป็นรออนุมัติ</button>
                            </div>
                        </form>
                    </div>
               </div>
           )}

           {activeTab === 'approve' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('detail')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับ</button>
                    
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><CheckSquare className="mr-2 text-emerald-600"/> บันทึกอนุมัติ VO (Approve)</h2>
                        <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">ระบุรายละเอียดการอนุมัติสำหรับ VO ID: <strong className="text-brand-600">{selectedVo.vo_id}</strong> ยอดเงิน <strong className="font-mono">{selectedVo.grand_total.toLocaleString()} THB</strong></p>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            approveOnBehalf(e.target.channel.value, e.target.evidence_desc.value, e.target.evidence_file.files[0]);
                        }}>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <label className="flex items-start">
                                        <input type="radio" name="approve_method" className="mt-1" defaultChecked />
                                        <div className="ml-3">
                                            <span className="block font-bold text-emerald-900">รับรองแทนลูกค้า (Office on Behalf)</span>
                                            <span className="text-emerald-700 text-xs">ลูกค้าตอบกลับทางแพลตฟอร์มอื่น (เช่น ส่ง Line ยืนยัน) เจ้าหน้าที่บันทึกแทนพร้อมแนบหลักฐาน</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">ช่องทางที่ลูกค้ายืนยัน</label><select name="channel" className="w-full form-input"><option value="Line">Line</option><option value="Email">Email</option><option value="Verbal">Verbal / Phone</option></select></div>
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">วันที่ลูกค้ายืนยัน</label><input type="date" className="w-full form-input" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">คำอธิบายหลักฐาน</label>
                                    <textarea name="evidence_desc" className="w-full form-input h-20 bg-white" placeholder="เช่น ลูกค้าพิมพ์ตอบตกลงในกลุ่ม Line เวลา 14:00 น. คุณสมหญิงบอก 'โอเคเลยครับ'"></textarea>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">แนบภาพหลักฐาน (Screenshot Line/Email)</label>
                                    <input type="file" name="evidence_file" accept="image/*,.pdf" className="w-full form-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer text-gray-500 bg-white" />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-sm">บันทึกยืนยันและเปลี่ยนสถานะ</button>
                            </div>
                        </form>
                    </div>
               </div>
           )}

           {activeTab === 'create_invoice' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('detail')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับ</button>
                    
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><FileText className="mr-2 text-blue-600"/> ออกใบแจ้งหนี้ (Create Invoice)</h2>
                        <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">ระบบจะสร้างใบแจ้งหนี้อัตโนมัติ สำหรับ VO ID: <strong className="text-brand-600">{selectedVo.vo_id}</strong> ยอดเงินเรียกเก็บ <strong className="font-mono">{selectedVo.grand_total.toLocaleString()} THB</strong></p>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            createInvoice(parseInt(e.target.due_days.value));
                        }}>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">เลขที่ใบแจ้งหนี้</label><input type="text" className="w-full form-input" defaultValue="จัดเรียงอัตโนมัติ (เช่น INV-2568-001)" disabled /></div>
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">กำหนดชำระเงิน (วัน)</label><select name="due_days" className="w-full form-input"><option value="7">7 วันทำการ</option><option value="15">15 วันทำการ</option><option value="30">30 วันทำการ</option></select></div>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mt-4 text-blue-800 text-xs text-center border-dashed">
                                    ใบแจ้งหนี้จะระบุช่องทางการชำระ (เช่น เลขที่บัญชีบริษัท) ตามที่ได้ตั้งค่าไว้ในระบบ Finance โดยอัตโนมัติ แบบฟอร์ม A4 พร้อมพิมพ์
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm">บันทึกและสร้างใบแจ้งหนี้ (Billed)</button>
                            </div>
                        </form>
                    </div>
               </div>
           )}

           {activeTab === 'payment' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('detail')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับ</button>
                    
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><CreditCard className="mr-2 text-purple-600"/> บันทึกรับชำระเงิน VO</h2>
                        <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">บันทึกการรับชำระสำหรับ VO ID: <strong className="text-brand-600">{selectedVo.vo_id}</strong> ยอดคงเหลือ <strong className="font-mono text-red-600">{selectedVo.billing?.balance?.toLocaleString()} THB</strong></p>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            recordPayment(parseFloat(e.target.amount.value), e.target.method.value, e.target.ref.value);
                        }}>
                            <div className="space-y-4 text-sm font-medium">
                                <div>
                                    <label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">ยอดเงินที่ได้รับ (THB)</label>
                                    <input type="number" name="amount" className="w-full form-input text-lg font-mono" defaultValue={selectedVo.billing?.balance} max={selectedVo.billing?.balance} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">ช่องทางการชำระ</label><select name="method" className="w-full form-input"><option value="bank_transfer">โอนเงินธนาคาร</option><option value="cheque">เช็ค</option><option value="cash">เงินสด</option></select></div>
                                    <div><label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">เลขที่อ้างอิง / สลิป</label><input type="text" name="ref" className="w-full form-input" required /></div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700 mb-1 text-xs uppercase tracking-wide">แนบหลักฐานการโอนเงิน (สลิป/ใบเสร็จ)</label>
                                    <input type="file" accept="image/*,.pdf" className="w-full form-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer text-gray-500 bg-white" />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 shadow-sm">บันทึกการชำระเงิน</button>
                            </div>
                        </form>
                    </div>
               </div>
           )}

           {activeTab === 'pm_override' && selectedVo && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('detail')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับ</button>
                    
                    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><Unlock className="mr-2 text-orange-500"/> PM Override ปลดล็อกงาน</h2>
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                            <p className="text-sm text-orange-800 font-bold mb-1">คำเตือน: การสั่งปลดล็อกงานก่อนชำระเงินครบ</p>
                            <p className="text-xs text-orange-700">การกระทำนี้จะปลดล็อกงานใน Gantt Chart เพื่อให้ทีมสามารถเริ่มงานได้แม้ว่าจะยังได้รับชำระเงินไม่ครบถ้วนตามสัญญา VO</p>
                        </div>
                        
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-600">VO ID:</span> <strong className="text-gray-900">{selectedVo.vo_id}</strong></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-600">ยอดเงินเรียกเก็บ:</span> <strong className="text-gray-900">{selectedVo.billing?.amount_due?.toLocaleString()} THB</strong></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-600">ยอดเงินที่ได้รับแล้ว:</span> <strong className="text-emerald-600">{selectedVo.billing?.amount_paid?.toLocaleString()} THB</strong></div>
                            <div className="flex justify-between"><span className="text-gray-600">ยอดเงินคงค้าง:</span> <strong className="text-red-500">{selectedVo.billing?.balance?.toLocaleString()} THB</strong></div>
                        </div>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            if(e.target.risk_ack.checked) {
                                pmOverrideUnlock(e.target.reason.value);
                            } else {
                                toast.error("กรุณายอมรับความเสี่ยงก่อนดำเนินการ");
                            }
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1 text-xs font-bold uppercase tracking-wide">เหตุผลที่จำเป็นต้องเริ่มงานก่อน (บังคับ)</label>
                                    <textarea name="reason" className="w-full form-input h-24" placeholder="เช่น ลูกค้ายืนยันแล้วว่าจะโอนเงินภายในวันพรุ่งนี้ และงานเร่งด่วนมาก" required></textarea>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded">
                                    <label className="flex items-start cursor-pointer">
                                        <input type="checkbox" name="risk_ack" className="mt-1 mr-3" required />
                                        <span className="text-sm font-medium text-gray-800">ข้าพเจ้าในฐานะ PM ขอรับรองและยอมรับความเสี่ยงที่อาจเกิดขึ้นจากการเริ่มงานก่อนได้รับชำระเงินครบถ้วน</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 shadow-sm flex items-center"><Unlock size={16} className="mr-2" /> ยืนยันปลดล็อก PM Override</button>
                            </div>
                        </form>
                    </div>
               </div>
           )}

           {activeTab === 'task_lock_status' && (
               <div className="animate-in fade-in duration-300">
                    <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center mb-6 hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center"><Lock className="mr-2 text-gray-600"/> ตรวจสอบสถานะการปลดล็อกงาน (Site Engineer View)</h2>
                        <p className="text-gray-600">รายการงานใน Gantt Chart ที่เชื่อมโยงกับ VO แยกตามสถานะการปลดล็อก</p>
                    </div>

                    <div className="space-y-6">
                        {/* Group 1: Ready */}
                        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
                            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-200 flex justify-between items-center">
                                <h3 className="font-bold text-emerald-900 flex items-center"><Unlock size={16} className="mr-2"/> พร้อมดำเนินการ (Unlocked)</h3>
                                <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{vos.filter(v => v.status === 'paid').length} รายการ</span>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-emerald-50/50 text-emerald-700"><tr><th className="p-3 text-left">VO ID</th><th className="p-3 text-left">ชื่องาน</th><th className="p-3 text-left">ผู้รับผิดชอบ</th><th className="p-3 text-left">สถานะ</th></tr></thead>
                                <tbody>
                                    {vos.filter(v => v.status === 'paid' || !v.gantt_locked).map(v => (
                                        <tr key={v.vo_id} className="border-b border-gray-100 last:border-0"><td className="p-3 font-mono">{v.vo_id}</td><td className="p-3">{v.title}</td><td className="p-3">Site Engineer</td><td className="p-3"><span className="text-emerald-600 font-bold">เริ่มงานได้</span></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Group 2: Waiting for payment */}
                        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden">
                            <div className="bg-purple-50 px-4 py-3 border-b border-purple-200 flex justify-between items-center">
                                <h3 className="font-bold text-purple-900 flex items-center"><Clock size={16} className="mr-2"/> รอชำระเงิน (Billed / Partial)</h3>
                                <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">{vos.filter(v => ['billed', 'partial_payment', 'overdue'].includes(v.status) && v.gantt_locked).length} รายการ</span>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-purple-50/50 text-purple-700"><tr><th className="p-3 text-left">VO ID</th><th className="p-3 text-left">ชื่องาน</th><th className="p-3 text-right">ยอดค้างชำระ</th><th className="p-3 text-left">กำหนดชำระ</th></tr></thead>
                                <tbody>
                                    {vos.filter(v => ['billed', 'partial_payment', 'overdue'].includes(v.status) && v.gantt_locked).map(v => (
                                        <tr key={v.vo_id} className="border-b border-gray-100 last:border-0"><td className="p-3 font-mono">{v.vo_id}</td><td className="p-3">{v.title}</td><td className="p-3 text-right font-mono text-red-500">{v.billing?.balance?.toLocaleString()}</td><td className="p-3">{(v.billing?.due_date)} {v.status === 'overdue' && <span className="text-red-500 font-bold ml-2">(เกินกำหนด)</span>}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Group 3: Pending Approval */}
                        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
                            <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-200 flex justify-between items-center">
                                <h3 className="font-bold text-yellow-900 flex items-center"><Clock size={16} className="mr-2"/> รออนุมัติจากลูกค้า (Pending Approval)</h3>
                                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{vos.filter(v => v.status === 'pending_approval').length} รายการ</span>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-yellow-50/50 text-yellow-700"><tr><th className="p-3 text-left">VO ID</th><th className="p-3 text-left">ชื่องาน</th><th className="p-3 text-left">วันที่ส่ง</th><th className="p-3 text-left">กำหนดอนุมัติ</th></tr></thead>
                                <tbody>
                                    {vos.filter(v => v.status === 'pending_approval').map(v => (
                                        <tr key={v.vo_id} className="border-b border-gray-100 last:border-0"><td className="p-3 font-mono">{v.vo_id}</td><td className="p-3">{v.title}</td><td className="p-3">{v.created_date}</td><td className="p-3">{v.approval_deadline}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
               </div>
           )}

           {activeTab === 'dashboard' && (
               <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center"><BarChart3 className="mr-2 text-brand-600"/> VO Dashboard</h2>
                        <button onClick={printVODashboard} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 border border-gray-300"><Printer size={16}/> Print A3 Dashboard</button>
                    </div>

                    {/* A. KPI SUMMARY */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Contract Value</h4>
                            <div className="text-xl font-black text-gray-900">{project.budget?.toLocaleString() || 0}</div>
                            <div className="text-[11px] text-emerald-600 font-bold mt-1">Adj: {vos.length > 0 ? vos[vos.length-1].contract_after.toLocaleString() : (project.budget?.toLocaleString() || 0)}</div>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total VOs</h4>
                            <div className="text-xl font-black text-gray-900">{vos.length} <span className="text-sm font-normal text-gray-500">VOs</span></div>
                            <div className="flex gap-2 text-[11px] font-bold mt-1">
                                <span className="text-emerald-600">+{vos.filter(v=>v.vo_type==='VO+').length}</span>
                                <span className="text-red-500">-{vos.filter(v=>v.vo_type==='VO-').length}</span>
                                <span className="text-gray-500">0:{vos.filter(v=>v.vo_type==='VO0').length}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Pipeline</h4>
                            <div className="flex flex-col gap-1 mt-2 text-[11px] font-bold text-gray-600">
                                <div className="flex justify-between"><span>Pending / Draft</span> <span>{vos.filter(v=>['draft','pending_approval'].includes(v.status)).length}</span></div>
                                <div className="flex justify-between text-emerald-600"><span>Approved</span> <span>{vos.filter(v=>v.status==='approved').length}</span></div>
                                <div className="flex justify-between text-blue-600"><span>Billed / Paid</span> <span>{vos.filter(v=>['billed','partial_payment','paid'].includes(v.status)).length}</span></div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Locked Tasks</h4>
                            <div className="text-2xl font-black leading-none text-orange-500 mt-2">{vos.filter(v=>v.gantt_locked).length}</div>
                            <div className="text-[10px] text-gray-500 mt-1">Waiting for payment</div>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                            <h4 className="text-[10px] text-red-800 uppercase tracking-widest font-bold mb-1">Unpaid Amount</h4>
                            <div className="text-xl font-black text-red-600">
                                {vos.reduce((sum, v) => sum + (v.billing?.balance || 0), 0).toLocaleString()} <span className="text-xs font-normal">THB</span>
                            </div>
                            <div className="text-[11px] text-red-800 font-bold mt-1">{vos.filter(v=>v.status==='overdue').length} Overdue</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* C. Cashflow Placeholder */}
                            {user?.role !== 'client' && user?.role !== 'engineer' && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><PieChart size={18} className="mr-2"/> Cost & Cashflow Impact</h3>
                                <div className="h-48 flex items-end gap-2 border-b border-l border-gray-200 p-2 relative">
                                    {vos.map((v, i) => (
                                        <div key={i} className="flex-1 flex flex-col justify-end items-center group relative cursor-pointer" style={{ height: '100%' }} onClick={() => viewDetail(v)}>
                                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap z-10 transition-opacity">
                                                {v.vo_id}: {v.vo_type === 'VO-' ? '-' : ''}{v.grand_total.toLocaleString()}
                                            </div>
                                            <div className={`w-full rounded-t-sm ${v.vo_type === 'VO-' ? 'bg-red-400' : v.vo_type === 'VO0' ? 'bg-gray-400' : 'bg-emerald-400'}`} 
                                                 style={{ height: `${Math.max(10, Math.min(100, (v.grand_total / 100000) * 100))}%` }}></div>
                                            <div className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">{v.vo_id.split('-').pop()}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-4 gap-4 text-xs font-bold text-gray-500">
                                    <div className="flex items-center"><span className="w-3 h-3 bg-emerald-400 rounded-sm mr-2"></span>VO+</div>
                                    <div className="flex items-center"><span className="w-3 h-3 bg-red-400 rounded-sm mr-2"></span>VO-</div>
                                    <div className="flex items-center"><span className="w-3 h-3 bg-gray-400 rounded-sm mr-2"></span>VO0</div>
                                </div>
                            </div>
                            )}
                            
                            {/* B. Pending Actions */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><AlertTriangle size={18} className="mr-2 text-yellow-500"/> Pending Actions (Your Role: {user?.role || 'Guest'})</h3>
                                <div className="space-y-2">
                                    {(user?.role === 'client' || user?.role === 'pm' || user?.role === 'admin') && vos.filter(v => v.status === 'pending_approval').map(v => (
                                        <div key={v.vo_id} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => viewDetail(v)}>
                                            <span className="font-medium text-yellow-900">{v.vo_id} - รอการอนุมัติจากลูกค้า</span>
                                            <span className="text-yellow-700 font-bold">{v.grand_total.toLocaleString()} THB</span>
                                        </div>
                                    ))}
                                    {(user?.role === 'pm' || user?.role === 'admin') && vos.filter(v => v.status === 'draft').map(v => (
                                        <div key={v.vo_id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => viewDetail(v)}>
                                            <span className="font-medium text-gray-700">{v.vo_id} - รอตึกกลับ/ส่งให้ลูกค้า</span>
                                            <span className="text-gray-500">{v.grand_total.toLocaleString()} THB</span>
                                        </div>
                                    ))}
                                    {(user?.role === 'accounting' || user?.role === 'admin') && vos.filter(v => ['billed', 'partial_payment', 'overdue'].includes(v.status)).map(v => (
                                        <div key={v.vo_id} className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors" onClick={() => viewDetail(v)}>
                                            <span className="font-medium text-red-900">{v.vo_id} - รอรับชำระเงิน</span>
                                            <span className="text-red-700 font-bold flex flex-col items-end">
                                               <span>ค้าง: {v.billing?.balance?.toLocaleString()} THB</span>
                                               {v.status === 'overdue' && <span className="text-[10px] uppercase">(เกินกำหนด!)</span>}
                                            </span>
                                        </div>
                                    ))}
                                    {(user?.role === 'engineer' || user?.role === 'admin' || user?.role === 'pm') && vos.filter(v => v.gantt_locked).map(v => (
                                        <div key={v.vo_id} className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => viewDetail(v)}>
                                            <span className="font-medium text-orange-900">{v.vo_id} - {v.title}</span>
                                            <span className="text-orange-700 font-bold text-xs"><Lock size={12} className="inline mr-1 -mt-0.5"/> Locked</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* D. Approval Timeline */}
                        <div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Clock size={18} className="mr-2"/> Recent Activities</h3>
                                <div className="space-y-4">
                                    {vos.slice(0, 8).map(v => (
                                        <div key={v.vo_id} className="relative pl-6 border-l-2 border-gray-100 pb-2">
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${v.status === 'paid' ? 'bg-brand-500' : 'bg-gray-300'}`}></div>
                                            <div className="text-sm font-bold text-gray-800 cursor-pointer hover:text-brand-600" onClick={() => viewDetail(v)}>
                                                {v.vo_id} 
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">{v.title}</div>
                                            <div className="mt-1 text-[10px]">
                                                <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${getStatusStyle(v.status)}`}>{v.status.replace('_', ' ')}</span>
                                            </div>
                                            {v.audit_log && v.audit_log.length > 0 && (
                                                <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">Last: {v.audit_log[v.audit_log.length-1].action}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {activeTab === 'pending_monitor' && (
               <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center"><Clock className="mr-2 text-yellow-600"/> ตรวจสถานะรอลูกค้าอนุมัติ</h2>
                        <div></div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-600">VO No.</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-600">ชื่องาน</th>
                                    <th className="py-3 px-4 text-right font-semibold text-gray-600">มูลค่า (THB)</th>
                                    <th className="py-3 px-4 text-center font-semibold text-gray-600">วันที่ส่ง</th>
                                    <th className="py-3 px-4 text-center font-semibold text-gray-600">สถานะรอ</th>
                                    <th className="py-3 px-4 text-center font-semibold text-gray-600">แจ้งเตือน</th>
                                    <th className="py-3 px-4 text-right font-semibold text-gray-600">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vos.filter(v => v.status === 'pending_approval').map(vo => {
                                    const d1 = new Date(vo.created_date);
                                    const d2 = new Date();
                                    const diffTime = Math.abs(d2.getTime() - d1.getTime());
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    let alertStyle = "text-emerald-600 bg-emerald-50";
                                    let alertIcon = "🟢";
                                    let alertText = "ปกติ";
                                    
                                    if (diffDays >= 7) {
                                        alertStyle = "text-red-700 bg-red-50 font-bold border border-red-200";
                                        alertIcon = "🔴";
                                        alertText = "เกินกำหนด — ต้องติดตามด่วน";
                                    } else if (diffDays >= 4) {
                                        alertStyle = "text-yellow-700 bg-yellow-50 font-bold border border-yellow-200";
                                        alertIcon = "🟡";
                                        alertText = "ใกล้ครบกำหนด";
                                    }

                                    return (
                                        <tr key={vo.vo_id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 font-mono font-medium">{vo.vo_id}</td>
                                            <td className="py-3 px-4">{vo.title}</td>
                                            <td className="py-3 px-4 text-right font-mono text-gray-900 font-medium">{vo.grand_total.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-center text-gray-600">{vo.created_date}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="font-bold text-gray-900">{diffDays}</span> <span className="text-gray-500">วัน</span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center w-fit mx-auto ${alertStyle}`}>
                                                    <span className="mr-1">{alertIcon}</span> {alertText}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right space-x-2">
                                                <button onClick={() => viewDetail(vo)} className="text-gray-600 hover:text-brand-600 font-medium px-2 py-1 rounded hover:bg-brand-50 transition-colors">ดูใบ VO</button>
                                                <button onClick={() => toast.success(`สร้างข้อความ Reminder สำหรับ ${vo.vo_id} แล้ว, ให้แอดมินส่งได้เลย`, {icon: '💬'})} className="bg-brand-50 text-brand-700 hover:text-brand-800 font-medium px-3 py-1.5 rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors text-xs whitespace-nowrap">ส่ง Reminder</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {vos.filter(v => v.status === 'pending_approval').length === 0 && (
                                    <tr><td colSpan={7} className="py-8 text-center text-gray-500">ไม่มีรายการ VO ที่รอลูกค้าอนุมัติ</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex gap-8">
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">รอการอนุมัติทั้งหมด</span>
                            <span className="text-xl font-black text-gray-900">{vos.filter(v => v.status === 'pending_approval').length} รายการ</span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">มูลค่ารวม</span>
                            <span className="text-xl font-black text-brand-700">{vos.filter(v => v.status === 'pending_approval').reduce((sum, v) => sum + v.grand_total, 0).toLocaleString()} THB</span>
                        </div>
                        <div className="pl-8 border-l border-gray-300">
                            <span className="block text-xs uppercase tracking-wider text-red-500 font-bold mb-1">เกินกำหนด (≥ 7 วัน)</span>
                            <span className="text-xl font-black text-red-600">{vos.filter(v => v.status === 'pending_approval' && Math.ceil(Math.abs(new Date().getTime() - new Date(v.created_date).getTime()) / (1000 * 60 * 60 * 24)) >= 7).length} รายการ</span>
                        </div>
                    </div>
               </div>
           )}

           {activeTab === 'monthly_report' && (
               <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6 print:hidden">
                        <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center hover:text-gray-900"><ArrowLeft size={16} className="mr-1"/> กลับหน้าหลัก</button>
                        <button onClick={() => window.print()} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800"><Printer size={16}/> Print Report</button>
                    </div>

                    <div className="bg-white border border-gray-200 p-10 print:border-none print:p-0">
                        {/* Header */}
                        <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
                            <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">รายงานสรุปงานเพิ่ม-ลด (Variation Order)</h1>
                            <p className="text-gray-600 font-medium">ประจำเดือน {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</p>
                            <p className="text-gray-500 mt-2 text-sm">โครงการ: <strong className="text-gray-900">{project.name}</strong></p>
                        </div>

                        {/* 1. Summary */}
                        <div className="mb-8">
                            <h3 className="font-bold text-lg border-l-4 border-gray-900 pl-3 mb-4">1. สรุปมูลค่าสัญญา</h3>
                            <table className="w-full text-sm border-collapse border border-gray-300">
                                <tbody>
                                    <tr>
                                        <td className="p-3 border border-gray-300 bg-gray-50 font-semibold w-1/2">มูลค่าสัญญาเริ่มต้น</td>
                                        <td className="p-3 border border-gray-300 text-right font-mono text-gray-900">{(project.budget || 0).toLocaleString()} <span className="text-xs text-gray-500">THB</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 border border-gray-300 bg-gray-50 font-semibold">งานเพิ่ม/ลด สะสมถึงปัจจุบัน</td>
                                        <td className="p-3 border border-gray-300 text-right font-mono text-gray-900">
                                            {((vos.length > 0 ? vos[vos.length-1].contract_after : (project.budget || 0)) - (project.budget || 0)).toLocaleString()} <span className="text-xs text-gray-500">THB</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 border border-gray-300 bg-gray-900 text-white font-bold h-12">มูลค่าสัญญาสุทธิปัจจุบัน</td>
                                        <td className="p-3 border border-gray-300 text-right font-mono font-black text-lg text-gray-900 bg-gray-100">
                                            {(vos.length > 0 ? vos[vos.length-1].contract_after : (project.budget || 0)).toLocaleString()} <span className="text-xs font-normal">THB</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. VOs */}
                        <div className="mb-8">
                            <h3 className="font-bold text-lg border-l-4 border-gray-900 pl-3 mb-4">2. รายการ Variation Order ทั้งหมด</h3>
                            <table className="w-full text-sm border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border border-gray-300 text-left">VO No.</th>
                                        <th className="p-2 border border-gray-300 text-left">ชื่องาน/รายละเอียด</th>
                                        <th className="p-2 border border-gray-300 text-right">ยอดเงินสุทธิ</th>
                                        <th className="p-2 border border-gray-300 text-center">สถานะปัจจุบัน</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vos.map(v => (
                                        <tr key={v.vo_id}>
                                            <td className="p-2 border border-gray-300 font-mono text-xs">{v.vo_id}</td>
                                            <td className="p-2 border border-gray-300">{v.title}</td>
                                            <td className="p-2 border border-gray-300 text-right font-mono">{v.vo_type==='VO-' ? '-' : ''}{v.grand_total.toLocaleString()}</td>
                                            <td className="p-2 border border-gray-300 text-center uppercase text-[10px] font-bold"><span className={v.status === 'overdue' ? 'text-red-600' : 'text-gray-700'}>{v.status.replace('_', ' ')}</span></td>
                                        </tr>
                                    ))}
                                    {vos.length === 0 && (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-500 border border-gray-300">ไม่มีรายการในเดือนนี้</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            {/* 3. Action Required */}
                            <div>
                                <h3 className="font-bold text-lg border-l-4 border-emerald-500 pl-3 mb-4 text-emerald-900">3. รอการอนุมัติจาก Owner</h3>
                                <div className="space-y-3">
                                    {vos.filter(v => v.status === 'pending_approval').map(v => (
                                        <div key={v.vo_id} className="p-3 bg-emerald-50 border border-emerald-200 text-sm rounded">
                                            <div className="font-bold text-emerald-900">{v.vo_id}</div>
                                            <div className="text-emerald-700 mb-1">{v.title}</div>
                                            <div className="text-xs text-red-600 font-bold">กรุณาอนุมัติภายใน: {v.approval_deadline}</div>
                                        </div>
                                    ))}
                                    {vos.filter(v => v.status === 'pending_approval').length === 0 && (
                                        <div className="text-gray-500 text-sm italic">-- ไม่มีรายการรออนุมัติ --</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* 4. Payment */}
                            <div>
                                <h3 className="font-bold text-lg border-l-4 border-red-500 pl-3 mb-4 text-red-900">4. สถานะการชำระเงิน</h3>
                                <div className="space-y-3">
                                    {vos.filter(v => ['billed','partial_payment','overdue'].includes(v.status)).map(v => (
                                        <div key={v.vo_id} className="p-3 bg-red-50 border border-red-200 text-sm rounded">
                                            <div className="font-bold text-red-900 flex justify-between">
                                                <span>{v.vo_id} {v.status === 'overdue' && <span className="text-xs bg-red-600 text-white px-1 ml-1 rounded">OVERDUE</span>}</span>
                                                <span className="font-mono">{v.billing?.balance?.toLocaleString()} THB</span>
                                            </div>
                                            <div className="text-red-700 text-xs mt-1">ค้างชำระจากใบแจ้งหนี้: {v.billing?.invoice_no}</div>
                                        </div>
                                    ))}
                                    {vos.filter(v => ['billed','partial_payment','overdue'].includes(v.status)).length === 0 && (
                                        <div className="text-gray-500 text-sm italic">-- ไม่มียอดค้างชำระ --</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="mt-16 pt-8 border-t border-gray-300 flex justify-between text-center px-10">
                            <div>
                                <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                                <p className="font-bold text-gray-900">({user?.name || "Project Manager"})</p>
                                <p className="text-sm text-gray-500">ผู้จัดทำและตรวจสอบ</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                                <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                                <p className="font-bold text-gray-900">( เจ้าของโครงการ / Owner )</p>
                                <p className="text-sm text-gray-500">รับทราบรายงาน</p>
                                <p className="text-xs text-gray-400 mt-1">วันที่: ____/____/____</p>
                            </div>
                        </div>

                    </div>
               </div>
           )}
        </div>
    );
}
