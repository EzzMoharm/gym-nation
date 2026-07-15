"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/container";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, Lock, CreditCard, Loader2, Dumbbell } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { createOrder, subscribeToPlan } from "@/app/dashboard/actions";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const isPlanCheckout = !!planId;

  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const supabase = createClient();
  
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  
  // Card payment states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Load user default addresses & load plan info if it is a plan checkout
  useEffect(() => {
    setIsMounted(true);

    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        
        // Fetch default address
        const { data: addresses } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .single();

        if (addresses) {
          const names = addresses.full_name.split(" ");
          setFirstName(names[0] || "");
          setLastName(names.slice(1).join(" ") || "");
          setAddress(addresses.address_line_1 || "");
          setAddress2(addresses.address_line_2 || "");
          setCity(addresses.city || "");
          setState(addresses.state || "");
          setPostalCode(addresses.postal_code || "");
          setCountry(addresses.country || "US");
          setPhone(addresses.phone || "");
        }
      }
    }

    async function loadPlanData() {
      if (!planId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("plan_id", planId)
          .eq("status", "active")
          .maybeSingle();

        if (existing) {
          toast.warning("You are already actively subscribed to this training plan.");
          router.push("/dashboard/subscriptions");
          return;
        }
      }

      const { data, error } = await supabase
        .from("training_plans")
        .select("*")
        .eq("id", planId)
        .single();
      
      if (!error && data) {
        setSelectedPlan(data);
      } else {
        toast.error("Failed to load training plan details");
      }
    }

    loadUserData();
    if (isPlanCheckout) {
      loadPlanData();
    }
  }, [supabase, planId, isPlanCheckout]);

  if (!isMounted) return null;

  const isEmpty = isPlanCheckout ? !selectedPlan : items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          {isPlanCheckout ? "Loading Subscription details..." : "Your cart is empty"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isPlanCheckout ? "Retrieving plan security info." : "Add some products to proceed to checkout."}
        </p>
        <Link href={isPlanCheckout ? "/plans" : "/shop"} className={buttonVariants({ className: "rounded-xl" })}>
          {isPlanCheckout ? "Browse Plans" : "Browse Products"}
        </Link>
      </div>
    );
  }

  const currentSubtotal = isPlanCheckout ? (selectedPlan?.price || 0) : subtotal;
  const shipping = isPlanCheckout ? 0 : (currentSubtotal > 75 ? 0 : 9.99);
  const taxes = currentSubtotal * 0.08; // 8% mock tax
  const total = currentSubtotal + shipping + taxes;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please enter your payment card details to complete checkout");
      setIsProcessing(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to complete checkout");
        router.push(`/login?redirect=${window.location.pathname}${window.location.search}`);
        return;
      }

      if (isPlanCheckout) {
        // Process subscription checkout
        const res = await subscribeToPlan(planId!);
        if (res && res.error) {
          throw new Error(res.error);
        }
        toast.success("Subscription activated successfully!");
        router.push("/dashboard/subscriptions");
        return;
      }

      // Process standard cart order checkout
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images?.[0]?.url || null,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
        shipping_address: {
          full_name: `${firstName} ${lastName}`.trim(),
          address_line_1: address,
          address_line_2: address2 || undefined,
          city,
          state,
          postal_code: postalCode,
          country,
          phone: phone || undefined,
        },
        subtotal,
        shipping_cost: shipping,
        tax_amount: taxes,
        total,
      };

      const { data: order, error } = await createOrder(orderData);
      if (error) throw new Error(error);

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?order_number=${order.order_number}`);
    } catch (err: any) {
      toast.error("Failed to process checkout: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 bg-muted/10">
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
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      className="h-11 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Shipping / Address */}
              <section className="bg-card p-6 rounded-2xl border border-border">
                <h2 className="text-xl font-semibold mb-4">
                  {isPlanCheckout ? "Billing Address" : "Shipping Address"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName" 
                      required 
                      className="h-11 rounded-xl"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName" 
                      required 
                      className="h-11 rounded-xl"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Address Line 1</Label>
                    <Input 
                      id="address" 
                      required 
                      className="h-11 rounded-xl"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input 
                      id="address2" 
                      className="h-11 rounded-xl"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      required 
                      className="h-11 rounded-xl"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="state">State / Province</Label>
                    <Input 
                      id="state" 
                      required 
                      className="h-11 rounded-xl"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input 
                      id="postalCode" 
                      required 
                      className="h-11 rounded-xl"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      required 
                      className="h-11 rounded-xl"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      className="h-11 rounded-xl"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="4242 4242 4242 4242" 
                      required 
                      className="h-11 rounded-xl"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const matches = val.match(/\d{1,4}/g);
                        setCardNumber(matches ? matches.join(" ") : val);
                      }}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiration date</Label>
                      <Input 
                        id="cardExpiry" 
                        placeholder="MM/YY" 
                        required 
                        className="h-11 rounded-xl"
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length >= 3) {
                            setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">Security code (CVC)</Label>
                      <Input 
                        id="cardCvc" 
                        placeholder="123" 
                        type="password"
                        required 
                        className="h-11 rounded-xl"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-xl text-lg font-bold bg-brand hover:bg-brand-light text-brand-foreground cursor-pointer"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : `Pay ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0 order-1 lg:order-2">
            <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {isPlanCheckout && selectedPlan ? (
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 bg-brand/10 rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
                      <Dumbbell className="h-8 w-8 text-brand" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-semibold line-clamp-2">{selectedPlan.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedPlan.duration_weeks} Weeks Subscription</p>
                    </div>
                    <div className="flex flex-col justify-center text-sm font-semibold">
                      {formatPrice(selectedPlan.price)}
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-16 w-16 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="font-bold text-muted-foreground/20 text-xs">GN</span>
                        )}
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground z-10">
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
                  ))
                )}
              </div>

              <div className="space-y-3 border-t border-border pt-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(currentSubtotal)}</span>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
