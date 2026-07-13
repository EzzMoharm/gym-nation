import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double check admin role via profile or email startsWith
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!user.email?.startsWith("admin") && profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-muted/10 pt-16">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card shrink-0 flex flex-col p-4 md:p-0 md:py-6">
        <div className="h-16 items-center px-6 border-b border-border hidden md:flex mb-6">
          <Link href="/admin" className="font-black tracking-tighter text-xl cursor-pointer">
            GN <span className="text-brand">ADMIN</span>
          </Link>
        </div>

        <AdminNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
