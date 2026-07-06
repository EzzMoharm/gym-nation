import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { Star, ShoppingBag, Heart, Shield, Truck, RotateCcw } from "lucide-react";
import type { Product } from "@/types";
import { AddToCartButton } from "./add-to-cart-button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Gym Nation`,
    description: product.short_description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) as Product;

  if (!product) {
    notFound();
  }

  const discount = product.compare_at_price
    ? calcDiscount(product.compare_at_price, product.price)
    : 0;

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images (Placeholder) */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl font-black text-muted-foreground/10">
                  GN
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                  Save {discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-muted-foreground/20">
                  {i}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-brand font-medium mb-3">
              <span>{product.brand?.name}</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-warning text-warning" />
                <span className="font-semibold">{product.average_rating}</span>
                <span className="text-muted-foreground">
                  ({product.review_count.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8 border-y border-border py-6">
              {product.flavor && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flavor</span>
                  <span className="font-medium">{product.flavor}</span>
                </div>
              )}
              {product.servings && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Servings</span>
                  <span className="font-medium">{product.servings}</span>
                </div>
              )}
              {product.serving_size && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serving Size</span>
                  <span className="font-medium">{product.serving_size}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <AddToCartButton product={product} />
              <Button variant="outline" size="lg" className="h-14 rounded-xl px-8 gap-2 shrink-0">
                <Heart className="h-5 w-5" />
                Save
              </Button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                <Truck className="h-6 w-6 text-brand mb-2" />
                <span className="text-sm font-medium">Free Shipping</span>
                <span className="text-xs text-muted-foreground">Orders over $75</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                <Shield className="h-6 w-6 text-brand mb-2" />
                <span className="text-sm font-medium">Secure Checkout</span>
                <span className="text-xs text-muted-foreground">256-bit encryption</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50">
                <RotateCcw className="h-6 w-6 text-brand mb-2" />
                <span className="text-sm font-medium">30-Day Returns</span>
                <span className="text-xs text-muted-foreground">Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Placeholder */}
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="text-2xl font-bold mb-8">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.ingredients || "No ingredient information available."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suggested Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                Mix one serving with 8-10 fl oz of water, milk, or your favorite beverage. Consume 1-2 times daily or as needed to meet your protein requirements.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
