'use client'
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <p>Loading…</p>;

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
}
