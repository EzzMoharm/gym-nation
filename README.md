# Gym Nation — Premium Fitness Platform

Gym Nation is a premium, high-performance E-Commerce Supplement Store and Expert Training Plan Marketplace. The application is built using a modern, fully responsive web architecture with premium design aesthetics (glassmorphism, vibrant dark mode styling, and smooth micro-animations).

---

## 🚀 Technology Stack
* **Framework**: Next.js 16.2.10 (Turbopack, App Router)
* **Database & Auth**: Supabase (PostgreSQL, Realtime RLS Policies, Session Caching)
* **Styling**: Tailwind CSS (Custom color system, fluid variables)
* **State Management**: Zustand (Persisted state for Shopping Cart & Wishlist counters)
* **Client Validation**: Zod & React Hook Form
* **UI & Animation**: Motion (Framer Motion) & Lucide Icons

---

## ✨ Features

### 🛒 Supplement & Gear Store
* **Interactive Catalog**: Live client-side product search, category tab filtering, brand toggle checkboxes, and a dual-control price range slider.
* **Premium Details View**: Fluid layout displaying supplement highlights (ingredients, servings, flavor variations, and suggested use) with image scaling transitions.
* **Wishlist Syncing**: Single-click toggling to save items to a client wishlist, dynamically updating the global header counter.
* **Cart Authentication Gating**: Blocks adding items to the cart or viewing the cart (via drawer or page) unless signed in. Redirects users to the login page and brings them back to their previous page upon successful authentication. Automatically purges cart state on logout.

### 🏋️ Training Plans Portal
* **Program Directory**: Category lists to filter elite strength, hypertrophy, fat loss, or conditioning routines.
* **Subscribed Programs**: Access active subscriptions inside the client dashboard to track program durations, goals, difficulty level mappings, and exercise instructions.

### 💳 Cart & Checkout Pipeline
* **Shopping Cart Page**: Full-screen cart view displaying order items, quantity controls, automatic tax estimation (8%), and a **Free Shipping Tracker** (visual progress bar toward the $75 threshold).
* **Checkout Screen**: Secure address auto-fill details, fully available and interactive card payment inputs (card number, expiration, CVC) with automatic formatting filters and form validation.
* **Confirmation Page**: Dynamic orders success screen showing the unique generated receipt numbers (`GN-XXXX`) and routing directly to the order tracking portal.

### 📊 Dashboard & Accounts Hub
* **User Dashboard & Live Tracking**: Overview of orders history, subscription progress gauges, active wishlist items, and personal settings (bio, weight, height, profile photo upload, and fitness targets). Features an **animated horizontal stepper** tracking order milestones (`Placed` -> `Processing` -> `Shipped` -> `Delivered`) updating in real-time when the status is modified.
* **Admin Terminal & Notifications**: Real-time sales metrics (Total Revenue, Order Volumes, Top Selling Products), product CRUD portal, training plans CRUD builder, and order status updates. Includes a **real-time header notification bell** that plays a custom Web Audio API chime sound, triggers success toasts, and lists recent orders on new checkouts.
* **Database Resilience Fallbacks**: Supports automatic, silent 12-15 second polling backups for all real-time order lists and notifications to guarantee updates even if database-level real-time replication is unavailable.

### 🛡️ Compliance & Support
* **GDPR Cookie Consent**: Sleek slide-in consent dialog that writes real browser cookies (`gym_nation_cookie_consent=accepted`) to remember client preferences for 365 days.
* **Support Catch-all Pages**: Clean templates covering all support, legal, and company information footer links (Careers, Privacy Policy, Shipping Info, Returns & Exchanges, etc.).

---

## 🗄️ Database Architecture

Gym Nation uses a relational PostgreSQL schema hosted on Supabase:

* **`profiles`**: User details (full name, phone, height, weight, gender, date of birth, bio, role, and avatar URL).
* **`products`**: Supplement products (slugs, pricing, serving sizes, ingredients, flavor, ratings, and sales counts).
* **`product_images`**: High-resolution image urls mapped to product ids.
* **`categories`**: Product classifications (Protein, Pre-Workout, Creatine, Amino Acids, Weight Management, Gear).
* **`brands`**: Manufacturing brands (Optimum Nutrition, Cellucor, rogue, transparent Labs, etc.).
* **`orders` & `order_items`**: Order details, shipping addresses, shipping costs, taxes, and purchased product logs.
* **`wishlist`**: Saved items mapping user IDs to product IDs.
* **`subscriptions`**: Active training plan subscriptions detailing start dates, end dates, and current course week progress.
* **`training_plans`**: Workout guides containing weekly schedules, difficulty ratings, prices, and required gym equipment.

---

## 📁 File Structure

```bash
├── app/
│   ├── (auth)/                # Login, Register, Forgot Password routes
│   ├── (marketing)/           # Marketing routes (Cart, Shop, Plans, About, support [...slug])
│   ├── admin/                 # Admin Dashboard, CRUD engines, Actions
│   ├── dashboard/             # User Profile Settings, Subscriptions, Orders
│   ├── layout.tsx             # Global layout & Providers injection
│   └── globals.css            # Tailwind theme tokens & color properties
├── components/
│   ├── admin/                 # Admin Dialogs and forms
│   ├── auth/                  # Auth widgets (Login, register, sign out)
│   ├── layout/                # Global Header, Footer, and Cookie Consent
│   ├── sections/              # Homepage components (Hero, training plans, testimonials)
│   ├── shop/                  # Product Card, Cart Drawer, Shop Filters
│   └── ui/                    # Base UI primitives (Buttons, inputs, cards)
├── lib/
│   ├── store/                 # Zustand stores (Cart, Wishlist)
│   ├── supabase/              # Supabase Client & Server client generators
│   ├── constants.ts           # Shared navigation lists, tax rates, and sizes
│   └── utils.ts               # Date formattings and price styling formulas
└── types/
    └── index.ts               # Shared database interfaces & UI definitions
```

---

## 🛠️ Local Development

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_email_api_key_optional
```

For admin order management, either add `SUPABASE_SERVICE_ROLE_KEY` (server-only, from Supabase Project Settings → API) **or** run the SQL migration in `supabase/migrations/20260713000000_admin_orders_rls.sql` in the Supabase SQL editor.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Build for Production
```bash
npm run build
```
