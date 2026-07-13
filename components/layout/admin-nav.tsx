"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Dumbbell, ShoppingCart } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/plans", label: "Plans", icon: Dumbbell },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 select-none scrollbar-none shrink-0 border-b md:border-b-0 border-border/40">
      {ADMIN_NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border border-transparent cursor-pointer shrink-0 md:text-sm md:px-3 md:py-2",
              isActive
                ? "bg-brand/10 text-brand border-brand/20 md:border-l-2 md:border-y-transparent md:border-r-transparent md:bg-brand/10 md:rounded-r-xl md:rounded-l-none pl-3.5"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand" : "text-muted-foreground")} />
            <span>{link.label}</span>
          </Link>
        );
      })}

      <div className="hidden md:flex flex-col gap-2 mt-4 pt-4 border-t border-border/50 w-full">
        <Link href="/" className={buttonVariants({ variant: "outline", className: "w-full cursor-pointer h-10 rounded-xl" })}>
          View Store
        </Link>
        <SignOutButton />
      </div>
    </nav>
  );
}
