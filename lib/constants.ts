// ============================================
// GYM NATION — Application Constants
// ============================================

export const APP_NAME = "Gym Nation" as const;
export const APP_DESCRIPTION =
  "Premium fitness platform — Nutrition Store, Training Plans & More" as const;
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://gymnation.com";

// Navigation
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Training Plans", href: "/plans" },
  { label: "About", href: "/about" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Orders", href: "/dashboard/orders", icon: "Package" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "Heart" },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: "CreditCard" },
  { label: "Addresses", href: "/dashboard/addresses", icon: "MapPin" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "ShoppingBag" },
  { label: "Categories", href: "/admin/categories", icon: "Grid3X3" },
  { label: "Brands", href: "/admin/brands", icon: "Tag" },
  { label: "Orders", href: "/admin/orders", icon: "Package" },
  { label: "Training Plans", href: "/admin/plans", icon: "Dumbbell" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Coupons", href: "/admin/coupons", icon: "Ticket" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
] as const;

// Product categories (matching seed data)
export const PRODUCT_CATEGORIES = [
  "Protein",
  "Pre-Workout",
  "Creatine",
  "Vitamins & Minerals",
  "Amino Acids",
  "Weight Management",
] as const;

// Training plan difficulties
export const PLAN_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Elite",
] as const;

// Training plan goals
export const PLAN_GOALS = [
  "Build Muscle",
  "Lose Fat",
  "Increase Strength",
  "Improve Endurance",
  "General Fitness",
  "Athletic Performance",
] as const;

// Sort options for shop
export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Best Selling", value: "best_selling" },
] as const;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 5;

// Cart
export const MAX_QUANTITY_PER_ITEM = 10;
export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_COST = 5.99;
export const TAX_RATE = 0.08;

// Order statuses
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

// Subscription statuses
export const SUBSCRIPTION_STATUSES = [
  "active",
  "paused",
  "cancelled",
  "expired",
] as const;

// Footer
export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Protein", href: "/shop?category=protein" },
    { label: "Pre-Workout", href: "/shop?category=pre-workout" },
    { label: "Creatine", href: "/shop?category=creatine" },
    { label: "Vitamins", href: "/shop?category=vitamins" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "Instagram" },
  { label: "X", href: "#", icon: "X" },
  { label: "Facebook", href: "#", icon: "Facebook" },
  { label: "YouTube", href: "#", icon: "Youtube" },
] as const;
