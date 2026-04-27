# Development Log (DEV_LOG)

## ข้อมูลโครงการ (Project Overview)
แอปพลิเคชันบริหารจัดการโครงการและงานก่อสร้าง/วิศวกรรม (Project & Construction Management System) 
มีระบบ Role-Based Access Control (RBAC) รองรับหลายบทบาท (Admin, Owner, Sales, Engineer, Architect, QS, Foreman, Accountant, Client) 
พัฒนาด้วย React, Vite, Tailwind CSS, Firebase (Firestore, Authentication)

## สิ่งที่พัฒนาแล้ว (Completed Features)

### 1. ระบบ Authentication & Authorization
- สร้างหน้าระบบ Login (`Login.tsx`) 
- รองรับการ Login แบบเลือก Role เพื่อใช้สำหรับการทดสอบ (Mock Login ด้วย `signInAnonymously` และเก็บ Role ลงใน `localStorage`)
- แบ่ง Role ของผู้ใช้ตามหน้าที่ (admin, owner, sales, engineer, architect, qs, foreman, accountant, client)

### 2. โครงสร้าง UI และ Navigation
- แถบเมนูนำทาง (`NavBar.tsx`) รองรับการแสดงผลแต่ละเมนูตามสิทธิ์ของผู้ใช้งานแบบ Dynamic
- รองรับการเข้าถึงหน้าต่าง ๆ จากเมนู (หน้าแรก, แอดมิน, โปรไฟล์, ระบบบัญชี/ชำระเงิน, ฝ่ายขาย)

### 3. หน้าจอหลักของระบบ (Screens)
- **DashboardScreen**: แสดงภาพรวมของโปรเจกต์ทั้งหมด (รายการโครงการที่ทำอยู่)
- **ProjectDetailScreen**: หน้ารายละเอียดของแต่ละโครงการ 
- **AdminScreen**: หน้าจัดการผู้ใช้งาน (เพิ่ม/ลดสิทธิ์)
- **ProfileScreen**: หน้าโปรไฟล์ส่วนตัว
- **PaymentSystemScreen**: ระบบจัดการการเงินและการรับชำระเงิน
- **SalesCRMScreen**: ระบบ CRM สำหรับฝ่ายขาย 

### 4. ส่วนประกอบภายในหน้าโครงการ (Project Detail Tabs)
- **FinanceTab**: เมนูแท็บสำหรับการจัดการด้านการเงินและงบประมาณของโครงการ
- **ReportTab**: เมนูแท็บสำหรับการออกรายงานความคืบหน้า (ใช้ `recharts` ในการแสดงผลกราฟิก)

### 5. โครงสร้างฐานข้อมูล (Firebase)
- เชื่อมต่อโปรเจกต์เข้ากับ Firebase Authentication & Firestore 
- วางโครงสร้าง Firestore Rules (`firestore.rules`) ให้รองรับ Role-based อย่างปลอดภัย (เปิดสิทธิ์ให้ Roles ทำงานได้ถูกต้อง)

### 6. การแก้ไขบั๊ก (Recent Bug Fixes)
- แก้ไขปัญหา Missing Dependencies (`react-hot-toast`, `firebase`, `thai-baht-text`, `recharts`)
- แก้ไขระบบ Mock Login ให้ใช้งานได้ด้วยรหัสผ่าน `password123` และบันทึกข้อมูล Mock User ลงใน `localStorage`
- แก้ไขระบบ Logout เพื่อล้างข้อมูล Mock User และ Auth ออกอย่างสมบูรณ์

## Environment & Tech Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Lucide React (Icons), Recharts (Charts)
- Build Tool: Vite
- Backend/BaaS: Firebase (Auth, Firestore)
- Package Manager: npm
