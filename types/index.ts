// ============================================
// GYM NATION — Database & Application Types
// ============================================

// --- User & Auth ---
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

// --- Products ---
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  cost_per_item: number | null;
  sku: string;
  barcode: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  brand_id: string;
  weight: number | null;
  weight_unit: "g" | "kg" | "oz" | "lb";
  servings: number | null;
  serving_size: string | null;
  flavor: string | null;
  ingredients: string | null;
  nutrition_facts: NutritionFacts | null;
  tags: string[];
  goal: string | null;
  average_rating: number;
  review_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  reviews?: ProductReview[];
}

export interface NutritionFacts {
  calories: number;
  total_fat: number;
  saturated_fat: number;
  trans_fat: number;
  cholesterol: number;
  sodium: number;
  total_carbohydrates: number;
  dietary_fiber: number;
  total_sugars: number;
  added_sugars: number;
  protein: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  // Relations
  profile?: Profile;
}

// --- Categories ---
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  position: number;
  is_active: boolean;
  product_count?: number;
}

// --- Brands ---
export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
}

// --- Training Plans ---
export interface TrainingPlan {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  image_url: string | null;
  price: number;
  compare_at_price: number | null;
  duration_weeks: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "elite";
  goal: string;
  category: string;
  equipment_needed: string[];
  workout_schedule: WorkoutDay[];
  nutrition_recommendations: string | null;
  is_active: boolean;
  is_featured: boolean;
  creator_id: string;
  subscriber_count: number;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDay {
  day: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

// --- Subscriptions ---
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "paused" | "cancelled" | "expired";
  current_week: number;
  start_date: string;
  end_date: string | null;
  cancelled_at: string | null;
  created_at: string;
  // Relations
  plan?: TrainingPlan;
}

// --- Orders ---
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  coupon_id: string | null;
  shipping_address: Address;
  billing_address: Address | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
  coupon?: Coupon;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Relations
  product?: Product;
}

// --- Coupons ---
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_purchase: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

// --- Cart ---
export interface CartItem {
  id: string;
  user_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  // Relations
  product?: Product;
}

// --- Wishlist ---
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Relations
  product?: Product;
}

// --- Addresses ---
export interface Address {
  id?: string;
  user_id?: string;
  label: string;
  full_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default?: boolean;
}

// --- Notifications ---
export interface Notification {
  id: string;
  user_id: string;
  type: "order" | "promotion" | "system" | "review";
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// --- Blog ---
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  is_published: boolean;
  published_at: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Relations
  author?: Profile;
}

// --- UI/Utility Types ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FilterState {
  category: string | null;
  brand: string | null;
  goal: string | null;
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  search: string;
  sort: string;
  page: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  item_count: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  revenue_change: number;
  orders_change: number;
  customers_change: number;
  recent_orders: Order[];
  top_products: Product[];
  revenue_by_month: { month: string; revenue: number }[];
}
