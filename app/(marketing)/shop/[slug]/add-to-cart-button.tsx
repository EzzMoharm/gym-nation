"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuth();
  const router = useRouter();

  const handleAdd = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex h-14 items-center rounded-xl border border-border bg-background px-2">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        onClick={handleAdd}
        size="lg"
        className="h-14 flex-1 bg-brand hover:bg-brand-light text-brand-foreground font-semibold rounded-xl gap-2"
      >
        <ShoppingBag className="h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
