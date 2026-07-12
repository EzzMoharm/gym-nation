"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Product } from "@/types";

export function WishlistButton({ product }: { product: Product }) {
  const { wishlistIds, toggleWishlist, loadWishlist } = useWishlistStore();
  const isWishlisted = wishlistIds.includes(product.id);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isWishlisted ? "secondary" : "outline"}
      size="lg"
      className="h-14 rounded-xl px-8 gap-2 shrink-0 cursor-pointer transition-all border border-border"
    >
      <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
      <span>{isWishlisted ? "Saved" : "Save"}</span>
    </Button>
  );
}
