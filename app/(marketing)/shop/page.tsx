import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Shop Supplements | Gym Nation",
  description: "Browse our premium selection of whey protein, pre-workouts, creatine, and more.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        {/* Page Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Supplements</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Premium fuel for premium athletes.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-4 gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="hidden md:block space-y-8 pr-4">
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="font-medium text-foreground">All Supplements</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Protein</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Pre-Workout</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Creatine</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Amino Acids</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Brands</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border bg-background" />
                  <span>Optimum Nutrition</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border bg-background" />
                  <span>Cellucor</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border bg-background" />
                  <span>GHOST</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border bg-background" />
                  <span>Dymatize</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
