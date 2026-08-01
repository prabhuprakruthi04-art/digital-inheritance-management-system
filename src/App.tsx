import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { motion, AnimatePresence } from 'motion/react';

// 15 Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { NomineeDashboardPage } from './pages/NomineeDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateDigitalKeyPage } from './pages/CreateDigitalKeyPage';
import { AddNomineePage } from './pages/AddNomineePage';
import { AssetListPage } from './pages/AssetListPage';
import { UploadDocumentsPage } from './pages/UploadDocumentsPage';
import { KeyStatusPage } from './pages/KeyStatusPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutProjectPage } from './pages/AboutProjectPage';

function MainLayout() {
  const { activePage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'owner-dashboard':
        return <OwnerDashboardPage />;
      case 'nominee-dashboard':
        return <NomineeDashboardPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'create-key':
        return <CreateDigitalKeyPage />;
      case 'add-nominee':
        return <AddNomineePage />;
      case 'asset-list':
        return <AssetListPage />;
      case 'upload-docs':
        return <UploadDocumentsPage />;
      case 'key-status':
        return <KeyStatusPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutProjectPage />;
      default:
        return <OwnerDashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
