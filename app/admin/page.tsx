import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Dumbbell } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { getProducts, getPlans } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Gym Nation",
};

export default async function AdminDashboardPage() {
  const { data: products } = await getProducts();
  const { data: plans } = await getPlans();

  const activeProducts = products?.filter((p: { is_active?: boolean }) => p.is_active) || [];
  const activePlans = plans?.filter((p: { is_active?: boolean }) => p.is_active) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(45231.89)}</div>
            <p className="text-xs text-success mt-1 flex items-center">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-success mt-1 flex items-center">
              +19% from last month
            </p>
          </CardContent>
        </Card>
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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #GN-{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      user{i}@example.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+{formatPrice(89.00 * i)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {products?.slice(0, 3).map((product: { id: string; name: string; image_url?: string; price?: number }) => (
                <div key={product.id} className="flex items-center">
                  <div className="relative w-9 h-9 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-contain p-1" />
                    ) : (
                      <span className="text-[8px] font-bold text-muted-foreground/50">GN</span>
                    )}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.price ? formatPrice(product.price) : ""}
                    </p>
                  </div>
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="text-sm text-muted-foreground">No products available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
