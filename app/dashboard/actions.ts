"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================
// Orders
// ============================================

export async function getMyOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createOrder(orderData: {
  items: {
    product_id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    unit_price: number;
  }[];
  shipping_address: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  // Generate order number
  const orderNumber = `GN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: "pending",
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shipping_cost,
      tax_amount: orderData.tax_amount,
      discount_amount: 0,
      total: orderData.total,
      shipping_address: orderData.shipping_address,
    })
    .select()
    .single();

  if (orderError) return { data: null, error: orderError.message };

  // Insert order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image: item.product_image,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.unit_price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) return { data: null, error: itemsError.message };

  // Optionally save the address
  const { data: existingAddresses } = await supabase
    .from("addresses")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const isFirst = !existingAddresses || existingAddresses.length === 0;

  await supabase.from("addresses").insert({
    user_id: user.id,
    label: "Shipping",
    full_name: orderData.shipping_address.full_name,
    address_line_1: orderData.shipping_address.address_line_1,
    address_line_2: orderData.shipping_address.address_line_2 || null,
    city: orderData.shipping_address.city,
    state: orderData.shipping_address.state,
    postal_code: orderData.shipping_address.postal_code,
    country: orderData.shipping_address.country || "US",
    phone: orderData.shipping_address.phone || null,
    is_default: isFirst,
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/addresses");

  // Trigger email confirmation (Feature 2)
  try {
    const { sendOrderConfirmationEmail } = await import("@/lib/email");
    await sendOrderConfirmationEmail(user.email || "", {
      orderNumber: order.order_number,
      total: order.total,
      items: orderData.items,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }

  return { data: order, error: null };
}

// ============================================
// Wishlist
// ============================================

export async function getMyWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("wishlist")
    .select("*, product:products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function toggleWishlistItem(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { added: false, error: "Not authenticated" };

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Remove from wishlist
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", existing.id);

    if (error) return { added: false, error: error.message };
    revalidatePath("/dashboard/wishlist");
    return { added: false, error: null };
  } else {
    // Add to wishlist
    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });

    if (error) return { added: true, error: error.message };
    revalidatePath("/dashboard/wishlist");
    return { added: true, error: null };
  }
}

export async function getWishlistProductIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id);

  return (data ?? []).map((item) => item.product_id);
}

export async function removeFromWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/wishlist");
  return { error: null };
}

// ============================================
// Addresses
// ============================================

export async function getMyAddresses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function createAddress(addressData: {
  label: string;
  full_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // If setting as default, unset other defaults first
  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    ...addressData,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/addresses");
  return { error: null };
}

export async function updateAddress(
  id: string,
  addressData: {
    label?: string;
    full_name?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
    is_default?: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({ ...addressData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/addresses");
  return { error: null };
}

export async function deleteAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/addresses");
  return { error: null };
}

export async function setDefaultAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Unset all defaults
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set new default
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/addresses");
  return { error: null };
}

// ============================================
// Subscriptions
// ============================================

export async function getMySubscriptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:training_plans(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function subscribeToPlan(planId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch plan details to get duration
  const { data: plan } = await supabase
    .from("training_plans")
    .select("name, duration_weeks")
    .eq("id", planId)
    .single();

  const durationWeeks = plan?.duration_weeks || 12;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + (durationWeeks * 7));

  // Check if already subscribed to this plan and active
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("plan_id", planId)
    .eq("status", "active")
    .maybeSingle();

  if (existing) {
    return { error: "You are already actively subscribed to this training plan" };
  }

  const { error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan_id: planId,
      status: "active",
      current_week: 1,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

  if (error) return { error: error.message };

  // Sync email confirmation trigger (Feature 2)
  try {
    const { sendSubscriptionConfirmationEmail } = await import("@/lib/email");
    await sendSubscriptionConfirmationEmail(user.email || "", plan?.name || "Premium Training Plan");
  } catch (err) {
    console.error("Failed to send subscription confirmation email:", err);
  }

  revalidatePath("/dashboard/subscriptions");
  revalidatePath("/dashboard/plans");
  return { error: null };
}
