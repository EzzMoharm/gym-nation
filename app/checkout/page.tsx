"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, Lock, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to proceed to checkout.</p>
        <Link href="/shop" className={buttonVariants({ className: "rounded-xl" })}>
          Browse Products
        </Link>
      </div>
    );
  }

  const shipping = subtotal > 75 ? 0 : 9.99;
  const taxes = subtotal * 0.08; // 8% mock tax
  const total = subtotal + shipping + taxes;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/10">
      <Container>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Section */}
          <div className="flex-1 order-2 lg:order-1">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact */}
              <section className="bg-card p-6 rounded-2xl border border-border">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" required className="h-11 rounded-xl" />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section className="bg-card p-6 rounded-2xl border border-border">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" required className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" required className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input id="postalCode" required className="h-11 rounded-xl" />
                  </div>
                </div>
              </section>

              {/* Payment Mock */}
              <section className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="rounded-xl border border-border p-4 bg-muted/30 mb-6">
                  <p className="text-sm text-center text-muted-foreground">
                    This is a demo store. No real payment will be processed.
                  </p>
                </div>
                <div className="space-y-4 opacity-50 pointer-events-none">
                  <div className="space-y-2">
                    <Label>Card number</Label>
                    <Input value="•••• •••• •••• 4242" readOnly className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiration date</Label>
                      <Input value="12/25" readOnly className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Security code</Label>
                      <Input value="123" readOnly className="h-11 rounded-xl" />
                    </div>
                  </div>
                </div>
              </section>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-xl text-lg font-bold bg-brand hover:bg-brand-light text-brand-foreground"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0 order-1 lg:order-2">
            <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-16 w-16 bg-muted rounded-lg border border-border flex items-center justify-center font-bold text-muted-foreground/20 text-xs shrink-0">
                      GN
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                    </div>
                    <div className="flex flex-col justify-center text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Taxes</span>
                  <span className="font-medium">{formatPrice(taxes)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-2xl font-black text-brand">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
