"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPrice, calcDiscount, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import Image from "next/image";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const isWishlisted = wishlistIds.includes(product.id);

  const discount = product.compare_at_price
    ? calcDiscount(product.compare_at_price, product.price)
    : 0;

  // Support both flat (Supabase) and nested (mock) image formats
  const imageUrl =
    product.image_url ||
    (product.images && product.images[0]?.url) ||
    "";

  // Support both flat and nested brand/category
  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.name || "";
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

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
      <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center p-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-6xl font-black text-muted-foreground/10">GN</div>
        )}
        
        {/* Quick actions overlay */}
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
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-brand hover:text-brand-foreground",
              isWishlisted ? "text-brand" : "text-foreground"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={async (e) => {
              e.preventDefault();
              await toggleWishlist(product.id);
            }}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-brand text-brand")} />
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
        {(brandName || categoryName) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {brandName && <span>{brandName}</span>}
            {brandName && categoryName && <span>·</span>}
            {categoryName && <span>{categoryName}</span>}
          </div>
        )}

        {/* Name */}
        <h3 className="mt-1.5 font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        {/* Flavor */}
        {product.flavor && (
          <p className="mt-1 text-xs text-muted-foreground">{product.flavor}</p>
        )}

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
