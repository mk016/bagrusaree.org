'use client';

import { useState } from 'react';
import { ResponsiveSidebar } from '@/components/admin/responsive-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResponsiveSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <AdminHeader onMenuToggle={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}