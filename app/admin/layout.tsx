import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Package, ShoppingCart, Dumbbell, Settings, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/plans", label: "Plans", icon: Dumbbell },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

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

  if (!user.email?.startsWith("admin")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-muted/10 pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="font-black tracking-tighter text-xl">
            GN <span className="text-brand">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Menu
          </div>
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className={buttonVariants({ variant: "outline", className: "w-full mb-2" })}>
            View Store
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
