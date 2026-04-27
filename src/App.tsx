import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { LoginScreen } from './pages/Login';
import { DashboardScreen } from './pages/Dashboard';
import { ProjectDetailScreen } from './pages/ProjectDetail';
import { AdminScreen } from './pages/Admin';
import { ProfileScreen } from './pages/Profile';
import { PaymentSystemScreen } from './pages/PaymentSystem';
import { SalesCRMScreen } from './pages/SalesCRM';
import { ChatWidget } from './components/ChatWidget';
import { User } from './types';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuh, setLoadingAuth] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'project' | 'admin' | 'profile' | 'payment_system' | 'sales_crm'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.isAnonymous) {
          localStorage.removeItem('pcm_mock_role'); // Clean up mock if real login
          setUser({
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'owner', // Default role for now
            roleName: 'เจ้าของ',
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName?.replace(' ', '+') || 'User'}&background=111827&color=fff`
          });
        } else {
          const mockRaw = localStorage.getItem('pcm_mock_role');
          if (mockRaw) {
              setUser(JSON.parse(mockRaw));
          } else {
              setUser(null);
          }
        }
      } else {
         setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
     if (user) {
         if (user.role === 'sales') {
            setView('sales_crm');
         } else if (user.role === 'admin') {
            setView('admin');
         } else {
             setView('dashboard');
         }
     }
  }, [user]);

  if (loadingAuh) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={(u) => {
        localStorage.setItem('pcm_mock_role', JSON.stringify(u));
        setUser(u);
    }}/>;
  }

  const navigateToHome = () => {
    setSelectedProject(null);
    setView('dashboard');
  };

  const navigateToAdmin = () => {
    setSelectedProject(null);
    setView('admin');
  };

  const navigateToProfile = () => {
    setSelectedProject(null);
    setView('profile');
  };

  const navigateToPaymentSystem = () => {
    setSelectedProject(null);
    setView('payment_system');
  };

  const navigateToSales = () => {
    setSelectedProject(null);
    setView('sales_crm');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-500 relative">
      <NavBar 
         user={user} 
         onLogout={() => {
           localStorage.removeItem('pcm_mock_role');
           auth.signOut();
           setUser(null);
           setView('dashboard');
           setSelectedProject(null);
         }} 
         onGoHome={navigateToHome}
         onGoAdmin={navigateToAdmin}
         onGoProfile={navigateToProfile}
         onGoPayment={navigateToPaymentSystem}
         onGoSales={navigateToSales}
      />
      {view === 'admin' ? (
        <AdminScreen />
      ) : view === 'payment_system' ? (
        <PaymentSystemScreen user={user} onBack={navigateToHome} />
      ) : view === 'profile' ? (
        <ProfileScreen user={user} />
      ) : view === 'sales_crm' ? (
        <SalesCRMScreen user={user} onBack={navigateToHome} />
      ) : selectedProject ? (
        <ProjectDetailScreen project={selectedProject} onBack={navigateToHome} user={user} />
      ) : (
        <DashboardScreen onSelectProject={(p) => { setSelectedProject(p); setView('project'); }} user={user} />
      )}
      
      <ChatWidget />
      <Toaster position="bottom-right" />
    </div>
  );
}
