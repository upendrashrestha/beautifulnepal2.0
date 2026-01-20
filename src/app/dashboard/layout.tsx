import AuthGuard from "@/components/AuthGuard";
import DashboardMenuItems from "@/components/DashboardMenuItems";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
         <AuthGuard>
      <NotificationProvider>
        <DashboardSidebar />
        <DashboardMenuItems />
     
          {/* Main content */}
          <div className="md:ml-64">
            {/* Top header */}
            <DashboardMenuItems />

            <main className="pt-24 px-4 md:px-8">{children}</main>
          </div>
      </NotificationProvider>
        </AuthGuard>
    </AuthProvider>
  );
}
