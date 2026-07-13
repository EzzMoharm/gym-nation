"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
          <div className="h-4 w-48 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  // Calculations matching checkout logic
  const freeShippingThreshold = 75;
  const shippingCost = subtotal > freeShippingThreshold ? 0 : 9.99;
  const taxRate = 0.08; // 8% mock tax
  const estimatedTax = subtotal * taxRate;
  const total = subtotal + shippingCost + estimatedTax;

  // Free shipping progress variables
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountLeftForFreeShipping = freeShippingThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] pt-28 pb-12 flex items-center justify-center bg-muted/10">
        <Container className="max-w-md text-center space-y-6">
          <div className="mx-auto h-24 w-24 bg-card rounded-full flex items-center justify-center border border-border shadow-xs">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your Cart is Empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet. Fuel your gains with our premium nutrition items.
          </p>
          <Link href="/shop" className={buttonVariants({ size: "lg", className: "w-full rounded-xl bg-brand hover:bg-brand-light text-brand-foreground font-bold h-12" })}>
            Explore supplements
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-muted/10">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            Review your order items, adjust quantities, or check out when ready.
          </p>
        </div>

        {/* Free Shipping Tracker */}
        <div className="mb-8 p-5 bg-card border border-border rounded-2xl flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              {subtotal >= freeShippingThreshold ? (
                <p className="font-semibold text-success text-sm md:text-base">Congrats! You qualify for FREE Shipping!</p>
              ) : (
                <p className="font-medium text-sm md:text-base">
                  You are <span className="text-brand font-bold">{formatPrice(amountLeftForFreeShipping)}</span> away from <span className="font-semibold">FREE Shipping</span>!
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">Free standard shipping on orders over $75</p>
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${subtotal >= freeShippingThreshold ? "bg-success" : "bg-brand"}`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.product.id} 
                className="flex flex-col sm:flex-row gap-4 p-5 bg-card border border-border rounded-2xl hover:border-brand/20 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="relative h-28 w-28 bg-muted rounded-xl border border-border/50 shrink-0 flex items-center justify-center overflow-hidden self-center sm:self-auto">
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

                {/* Product Info & Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link 
                        href={`/shop/${item.product.slug}`}
                        className="font-bold text-base hover:text-brand transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {item.product.flavor || 
                          (typeof item.product.category === "string" 
                            ? item.product.category 
                            : item.product.category?.name) || 
                          "Fitness Supplement"}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1 hover:bg-destructive/10 rounded-lg"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    {/* Quantity controls */}
                    <div className="flex h-10 items-center rounded-xl border border-border bg-background px-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {/* Total Price */}
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">{formatPrice(item.product.price)} each</span>
                      <span className="font-bold text-lg text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">
                    {shippingCost === 0 ? <span className="text-success">FREE</span> : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Taxes (8%)</span>
                  <span className="font-semibold">{formatPrice(estimatedTax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4 text-base font-bold">
                <span>Total Amount</span>
                <span className="text-2xl font-black text-brand">{formatPrice(total)}</span>
              </div>

              <Link 
                href="/checkout" 
                className={buttonVariants({ 
                  className: "w-full h-12 text-base font-bold rounded-xl bg-brand hover:bg-brand-light text-brand-foreground cursor-pointer flex items-center justify-center gap-2" 
                })}
              >
                Proceed to Checkout
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>

              <div className="pt-4 border-t border-border/50 text-center space-y-3">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-success" /> Secure 256-Bit SSL checkout encryption.
                </p>
                <Link href="/shop" className="text-xs font-semibold text-brand hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
