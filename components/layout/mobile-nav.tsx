"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag, User, Heart } from "lucide-react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          aria-label="Open menu"
        />
      }>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center px-6 py-4">
            <Logo />
          </div>
          <Separator />

          {/* Nav Links */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <NavLinks
              orientation="vertical"
              onLinkClick={() => setOpen(false)}
            />
          </div>

          <Separator />

          {/* Bottom Actions */}
          <div className="px-4 py-6 space-y-2 bg-muted/20 border-t border-border/50">
            <Link
              href="/dashboard/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
            </Link>
            {user ? (
              <div className="pt-2 mt-2 border-t border-border/50 space-y-3">
                <div className="px-4 py-1 text-xs">
                  <p className="font-semibold text-foreground truncate">{user.user_metadata?.full_name || "User"}</p>
                  <p className="text-muted-foreground truncate">{user.email}</p>
                </div>
                <div onClick={() => setOpen(false)}>
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
