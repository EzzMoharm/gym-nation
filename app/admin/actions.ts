"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================
// Image Upload
// ============================================

export async function uploadImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}

// ============================================
// Products CRUD
// ============================================

function mapProduct(product: any) {
  if (!product) return null;
  return {
    ...product,
    category: product.category?.name || null,
    brand: product.brand?.name || null,
    image_url: product.images?.[0]?.url || "",
  };
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name), images:product_images(url)")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapProduct), error: null };
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name), images:product_images(url)")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapProduct(data), error: null };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name), images:product_images(url)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapProduct(data), error: null };
}

export async function getActiveProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name), images:product_images(url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapProduct), error: null };
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name), images:product_images(url)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapProduct), error: null };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const productData = {
    name,
    slug,
    description: formData.get("description") as string || "",
    short_description: formData.get("short_description") as string || "",
    price: parseFloat(formData.get("price") as string) || 0,
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    category: formData.get("category") as string || "",
    brand: formData.get("brand") as string || "",
    flavor: formData.get("flavor") as string || "",
    servings: formData.get("servings")
      ? parseInt(formData.get("servings") as string)
      : null,
    serving_size: formData.get("serving_size") as string || "",
    ingredients: formData.get("ingredients") as string || "",
    image_url: formData.get("image_url") as string || "",
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") !== "false",
  };

  const { error } = await supabase.from("products").insert(productData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { error: null };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const productData = {
    name,
    slug,
    description: formData.get("description") as string || "",
    short_description: formData.get("short_description") as string || "",
    price: parseFloat(formData.get("price") as string) || 0,
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    category: formData.get("category") as string || "",
    brand: formData.get("brand") as string || "",
    flavor: formData.get("flavor") as string || "",
    servings: formData.get("servings")
      ? parseInt(formData.get("servings") as string)
      : null,
    serving_size: formData.get("serving_size") as string || "",
    ingredients: formData.get("ingredients") as string || "",
    image_url: formData.get("image_url") as string || "",
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") !== "false",
  };

  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  return { error: null };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { error: null };
}

// ============================================
// Training Plans CRUD
// ============================================

export async function getPlans() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getPlanById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getPlanBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getActivePlans() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getFeaturedPlans() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function createPlan(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const equipmentRaw = formData.get("equipment_needed") as string || "";
  const equipment = equipmentRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const planData = {
    name,
    slug,
    description: formData.get("description") as string || "",
    short_description: formData.get("short_description") as string || "",
    price: parseFloat(formData.get("price") as string) || 0,
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    duration_weeks: parseInt(formData.get("duration_weeks") as string) || 4,
    difficulty: formData.get("difficulty") as string || "beginner",
    goal: formData.get("goal") as string || "",
    category: formData.get("category") as string || "",
    equipment_needed: equipment,
    image_url: formData.get("image_url") as string || "",
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") !== "false",
  };

  const { error } = await supabase.from("training_plans").insert(planData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { error: null };
}

export async function updatePlan(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const equipmentRaw = formData.get("equipment_needed") as string || "";
  const equipment = equipmentRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const planData = {
    name,
    slug,
    description: formData.get("description") as string || "",
    short_description: formData.get("short_description") as string || "",
    price: parseFloat(formData.get("price") as string) || 0,
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    duration_weeks: parseInt(formData.get("duration_weeks") as string) || 4,
    difficulty: formData.get("difficulty") as string || "beginner",
    goal: formData.get("goal") as string || "",
    category: formData.get("category") as string || "",
    equipment_needed: equipment,
    image_url: formData.get("image_url") as string || "",
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") !== "false",
  };

  const { error } = await supabase
    .from("training_plans")
    .update(planData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  revalidatePath(`/plans/${slug}`);
  return { error: null };
}

export async function deletePlan(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("training_plans")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { error: null };
}

export async function getAllAdminOrders() {
  const supabase = await createClient();
  
  // Make sure the caller is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!user.email?.startsWith("admin") && profile?.role !== "admin") {
    return { data: [], error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profile:profiles(full_name, email)
    `)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!user.email?.startsWith("admin") && profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
  return { error: null };
}

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  // Make sure the caller is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!user.email?.startsWith("admin") && profile?.role !== "admin") {
    return { data: null, error: "Unauthorized" };
  }

  // 1. Calculate Total Revenue & Sales count from orders
  const { data: orders, error: ordersErr } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total,
      status,
      created_at,
      profile:profiles(email)
    `);

  if (ordersErr) return { data: null, error: ordersErr.message };

  const totalOrders = orders?.length || 0;
  const totalRevenue = (orders ?? [])
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + Number(o.total), 0);

  // 2. Fetch recent 5 orders
  const recentOrders = (orders ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((o) => ({
      order_number: o.order_number,
      email: (Array.isArray(o.profile) ? o.profile[0]?.email : (o.profile as any)?.email) || "guest@example.com",
      total: Number(o.total),
    }));

  // 3. Fetch top products ordered by sales_count desc (where sales_count > 0)
  const { data: topProducts, error: prodErr } = await supabase
    .from("products")
    .select("id, name, price, sales_count, images:product_images(url)")
    .gt("sales_count", 0)
    .order("sales_count", { ascending: false })
    .limit(4);

  const mappedTopProducts = (topProducts ?? []).map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    sales_count: product.sales_count,
    image_url: product.images?.[0]?.url || "",
  }));

  return {
    data: {
      totalRevenue,
      totalOrders,
      recentOrders,
      topProducts: mappedTopProducts,
    },
    error: null,
  };
}
