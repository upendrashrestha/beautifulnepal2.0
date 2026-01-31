import LoginHeader from "@/components/LoginHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <LoginHeader />
            <div className="mt-50 w-full">
                {children}
            </div>
        </AuthProvider>
    );
}
