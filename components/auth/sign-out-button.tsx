"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
