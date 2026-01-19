import AuthGuard from "@/components/AuthGuard";
import NotificationsPanel from "@/components/NotificationPanel";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>
    <NotificationProvider>
      {children}
      <NotificationsPanel />
    </NotificationProvider></AuthGuard>;
}
