import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export const getProjectsRef = () => collection(db, 'projects');

const MOCK_PROJECTS = [
    {
       id: 'MOCK-1',
       name: 'โครงการก่อสร้างบ้านพักอาศัย 3 ชั้น',
       location: 'สุขุมวิท 101, กรุงเทพมหานคร',
       start: '1 ก.พ. 2026',
       end: '28 ก.พ. 2027',
       status: 'อยู่ระหว่างก่อสร้าง',
       progress: 65,
       seName: 'สมชาย มั่นคง (SE)',
       pmName: 'เอกชัย ผู้จัดการ (PM)',
       coverImage: 'https://images.unsplash.com/photo-1541888086903-ee32f0d01309?q=80&w=900&auto=format&fit=crop',
       finance: { budget: 15000000, spent: 8500000, pending: 2000000 }
    },
    {
       id: 'MOCK-2',
       name: 'อาคารพาณิชย์ 4 คูหา',
       location: 'บางนา, กรุงเทพมหานคร',
       start: '15 มี.ค. 2026',
       end: '30 พ.ย. 2026',
       status: 'ออกแบบ',
       progress: 15,
       seName: 'วิศวกร ทดสอบ (SE)',
       pmName: 'ผู้จัดการ ทดสอบ (PM)',
       coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop',
       finance: { budget: 8000000, spent: 1200000, pending: 0 }
    }
];

export const subscribeToProjects = (callback: (projects: any[]) => void) => {
    return onSnapshot(getProjectsRef(), (snapshot) => {
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(projects);
    }, (error) => {
        console.warn('Using mock data due to Firestore error:', error);
        callback(MOCK_PROJECTS);
    });
};

export const createProject = async (projectData: any) => {
    try {
        const newProjectRef = doc(collection(db, 'projects'));
        await setDoc(newProjectRef, {
            ...projectData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return newProjectRef.id;
    } catch (error) {
        try {
            handleFirestoreError(error, OperationType.CREATE, 'projects');
        } catch (e: any) {
            console.warn("Caught Firestore Error:", e.message);
        }
    }
};

export const updateProject = async (projectId: string, projectData: any) => {
    if (projectId.startsWith('MOCK')) {
        console.log('Mock update successful', projectId, projectData);
        return;
    }
    try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            ...projectData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        try {
            handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
        } catch (e: any) {
            console.warn("Caught Firestore Error:", e.message);
        }
    }
};

export const deleteProject = async (projectId: string) => {
    if (projectId.startsWith('MOCK')) {
        console.log('Mock delete successful', projectId);
        return;
    }
    try {
        const projectRef = doc(db, 'projects', projectId);
        await deleteDoc(projectRef);
    } catch (error) {
        try {
            handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
        } catch (e: any) {
            console.warn("Caught Firestore Error:", e.message);
        }
    }
};
