import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { createClient } from "@/lib/supabase/server";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";
import { LayoutDashboard, Package, Heart, CreditCard, MapPin, Settings, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Container } from "@/components/shared/container";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Settings,
};

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
    <div className="flex min-h-dvh flex-col">
      {/* Mini Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/shop" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <Container className="flex-1 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-lg">
                {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold leading-none mb-1.5">{profile?.full_name || "User"}</h2>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {DASHBOARD_NAV_LINKS.map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <SignOutButton />
              </div>
            </nav>
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
