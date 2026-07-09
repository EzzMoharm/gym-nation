-- ============================================
-- GYM NATION — Consolidated Database Schema Setup
-- Run this script in the Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Drop existing objects if they exist to start fresh
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.handle_updated_at() cascade;

-- Drop existing types if they exist
drop type if exists public.user_role cascade;
drop type if exists public.weight_unit cascade;
drop type if exists public.plan_difficulty cascade;
drop type if exists public.subscription_status cascade;
drop type if exists public.order_status cascade;
drop type if exists public.discount_type cascade;

-- ============================================
-- 1. TYPES & ENUMS
-- ============================================
create type public.user_role as enum ('customer', 'admin');
create type public.weight_unit as enum ('g', 'kg', 'oz', 'lb');
create type public.plan_difficulty as enum ('beginner', 'intermediate', 'advanced', 'elite');
create type public.subscription_status as enum ('active', 'paused', 'cancelled', 'expired');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.discount_type as enum ('percentage', 'fixed');

-- ============================================
-- 2. USERS & PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  phone text,
  role public.user_role default 'customer'::public.user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- Helper security definer function for Admin Role check
-- Prevents infinite recursion in RLS policies
-- ============================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'::public.user_role
  );
$$;

-- ============================================
-- 3. PRODUCTS & INVENTORY
-- ============================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  position integer default 0 not null,
  is_active boolean default true not null
);

create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  website_url text,
  is_active boolean default true not null
);

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  short_description text not null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  cost_per_item numeric(10,2) check (cost_per_item >= 0),
  sku text unique not null,
  barcode text,
  stock_quantity integer default 0 not null check (stock_quantity >= 0),
  is_active boolean default true not null,
  is_featured boolean default false not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  brand_id uuid references public.brands(id) on delete restrict not null,
  
  -- Specifications
  weight numeric(10,2) check (weight >= 0),
  weight_unit public.weight_unit default 'g'::public.weight_unit,
  servings integer check (servings > 0),
  serving_size text,
  flavor text,
  ingredients text,
  nutrition_facts jsonb,
  tags text[] default array[]::text[],
  goal text,
  
  -- Denormalized stats
  average_rating numeric(3,2) default 0 not null,
  review_count integer default 0 not null,
  sales_count integer default 0 not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  alt_text text not null,
  position integer default 0 not null,
  is_primary boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.product_reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  comment text not null,
  is_verified boolean default false not null,
  helpful_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, user_id)
);

-- ============================================
-- 4. TRAINING PLANS
-- ============================================
create table public.training_plans (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  short_description text not null,
  image_url text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  duration_weeks integer not null check (duration_weeks > 0),
  difficulty public.plan_difficulty not null,
  goal text not null,
  category text not null,
  equipment_needed text[] default array[]::text[],
  workout_schedule jsonb not null, -- Stores array of WorkoutDay
  nutrition_recommendations text,
  is_active boolean default true not null,
  is_featured boolean default false not null,
  creator_id uuid references public.profiles(id) on delete restrict not null,
  
  -- Denormalized stats
  subscriber_count integer default 0 not null,
  average_rating numeric(3,2) default 0 not null,
  review_count integer default 0 not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.plan_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.training_plans(id) on delete restrict not null,
  status public.subscription_status default 'active'::public.subscription_status not null,
  current_week integer default 1 not null,
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, plan_id)
);

-- ============================================
-- 5. E-COMMERCE (ORDERS, COUPONS & CART)
-- ============================================
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  description text,
  discount_type public.discount_type not null,
  discount_value numeric(10,2) not null check (discount_value > 0),
  minimum_purchase numeric(10,2),
  maximum_discount numeric(10,2),
  usage_limit integer,
  usage_count integer default 0 not null,
  is_active boolean default true not null,
  starts_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text not null,
  full_name text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  phone text not null,
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete restrict not null,
  status public.order_status default 'pending'::public.order_status not null,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  shipping_cost numeric(10,2) not null check (shipping_cost >= 0),
  tax_amount numeric(10,2) not null check (tax_amount >= 0),
  discount_amount numeric(10,2) not null check (discount_amount >= 0),
  total numeric(10,2) not null check (total >= 0),
  coupon_id uuid references public.coupons(id) on delete set null,
  shipping_address jsonb not null,
  billing_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  product_name text not null,
  product_image text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text, -- For anonymous carts
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id),
  unique(session_id, product_id),
  check (user_id is not null or session_id is not null)
);

create table public.wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- ============================================
-- 6. TRIGGERS & FUNCTIONS
-- ============================================

-- Function to handle auto-updating `updated_at`
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all relevant tables
create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute procedure public.handle_updated_at();
create trigger set_training_plans_updated_at before update on public.training_plans for each row execute procedure public.handle_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.handle_updated_at();
create trigger set_cart_items_updated_at before update on public.cart_items for each row execute procedure public.handle_updated_at();

-- Function to handle auto-creating profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup (executes after a new record in auth.users)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;
alter table public.training_plans enable row level security;
alter table public.plan_subscriptions enable row level security;
alter table public.coupons enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;

-- PROFILES: Users can read/update their own profile. Admins can view all.
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

-- PUBLIC READS: Products, Categories, Brands, Training Plans, Images & Reviews are visible to everyone
create policy "Public can view active categories" on public.categories for select using (is_active = true);
create policy "Public can view active brands" on public.brands for select using (is_active = true);
create policy "Public can view active products" on public.products for select using (is_active = true);
create policy "Public can view product images" on public.product_images for select using (true);
create policy "Public can view product reviews" on public.product_reviews for select using (true);
create policy "Public can view active training plans" on public.training_plans for select using (is_active = true);

-- CART & WISHLIST: Users manage their own items
create policy "Users manage own cart" on public.cart_items for all using (
  auth.uid() = user_id or 
  session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);
create policy "Users manage own wishlist" on public.wishlist_items for all using (auth.uid() = user_id);

-- ORDERS & SUBSCRIPTIONS: Users can view their own
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where public.orders.id = public.order_items.order_id and public.orders.user_id = auth.uid())
);
create policy "Users can view own subscriptions" on public.plan_subscriptions for select using (auth.uid() = user_id);

-- ADDRESSES: Users can manage their own
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- REVIEWS: Authenticated users can write/edit reviews
create policy "Authenticated users can create reviews" on public.product_reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.product_reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.product_reviews for delete using (auth.uid() = user_id);

-- ============================================
-- 8. ADMIN SERVICE ACCESS (BYPASS FOR ADMINS)
-- ============================================
-- Grant full insert, update, delete control to Admin users
create policy "Admins have full access to categories" on public.categories for all using (public.is_admin());
create policy "Admins have full access to brands" on public.brands for all using (public.is_admin());
create policy "Admins have full access to products" on public.products for all using (public.is_admin());
create policy "Admins have full access to product_images" on public.product_images for all using (public.is_admin());
create policy "Admins have full access to training_plans" on public.training_plans for all using (public.is_admin());
create policy "Admins have full access to plan_subscriptions" on public.plan_subscriptions for all using (public.is_admin());
create policy "Admins have full access to coupons" on public.coupons for all using (public.is_admin());
create policy "Admins have full access to orders" on public.orders for all using (public.is_admin());
create policy "Admins have full access to order_items" on public.order_items for all using (public.is_admin());
