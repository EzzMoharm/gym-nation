"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

interface WishlistEntry {
  id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const addToCart = useCartStore((s) => s.addItem);
  const supabase = createClient();

  useEffect(() => {
    async function loadWishlist() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, product:products(*, images:product_images(url))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data as any);
      }
      setIsLoading(false);
    }
    loadWishlist();
  }, [supabase]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove from wishlist");
    }
    setRemovingId(null);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
          <p className="mt-2 text-muted-foreground">Your saved products.</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          {items.length > 0
            ? `You have ${items.length} saved product${items.length !== 1 ? "s" : ""}.`
            : "Your saved products."}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
          <p className="text-muted-foreground mb-6">
            Browse our shop and click the heart icon on products you love.
          </p>
          <Link href="/shop" className={buttonVariants({ className: "rounded-xl" })}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((entry) => {
            const product = entry.product;
            if (!product) return null;

            return (
              <Card key={entry.id} className="overflow-hidden hover:border-brand/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Product image */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="relative h-24 w-24 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0"
                    >
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="font-bold text-muted-foreground/30 text-lg">GN</span>
                      )}
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link href={`/shop/${product.slug}`} className="font-semibold text-sm hover:text-brand transition-colors line-clamp-2">
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {product.short_description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-brand">{formatPrice(product.price)}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-border">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 text-xs gap-1.5 hover:bg-brand/5 hover:text-brand"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </Button>
                    <div className="w-px bg-border" />
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 text-xs gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => handleRemove(entry.product_id)}
                      disabled={removingId === entry.product_id}
                    >
                      {removingId === entry.product_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
