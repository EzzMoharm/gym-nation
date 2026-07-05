"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const discount = product.compare_at_price
    ? calcDiscount(product.compare_at_price, product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="flex h-full items-center justify-center text-6xl font-black text-muted-foreground/10">
          GN
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs font-bold">
              -{discount}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-brand text-brand-foreground text-xs font-bold">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Added to wishlist");
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            aria-label="Quick add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{product.brand?.name}</span>
          <span>·</span>
          <span>{product.category?.name}</span>
        </div>

        {/* Name */}
        <h3 className="mt-1.5 font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        {/* Flavor */}
        {product.flavor && (
          <p className="mt-1 text-xs text-muted-foreground">{product.flavor}</p>
        )}

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.average_rating)
                    ? "fill-warning text-warning"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.review_count.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
