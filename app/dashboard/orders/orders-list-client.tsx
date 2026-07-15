"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Settings
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface OrdersListClientProps {
  initialOrders: any[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-warning bg-warning/10 border-warning/20" },
  processing: { label: "Processing", icon: Settings, color: "text-info bg-info/10 border-info/20" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-success bg-success/10 border-success/20" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive bg-destructive/10 border-destructive/20" },
  refunded: { label: "Refunded", icon: AlertTriangle, color: "text-muted-foreground bg-muted border-border" },
};

const trackingSteps = [
  { label: "Placed", icon: Package, desc: "Order confirmed" },
  { label: "Processing", icon: Settings, desc: "Preparing items" },
  { label: "Shipped", icon: Truck, desc: "On the way" },
  { label: "Delivered", icon: CheckCircle2, desc: "Arrived" },
];

function getActiveStepIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return -1;
  }
}

export function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`user-orders-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as any;
          
          setOrders((prev) => {
            const oldOrder = prev.find((o) => o.id === updatedOrder.id);
            
            // Trigger celebration toast if order gets delivered!
            if (
              oldOrder && 
              oldOrder.status !== "delivered" && 
              updatedOrder.status === "delivered"
            ) {
              toast.success(`🎉 Great news! Order ${updatedOrder.order_number} has been delivered!`, {
                duration: 10000,
              });
            } else if (
              oldOrder && 
              oldOrder.status !== updatedOrder.status
            ) {
              const statusName = statusConfig[updatedOrder.status]?.label || updatedOrder.status;
              toast.info(`📦 Order ${updatedOrder.order_number} status updated to: ${statusName}`, {
                duration: 6000,
              });
            }

            return prev.map((o) => {
              if (o.id === updatedOrder.id) {
                // Keep the nested order items from the initial fetch
                return { ...o, ...updatedOrder };
              }
              return o;
            });
          });
        }
      )
      .subscribe();

    // Fallback: poll for order updates every 15 seconds in case real-time fails/is disabled
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (!error && data) {
          setOrders((prev) => {
            // Check status differences to trigger toasts
            data.forEach((newOrder) => {
              const oldOrder = prev.find((o) => o.id === newOrder.id);
              if (
                oldOrder &&
                oldOrder.status !== "delivered" &&
                newOrder.status === "delivered"
              ) {
                toast.success(`🎉 Great news! Order ${newOrder.order_number} has been delivered!`, {
                  duration: 10000,
                });
              } else if (
                oldOrder &&
                oldOrder.status !== newOrder.status
              ) {
                const statusName = statusConfig[newOrder.status]?.label || newOrder.status;
                toast.info(`📦 Order ${newOrder.order_number} status updated to: ${statusName}`, {
                  duration: 6000,
                });
              }
            });
            return data;
          });
        }
      } catch (err) {
        console.error("Failed to poll customer orders:", err);
      }
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium mb-2">No orders yet</p>
        <p className="text-muted-foreground mb-6">
          When you place an order, it will appear here.
        </p>
        <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-brand-foreground hover:bg-brand-light transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const activeIndex = getActiveStepIndex(order.status);
        const isTerminal = activeIndex === -1;
        const status = statusConfig[order.status] || statusConfig.pending;
        const StatusIcon = status.icon;
        const itemCount = order.order_items?.length || 0;

        return (
          <Card 
            key={order.id} 
            className="overflow-hidden hover:border-brand/20 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-brand/5 border border-border"
          >
            <CardContent className="p-0">
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/40 bg-muted/10">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <p className="font-bold text-sm font-mono text-foreground">{order.order_number}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Placed on {formatDateShort(order.created_at)}</span>
                    <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                    <span className="font-semibold text-foreground">Total: {formatPrice(order.total)}</span>
                  </div>
                </div>
                
                {order.tracking_number && (
                  <div className="text-xs text-muted-foreground sm:text-right">
                    <span className="block text-[10px] uppercase font-bold tracking-wider">Tracking Number</span>
                    <span className="font-mono text-foreground font-semibold">{order.tracking_number}</span>
                  </div>
                )}
              </div>

              {/* Real-time Visual Stepper Tracker */}
              {!isTerminal ? (
                <div className="px-6 py-8 border-b border-border/30 bg-card">
                  <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                    {/* Stepper Progress Bar Background */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full z-0" />
                    
                    {/* Stepper Progress Bar Active Overlay */}
                    <motion.div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ${
                        order.status === "delivered" ? "bg-success" : "bg-brand"
                      }`}
                      style={{ 
                        width: `${(activeIndex / (trackingSteps.length - 1)) * 100}%` 
                      }}
                      initial={false}
                      animate={{
                        width: `${(activeIndex / (trackingSteps.length - 1)) * 100}%`
                      }}
                    />

                    {/* Step Nodes */}
                    {trackingSteps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isCompleted = idx < activeIndex;
                      const isActive = idx === activeIndex;
                      const isFuture = idx > activeIndex;

                      let nodeClass = "bg-muted text-muted-foreground border-muted";
                      if (isCompleted) {
                        nodeClass = order.status === "delivered" 
                          ? "bg-success text-success-foreground border-success" 
                          : "bg-brand text-brand-foreground border-brand";
                      } else if (isActive) {
                        nodeClass = order.status === "delivered"
                          ? "bg-success text-success-foreground border-success ring-4 ring-success/20"
                          : "bg-brand text-brand-foreground border-brand ring-4 ring-brand/20";
                      }

                      return (
                        <div key={step.label} className="relative flex flex-col items-center z-10">
                          {/* Node Circle */}
                          <motion.div 
                            className={`h-10 w-10 rounded-full border-2 flex items-center justify-center bg-card transition-colors duration-500 ${nodeClass}`}
                            animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          >
                            <StepIcon className="h-4.5 w-4.5 shrink-0" />
                            
                            {/* Pulse animation for active dot */}
                            {isActive && !isTerminal && order.status !== "delivered" && (
                              <span className="absolute -inset-0.5 rounded-full border border-brand animate-ping opacity-60" />
                            )}
                          </motion.div>
                          
                          {/* Node Labels */}
                          <div className="absolute top-12 text-center w-24">
                            <p className={`text-xs font-bold ${isActive ? "text-foreground font-black" : "text-muted-foreground"}`}>
                              {step.label}
                            </p>
                            <p className="text-[9px] text-muted-foreground/80 mt-0.5 hidden sm:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Padding to prevent absolute positioned labels from overlapping content */}
                  <div className="h-6" />
                </div>
              ) : (
                /* Terminal Cancelled/Refunded Banner */
                <div className="px-5 py-4 border-b border-border/30 bg-destructive/5 flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    order.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                  }`}>
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      This order was {order.status}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Please reach out to support if you have any questions.
                    </p>
                  </div>
                </div>
              )}

              {/* Items List Preview */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="px-5 py-4 bg-muted/5">
                  <div className="space-y-3">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                            {item.product_image ? (
                              <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="font-bold text-muted-foreground/30 text-[10px]">GN</span>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-foreground truncate">{item.product_name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatPrice(item.unit_price)} each × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-foreground shrink-0 ml-4">
                          {formatPrice(item.total_price)}
                        </span>
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
  );
}
