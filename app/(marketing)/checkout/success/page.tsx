"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  const [orderId, setOrderId] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderId(Math.floor(Math.random() * 100000).toString());
  }, []);
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Container className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 border-4 border-success/20">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight mb-4">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your order #GN-{orderId} has been placed successfully.
          We&apos;ll send you a confirmation email shortly.
        </p>

        <div className="space-y-4">
          <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "w-full h-14 rounded-xl bg-brand hover:bg-brand-light text-brand-foreground font-bold" })}>
            View Order Status
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full h-14 rounded-xl" })}>
            Continue Shopping
          </Link>
        </div>
      </Container>
    </div>
  );
}
