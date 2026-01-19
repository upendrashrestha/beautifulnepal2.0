import AuthGuard from "@/components/AuthGuard";
import DashboardMenuItems from "@/components/DashboardMenuItems";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DashboardMenuItems />
        <AuthGuard>
          <div className="pt-25 p-5">
            {/* Add padding to avoid overlap with fixed header */}
            {children}
          </div>
        </AuthGuard>
      </NotificationProvider>
    </AuthProvider>
  );
}
