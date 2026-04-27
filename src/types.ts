export interface User {
  name: string;
  email: string;
  role: string;
  roleName: string;
  avatar: string;
}

export interface SalesCustomer {
  id?: string;
  fullName: string;
  nickname: string;
  phone: string;
  requirements: string;
  interestLevel: 'low' | 'medium' | 'high';
  status: 'new' | 'scheduled' | 'waiting' | 'deposited' | 'not_interested';
  contactLogs: { round: number; date: string; note: string }[];
  lastContactedAt?: Date | any;
  projectId?: string;
  notes?: string;
  freebies?: string;
  createdBy: string;
  createdAt?: Date | any;
}

export interface Warranty {
  id?: string;
  projectId: string;
  customerId: string;
  deliveryDate: string;
  struct: {
    collectedDate: string;
    expiresDate: string;
    notes: string;
    entries: { no: number; date: string; note: string }[];
  };
  roof: {
    collectedDate: string;
    expiresDate: string;
    notes: string;
    entries: { no: number; date: string; note: string }[];
  };
  arch: {
    collectedDate: string;
    expiresDate: string;
    notes: string;
    entries: { no: number; date: string; note: string }[];
  };
  createdAt?: Date | any;
}

export interface Project {
  id?: string;
  name: string;
  customerName?: string;
  type: string;
  code: string;
  location: string;
  siteLocationUrl?: string;
  status: string;
  progress: number;
  pm: string;
  pmName: string;
  se: string;
  seName: string;
  start: string;
  end: string;
  designStartDate?: string;
  designEndDate?: string;
  contractSignedDate?: string;
  blueprintStartDate?: string;
  blueprintEndDate?: string;
  permitSubmittedDate?: string;
  permitIssuedDate?: string;
  permitExpiresDate?: string;
  electricInstalledDate?: string;
  electricExpiresDate?: string;
  waterInstalledDate?: string;
  waterExpiresDate?: string;
  constructionStart?: string;
  constructionEnd?: string;
  deliveredDate?: string;
  owner: string;
  contract: string;
  phone: string;
  coverImage: string;
  budget: number;
  spent: number;
  timeline: any[];
  rfaList: any[];
  rfiList: any[];
  defectList: any[];
  photoList: any[];
  finance: any;
  memoList: any[];
  inspectionList: any[];
  issueList: any[];
  minutesList: any[];
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'House Phase 1',
    type: 'Residential',
    code: 'PCM-2026-001',
    location: 'ตลิ่งชัน, กรุงเทพมหานคร',
    status: 'อยู่ระหว่างก่อสร้าง',
    progress: 42.5,
    pm: 'https://i.pravatar.cc/100?img=11',
    pmName: 'คุณสมชาย มงคลดี',
    se: 'https://i.pravatar.cc/100?img=12',
    seName: 'พงศ์พัฒน์ สายก่อสร้าง',
    budget: 28500000,
    spent: 12400000,
    start: '16 ต.ค. 2025',
    end: '16 ต.ค. 2026',
    owner: 'บริษัท พชรมงคล พร็อพเพอร์ตี้ จำกัด',
    contract: 'PCM-CT-2026-003',
    phone: '081-234-XXXX',
    coverImage: '/cover.jpg',
    timeline: [
      { id: 'tl-1', phase: 'Jan 2026', title: 'งานเตรียมหน้างาน & เสาเข็ม', description: 'ดำเนินการเสร็จสิ้น 100% ตามแผนงาน', status: 'completed', percentage: 100 },
      { id: 'tl-2', phase: 'Feb-Mar 2026', title: 'งานโครงสร้างเหล็ก (โครงหลังคา)', description: 'กำลังดำเนินการ (In Progress) : 15%', status: 'in-progress', percentage: 15 },
    ],
    rfaList: [
      { id: 'PCM-RFA-001', title: 'แบบโครงสร้างหลังคา (Garage)', by: 'PCM Engineer', date: '20 APR 2026', status: 'pending' },
      { id: 'PCM-RFA-002', title: 'ตัวอย่างสีกระเบื้องปูพื้น (S-Class)', by: 'PCM Engineer', date: '18 APR 2026', status: 'approved' }
    ],
    rfiList: [
      { id: 'PCM-RFI-012', title: 'ระยะร่นด้านข้างอาคารฝั่งขวา (Gridline F)', by: 'SE Pongpat', date: '19 APR 2026', status: 'replied' },
      { id: 'PCM-RFI-013', title: 'ความชัดเจนเหล็กเสริมพื้นห้องน้ำ (S1)', by: 'Site Team', date: '23 APR 2026', status: 'pending' }
    ],
    defectList: [
      { id: 'df-1', title: 'รอยร้าวที่ผนังด้านหน้าฝั่งทางเข้า', priority: 'high', status: 'open' },
      { id: 'df-2', title: 'ปูนฉาบไม่เรียบที่เสาต้นที่ 2', priority: 'medium', status: 'open' }
    ],
    photoList: [
      { id: 'ph-1', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400&auto=format&fit=crop', caption: 'Foundation Check', date: '20 APR' },
      { id: 'ph-2', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop', caption: 'Site Overview', date: '19 APR' },
      { id: 'ph-3', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop', caption: 'Steel Rebar', date: '15 APR' }
    ],
    finance: { budget: 28500000, spent: 12400000, pending: 4200000 },
    memoList: [
      { id: 'mm-1', title: 'SI-005: แก้ไขตำแหน่งงานระบบไฟฟ้าห้องนอน Master', status: 'sent', date: '12 APR 2026', from: 'Architect Team' },
      { id: 'mm-2', title: 'Memo-012: แจ้งเปลี่ยนวัสดุฝ้าเพดานภายใน', status: 'sent', date: '10 APR 2026', from: 'Project Manager' }
    ],
    inspectionList: [
      { id: 'ins-1', area: 'งานเทคานคอดิน (Grid 1-5)', result: 'pass', date: '12 APR 2026' },
      { id: 'ins-2', area: 'ตรวจสอบเหล็กเสริมเสาชั้น 1', result: 'fail', date: '18 APR 2026' }
    ],
    issueList: [
      { id: 'iss-1', title: 'อุปกรณ์ยกของหนัก (Mobile Crane) ขัดข้อง', impact: 'High Priority', status: 'open' }
    ],
    minutesList: [
      { id: 'min-1', title: 'Weekly Progress Update #14', date: '22 APR 2026', uploadDate: '13:30 - 15:00' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Smart Warehouse',
    type: 'Industrial',
    code: 'PCM-2026-002',
    location: 'นิคมอุตสาหกรรมบางปู',
    status: 'ออกแบบ',
    progress: 15,
    pm: 'https://i.pravatar.cc/100?img=15',
    pmName: 'วิชัย รักดี',
    se: 'https://i.pravatar.cc/100?img=16',
    seName: 'สมปอง จริงใจ',
    budget: 12000000,
    spent: 1000000,
    start: '01 เม.ย. 2026',
    end: '15 ธ.ค. 2026',
    owner: 'บจก. โลจิสติกส์ไทย',
    contract: 'PCM-CT-2026-008',
    phone: '082-111-XXXX',
    coverImage: 'https://images.unsplash.com/photo-1541888086925-0c13ee0eaec1?q=80&w=800&auto=format&fit=crop',
    timeline: [],
    rfaList: [],
    rfiList: [],
    defectList: [],
    photoList: [],
    finance: { budget: 12000000, spent: 1000000, pending: 0 },
    memoList: [],
    inspectionList: [],
    issueList: [],
    minutesList: []
  },
  {
    id: 'proj-3',
    name: 'Highway Extension',
    type: 'Infrastructure',
    code: 'PCM-2026-003',
    location: 'สมุทรปราการ',
    status: 'ส่งมอบบ้าน',
    progress: 100,
    pm: 'https://i.pravatar.cc/100?img=47',
    pmName: 'สิริพร สุขสวัสดิ์',
    se: 'https://i.pravatar.cc/100?img=13',
    seName: 'ชลิต สายก่อสร้าง',
    budget: 35000000,
    spent: 34500000,
    start: '01 มิ.ย. 2025',
    end: '31 มี.ค. 2026',
    owner: 'กรมทางหลวง',
    contract: 'PCM-CT-2025-044',
    phone: '089-999-XXXX',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    timeline: [
      { id: 'tl-4', phase: 'Final Phase', title: 'ส่งมอบงาน', description: 'ตรวจสอบและส่งมอบงาน', status: 'completed', percentage: 100 }
    ],
    rfaList: [],
    rfiList: [],
    defectList: [],
    photoList: [],
    finance: { budget: 35000000, spent: 34500000, pending: 0 },
    memoList: [],
    inspectionList: [],
    issueList: [],
    minutesList: []
  }
];
