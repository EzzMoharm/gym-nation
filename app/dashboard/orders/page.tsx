import type { Metadata } from "next";
import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMyOrders } from "@/app/dashboard/actions";
import { formatPrice, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Orders | Dashboard",
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-warning bg-warning/10" },
  processing: { label: "Processing", icon: Clock, color: "text-info bg-info/10" },
  shipped: { label: "Shipped", icon: Truck, color: "text-brand bg-brand/10" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-success bg-success/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive bg-destructive/10" },
  refunded: { label: "Refunded", icon: XCircle, color: "text-muted-foreground bg-muted" },
};

export default async function OrdersPage() {
  const { data: orders } = await getMyOrders();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your recent purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-muted-foreground mb-6">
            When you place an order, it will appear here.
          </p>
          <Link href="/shop" className={buttonVariants({ className: "rounded-xl" })}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const itemCount = order.order_items?.length || 0;

            return (
              <Card key={order.id} className="overflow-hidden hover:border-brand/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-sm font-mono">{order.order_number}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{formatDateShort(order.created_at)}</span>
                        <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                        <span className="font-medium text-foreground">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Items preview */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="flex -space-x-2">
                        {order.order_items.slice(0, 3).map((item: any, idx: number) => (
                          <div
                            key={item.id || idx}
                            className="h-10 w-10 rounded-lg border-2 border-background bg-muted flex items-center justify-center overflow-hidden"
                            title={item.product_name}
                          >
                            {item.product_image ? (
                              <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground">GN</span>
                            )}
                          </div>
                        ))}
                        {order.order_items.length > 3 && (
                          <div className="h-10 w-10 rounded-lg border-2 border-background bg-muted flex items-center justify-center">
                            <span className="text-xs font-bold text-muted-foreground">+{order.order_items.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block shrink-0" />
                  </div>

                  {/* Expanded items list */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="border-t border-border bg-muted/20 px-5 py-3">
                      <div className="space-y-2">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                                {item.product_image ? (
                                  <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[8px] font-bold text-muted-foreground">GN</span>
                                )}
                              </div>
                              <span className="truncate">{item.product_name}</span>
                              <span className="text-muted-foreground shrink-0">×{item.quantity}</span>
                            </div>
                            <span className="font-medium shrink-0 ml-4">{formatPrice(item.total_price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
