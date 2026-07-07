"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const subtotal = useCartStore((state) => state.subtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
        <ShoppingBag className="h-4.5 w-4.5" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="relative" aria-label={`Shopping cart, ${totalItems} items`} />
      }>
        <ShoppingBag className="h-4.5 w-4.5" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5 text-brand" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Looks like you haven&apos;t added anything to your cart yet. Discover our premium supplements.
              </p>
              <Link href="/shop" className={buttonVariants({ className: "mt-4 rounded-xl" })} onClick={() => setIsOpen(false)}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-xl bg-muted shrink-0 border border-border flex items-center justify-center overflow-hidden">
                    {item.product.images && item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="font-bold text-muted-foreground/20 text-2xl">GN</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.product.flavor || item.product.category?.name}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex h-8 items-center rounded-lg border border-border bg-background px-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-muted/20">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-3">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className={buttonVariants({ className: "w-full h-12 text-base rounded-xl bg-brand hover:bg-brand-light text-brand-foreground" })} onClick={() => setIsOpen(false)}>
              Checkout Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              Secure Checkout <span className="inline-block w-1.5 h-1.5 rounded-full bg-success"></span>
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
