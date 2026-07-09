import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Dumbbell } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { getProducts, getPlans, getAdminDashboardStats } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Gym Nation",
};

export default async function AdminDashboardPage() {
  const { data: products } = await getProducts();
  const { data: plans } = await getPlans();
  const { data: stats } = await getAdminDashboardStats();

  const activeProducts = products?.filter((p: { is_active?: boolean }) => p.is_active) || [];
  const activePlans = plans?.filter((p: { is_active?: boolean }) => p.is_active) || [];

  // Live stats from database
  const totalRevenue = stats?.totalRevenue || 0;
  const totalSales = stats?.totalOrders || 0;
  const recentOrders = stats?.recentOrders || [];
  const topProducts = stats?.topProducts || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sum of non-cancelled orders
            </p>
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Plans
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Total available plans
            </p>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sales (Orders)
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Total completed checkouts
            </p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Total available products
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No checkouts completed yet.</p>
            ) : (
              <div className="space-y-8">
                {recentOrders.map((order: any, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {order.email}
                      </p>
                    </div>
                    <div className="ml-auto font-bold text-brand">{formatPrice(order.total)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products list */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topProducts.map((product: any) => (
                <div key={product.id} className="flex items-center">
                  <div className="relative w-9 h-9 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                      <span className="text-[8px] font-bold text-muted-foreground/50">GN</span>
                    )}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{formatPrice(product.price)}</span>
                      <span className="text-brand font-semibold">({product.sales_count || 0} sold)</span>
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">No product sales recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
