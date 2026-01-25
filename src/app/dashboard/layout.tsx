'use client';
import AuthGuard from "@/components/AuthGuard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode, useState } from "react";
import DashboardMenuItems from "@/components/DashboardMenuItems";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <AuthGuard>
        <NotificationProvider>
          {/* Top header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="px-4 py-4 md:px-8">
              <DashboardMenuItems />
            </div>
          </div>

          {/* Sidebar */}
          <DashboardSidebar onToggle={setSidebarOpen} />

          {/* Main content */}
          <div
            className={`transition-all duration-300 pt-24 ${sidebarOpen ? "md:ml-64" : "md:ml-20"
              }`}
          >
            <main className="px-4 md:px-8">{children}</main>
          </div>
        </NotificationProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
