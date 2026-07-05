import type { Metadata } from "next";
import { formatPrice } from "@/lib/utils";
import { MoreHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manage Orders | Gym Nation Admin",
};

export default function AdminOrdersPage() {
  const MOCK_ORDERS = [
    { id: "1001", customer: "John Doe", email: "john@example.com", date: "2024-03-12", total: 124.99, status: "Delivered" },
    { id: "1002", customer: "Sarah Smith", email: "sarah@example.com", date: "2024-03-11", total: 89.00, status: "Processing" },
    { id: "1003", customer: "Mike Johnson", email: "mike@example.com", date: "2024-03-10", total: 45.50, status: "Shipped" },
    { id: "1004", customer: "Emma Wilson", email: "emma@example.com", date: "2024-03-10", total: 210.00, status: "Pending" },
    { id: "1005", customer: "Alex Brown", email: "alex@example.com", date: "2024-03-09", total: 65.99, status: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage customer orders.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    #GN-{order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-success/10 text-success" :
                      order.status === "Processing" ? "bg-brand/10 text-brand" :
                      order.status === "Shipped" ? "bg-blue-500/10 text-blue-500" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
