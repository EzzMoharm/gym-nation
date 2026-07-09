import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { getActiveProducts } from "@/app/admin/actions";
import { ShopListing } from "@/components/shop/shop-listing";

export const metadata: Metadata = {
  title: "Shop Supplements & Gear | Gym Nation",
  description: "Browse our premium selection of whey protein, pre-workouts, creatine, health tools, and gym gear.",
};

export default async function ShopPage() {
  const { data: products } = await getActiveProducts();

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Supplements & Gear</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Premium fuel and performance tools for premium athletes.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl font-black text-muted-foreground/10 mb-4">GN</div>
            <h3 className="text-lg font-semibold mb-1">No products available</h3>
            <p className="text-muted-foreground text-sm">Check back soon for new additions.</p>
          </div>
        ) : (
          <ShopListing products={products} />
        )}
      </Container>
    </div>
  );
}
