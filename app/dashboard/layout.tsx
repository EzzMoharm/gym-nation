import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/shared/container";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default async function DashboardLayout({
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

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-dvh flex-col pt-16">
      <Container className="flex-1 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-12">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-lg shrink-0">
                {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold leading-none mb-1.5 truncate">{profile?.full_name || "User"}</h2>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <DashboardNav />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
