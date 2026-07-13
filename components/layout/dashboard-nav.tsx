"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";
import { LayoutDashboard, Package, Heart, CreditCard, MapPin, Settings } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Settings,
};

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 select-none scrollbar-none shrink-0 border-b md:border-b-0 border-border/40">
      {DASHBOARD_NAV_LINKS.map((link) => {
        const Icon = iconMap[link.icon];
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border border-transparent cursor-pointer shrink-0 md:text-sm md:px-4 md:py-3",
              isActive
                ? "bg-brand/10 text-brand border-brand/20 md:border-l-2 md:border-y-transparent md:border-r-transparent md:bg-brand/10 md:rounded-r-xl md:rounded-l-none pl-3.5"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {Icon && <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand" : "text-muted-foreground")} />}
            <span>{link.label}</span>
          </Link>
        );
      })}

      <div className="hidden md:block mt-4 pt-4 border-t border-border/50 w-full">
        <SignOutButton />
      </div>
    </nav>
  );
}
