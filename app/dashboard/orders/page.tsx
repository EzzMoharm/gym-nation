import type { Metadata } from "next";
import { getMyOrders } from "@/app/dashboard/actions";
import { OrdersListClient } from "./orders-list-client";

export const metadata: Metadata = {
  title: "My Orders | Dashboard",
};

export default async function OrdersPage() {
  const { data: orders } = await getMyOrders();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your recent purchases in real-time.
        </p>
      </div>

      <OrdersListClient initialOrders={orders} />
    </div>
  );
}
