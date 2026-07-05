import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Plus, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Products | Gym Nation Admin",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog.</p>
        </div>
        <Button className="gap-2 bg-brand hover:bg-brand-light text-brand-foreground">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground/50 shrink-0">
                        GN
                      </div>
                      <div className="font-medium text-foreground">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatPrice(product.price!)}</td>
                  <td className="px-6 py-4">{product.category?.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      Active
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
