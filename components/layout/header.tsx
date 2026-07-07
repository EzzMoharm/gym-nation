"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Heart, User, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useCartStore } from "@/lib/store/cart";

import { CartDrawer } from "@/components/shop/cart-drawer";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { user } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile nav + Logo */}
        <div className="flex items-center gap-3">
          <MobileNav />
          <Logo />
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link
            href="/shop"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden sm:flex" })}
            aria-label="Search products"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/dashboard/wishlist"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden sm:flex" })}
            aria-label="Wishlist"
          >
            <Heart className="h-4.5 w-4.5" />
          </Link>

          {/* Cart */}
          <CartDrawer />

          {/* Account */}
          <Link
            href={user ? "/dashboard" : "/login"}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label={user ? "Account" : "Sign in"}
          >
            <User className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
