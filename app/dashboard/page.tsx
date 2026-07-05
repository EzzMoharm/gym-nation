import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Gym Nation account and training plans.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Links Cards */}
        <Card className="hover:border-brand/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-brand" />
              Recent Orders
            </CardTitle>
            <CardDescription>Track your shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You have no recent orders. Time to restock your stack?
            </p>
            <Link href="/shop" className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
              Browse Products
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-brand/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-brand" />
              Active Plans
            </CardTitle>
            <CardDescription>Your training subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any active training plans yet.
            </p>
            <Link href="/plans" className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
              Find a Plan
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-brand/50 transition-colors sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-brand" />
              Wishlist
            </CardTitle>
            <CardDescription>Saved for later</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your wishlist is empty.
            </p>
            <Link href="/shop" className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
              Explore
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Password</p>
              <p className="mt-1">••••••••</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end border-t border-border mt-6">
            <Link href="/dashboard/settings" className={buttonVariants({ variant: "secondary" })}>
              Edit Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
