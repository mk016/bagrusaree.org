'use client';

import { useState, useEffect } from 'react';
import { ResponsiveSidebar } from '@/components/admin/responsive-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';
import { NotificationProvider } from '@/contexts/notification-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add admin-panel class to body when component mounts
  useEffect(() => {
    document.body.classList.add('admin-panel');
    
    // Remove the class when component unmounts
    return () => {
      document.body.classList.remove('admin-panel');
    };
  }, []);

  return (
    <AdminAuthProvider>
      <NotificationProvider>
        <AdminAuthGuard>
          <div className="h-screen max-h-screen bg-gray-50 overflow-hidden fixed inset-0 admin-layout">
            <ResponsiveSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            
            {/* Main Content Area */}
            <div className="lg:ml-64 flex flex-col h-full max-h-screen">
              <AdminHeader onMenuToggle={toggleSidebar} />
              
              <main className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
                <div className="p-4 lg:p-8">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </AdminAuthGuard>
      </NotificationProvider>
    </AdminAuthProvider>
  );
}