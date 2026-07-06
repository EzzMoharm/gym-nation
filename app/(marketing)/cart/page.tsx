import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { CartDrawer } from "@/components/shop/cart-drawer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your Cart | Gym Nation",
  description: "Review the items in your shopping cart.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen py-24">
      <Container className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Shopping Cart</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Manage your items before proceeding to checkout.
        </p>
        
        {/* Because we have a global cart drawer, the /cart page itself can just trigger the drawer or show a full-page version. For simplicity, we just redirect users to use the drawer or show the full page cart UI (which shares logic with drawer). Here we just provide a placeholder to redirect to shop. */}
        <div className="p-12 border border-border rounded-2xl bg-muted/20">
          <p className="mb-6">Please use the cart icon in the navigation bar to view your items.</p>
          <Link href="/shop" className={buttonVariants({ size: "lg", className: "rounded-xl" })}>
            Continue Shopping
          </Link>
        </div>
      </Container>
    </div>
  );
}
