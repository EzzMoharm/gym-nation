import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getMyOrders, getMySubscriptions, getMyWishlist } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Gym Nation account and training plans.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch actual statistics dynamically from user databases
  const { data: orders } = await getMyOrders();
  const { data: subscriptions } = await getMySubscriptions();
  const { data: wishlist } = await getMyWishlist();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="hover:border-brand/50 transition-colors flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-brand" />
              Recent Orders
            </CardTitle>
            <CardDescription>Track your shipments</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground mb-4">
              {orders && orders.length > 0
                ? `You have placed ${orders.length} order(s).`
                : "You have no recent orders. Time to restock your stack?"}
            </p>
            <Link
              href={orders && orders.length > 0 ? "/dashboard/orders" : "/shop"}
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full mt-auto cursor-pointer" })}
            >
              {orders && orders.length > 0 ? "View Orders" : "Browse Products"}
            </Link>
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card className="hover:border-brand/50 transition-colors flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-brand" />
              Active Plans
            </CardTitle>
            <CardDescription>Your training subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground mb-4">
              {subscriptions && subscriptions.length > 0
                ? `You are subscribed to ${subscriptions.length} program(s).`
                : "You don't have any active training plans yet."}
            </p>
            <Link
              href={subscriptions && subscriptions.length > 0 ? "/dashboard/subscriptions" : "/plans"}
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full mt-auto cursor-pointer" })}
            >
              {subscriptions && subscriptions.length > 0 ? "Manage Subscriptions" : "Find a Plan"}
            </Link>
          </CardContent>
        </Card>

        {/* Wishlist */}
        <Card className="hover:border-brand/50 transition-colors sm:col-span-2 lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-brand" />
              Wishlist
            </CardTitle>
            <CardDescription>Saved for later</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground mb-4">
              {wishlist && wishlist.length > 0
                ? `You have ${wishlist.length} item(s) saved.`
                : "Your wishlist is empty."}
            </p>
            <Link
              href={wishlist && wishlist.length > 0 ? "/dashboard/wishlist" : "/shop"}
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full mt-auto cursor-pointer" })}
            >
              {wishlist && wishlist.length > 0 ? "View Wishlist" : "Explore"}
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
            <Link href="/dashboard/settings" className={buttonVariants({ variant: "secondary", className: "cursor-pointer" })}>
              Edit Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
