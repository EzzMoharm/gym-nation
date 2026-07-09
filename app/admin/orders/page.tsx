"use client";

import { useState, useEffect } from "react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllAdminOrders, updateOrderStatus } from "@/app/admin/actions";
import { toast } from "sonner";

interface AdminOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  shipping_address: {
    full_name: string;
  };
  profile?: {
    full_name: string;
    email: string;
  };
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  refunded: "bg-muted text-muted-foreground border-muted-foreground/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const res = await getAllAdminOrders();
      if (res.error) throw new Error(res.error);
      setOrders(res.data as any || []);
    } catch (err: any) {
      toast.error("Failed to load orders: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res && res.error) throw new Error(res.error);
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      toast.success("Order status updated successfully");
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const headers = ["Order Number", "Customer Name", "Customer Email", "Date", "Total", "Status"];
    const rows = orders.map((o) => [
      o.order_number,
      o.profile?.full_name || o.shipping_address?.full_name || "Guest",
      o.profile?.email || "N/A",
      new Date(o.created_at).toLocaleDateString(),
      o.total.toFixed(2),
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gym-nation-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage customer orders.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-11" onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground">No customer orders found in the database.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order Number</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium font-mono text-xs">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {order.profile?.full_name || order.shipping_address?.full_name || "Guest"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.profile?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateShort(order.created_at)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-brand" />}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={isUpdating}
                            className="bg-card text-foreground border border-input rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-brand focus:ring-1 focus:ring-brand cursor-pointer transition-all disabled:opacity-50"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
