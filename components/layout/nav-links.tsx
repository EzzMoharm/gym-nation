"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { isAdminEmail } from "@/lib/admin-auth";

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
  orientation?: "horizontal" | "vertical";
}

export function NavLinks({
  className,
  onLinkClick,
  orientation = "horizontal",
}: NavLinksProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const isAdmin = isAdminEmail(user?.email);

  return (
    <nav
      className={cn(
        "flex gap-1",
        orientation === "vertical" ? "flex-col" : "items-center",
        className
      )}
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
              orientation === "vertical" && "text-base px-4 py-3",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
            {isActive && orientation === "horizontal" && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-brand" />
            )}
            {isActive && orientation === "vertical" && (
              <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
            )}
          </Link>
        );
      })}
      
      {isAdmin && (
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={cn(
            "relative rounded-md px-3 py-2 text-sm font-bold text-brand transition-colors hover:text-brand-light",
            orientation === "vertical" && "text-base px-4 py-3"
          )}
        >
          Admin
          {pathname.startsWith("/admin") && orientation === "horizontal" && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-brand" />
          )}
          {pathname.startsWith("/admin") && orientation === "vertical" && (
            <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
          )}
        </Link>
      )}
    </nav>
  );
}
