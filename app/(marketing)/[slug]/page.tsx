import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Truck, 
  RotateCcw, 
  MapPin, 
  HelpCircle, 
  Mail, 
  Briefcase, 
  BookOpen, 
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  Dumbbell
} from "lucide-react";

// Page specifications interface
interface PageSpec {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const SUPPORT_PAGES: Record<string, PageSpec> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we collect, utilize, and protect your personal information.",
    icon: ShieldCheck,
    content: (
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We collect information you provide directly to us when creating an account, ordering supplements, subscribing to active training programs, or interacting with our client support. This includes your name, email, billing address, height, weight, and fitness targets.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Security Standards</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Gym Nation implements industrial-grade SSL 256-bit encryption for checkout data. We partner with secure credential providers to process transactions and handle personal details.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Your Data Rights</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            You can review, edit, or request deletion of your account settings, addresses, and data records by visiting your Client Dashboard or contacting support@gymnation.com.
          </p>
        </section>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Rules, guidelines, and policies for using Gym Nation.",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Subscriptions & Programs</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            By purchasing a training plan, you receive individual, non-transferable access to the training calendar, workout instructions, and exercises. Plans are charged on a monthly or one-off basis as stated on the product page.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Product Purchases</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We reserve the right to refuse or cancel any order of supplements or gear due to incorrect pricing, out-of-stock listings, or suspected fraud. All prices are listed in USD.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. User Responsibility</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Consult a medical physician before performing any intensive workout programs or introducing new sports nutrition supplements to your diet. Gym Nation is not liable for injury or health complications.
          </p>
        </section>
      </div>
    )
  },
  cookies: {
    title: "Cookie Policy",
    subtitle: "Understand how cookies and local caching maintain your shop session.",
    icon: Cookie,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-sm">
          Gym Nation uses cookies, local storage, and caching techniques to optimize browsing speed and persist critical states.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Essential Cookies</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            These cookies are strictly necessary to remember the items in your shopping cart, manage user authentication sessions with Supabase Auth, and securely process client checkouts.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Performance & Preferences</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We utilize basic analytic parameters to track user navigation and resolve layout bugs, helping us continuously refine the active client dashboard experience.
          </p>
        </section>
      </div>
    )
  },
  shipping: {
    title: "Shipping & Delivery",
    subtitle: "Fast, reliable shipping schedules to keep you fueled.",
    icon: Truck,
    content: (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <h3 className="font-bold text-base mb-1">Standard Shipping</h3>
            <p className="text-sm text-muted-foreground">$9.99 flat rate or FREE for all orders over $75. Arrives in 3-5 business days.</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <h3 className="font-bold text-base mb-1">Express Delivery</h3>
            <p className="text-sm text-muted-foreground">Express shipping available at checkout for $19.99. Arrives in 1-2 business days.</p>
          </div>
        </div>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Fulfillment Timeline</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            All supplement and gear orders placed before 2:00 PM EST are packaged and shipped on the same business day. Orders placed over weekends or national holidays are dispatched on the next business day.
          </p>
        </section>
      </div>
    )
  },
  returns: {
    title: "Returns & Exchanges",
    subtitle: "Our 30-day premium client satisfaction guarantee.",
    icon: RotateCcw,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-sm">
          We want you to be fully satisfied with your gear. If a supplement flavor or size isn&apos;t what you expected, we have you covered.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Return Window</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            You may return any unopened supplement containers or unused fitness gear within 30 days of purchase for a full refund or product exchange. Due to safety regulations, opened products are ineligible for return unless defective.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Process a Return</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Contact returns@gymnation.com with your Order Number (e.g. GN-XXXX) to request a prepaid return shipping label. Refund payouts are processed back to the original payment method within 5-7 business days of receipt.
          </p>
        </section>
      </div>
    )
  },
  "track-order": {
    title: "Track Your Order",
    subtitle: "Real-time updates on your supplements and gear shipments.",
    icon: MapPin,
    content: (
      <div className="space-y-6 text-center py-6">
        <p className="text-muted-foreground leading-relaxed text-sm max-w-md mx-auto mb-6">
          Order status information, tracking numbers, and delivery carriers are linked directly to your order records.
        </p>
        <div className="p-6 rounded-2xl border border-border bg-muted/20 max-w-md mx-auto">
          <h3 className="font-bold text-lg mb-2">Have a Client Account?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Log in to view live shipping milestones, carrier tracking maps, and historical receipts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className={buttonVariants({ className: "bg-brand hover:bg-brand-light text-brand-foreground rounded-xl px-6 font-semibold" })}>
              Log In to Track
            </Link>
            <Link href="/shop" className={buttonVariants({ variant: "outline", className: "rounded-xl px-6" })}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  },
  help: {
    title: "Help & Support Center",
    subtitle: "Find answers to frequently asked fitness, product, and account questions.",
    icon: HelpCircle,
    content: (
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="font-bold text-base text-foreground">How do I access my subscribed training program?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Subscribed programs are instantly unlocked inside your <Link href="/dashboard/plans" className="text-brand font-medium hover:underline">My Training Plans</Link> tab in the dashboard. You will see exercises, rep ranges, resting intervals, and goals.
          </p>
        </section>
        <section className="space-y-3">
          <h3 className="font-bold text-base text-foreground">Are the supplements tested for purity?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Yes! Every batch of Gym Nation branded proteins, creatines, and pre-workouts goes through extensive third-party laboratory analysis to guarantee there are no heavy metals or banned compounds.
          </p>
        </section>
        <section className="space-y-3">
          <h3 className="font-bold text-base text-foreground">Can I cancel my plan subscription?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Absolutely. You can cancel or pause training plans at any time via the <Link href="/dashboard/subscriptions" className="text-brand font-medium hover:underline">Subscriptions Tab</Link> in your dashboard with no cancellation fees.
          </p>
        </section>
      </div>
    )
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch with Gym Nation support. We are here to help.",
    icon: Mail,
    content: (
      <div className="space-y-6 max-w-xl mx-auto text-center py-6">
        <p className="text-muted-foreground leading-relaxed text-sm mb-8">
          Have questions about shipping, supplement orders, or training options? Our team operates 24/7.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-base mb-1">Email Support</h3>
            <p className="text-xs text-muted-foreground mb-3">Response time under 12 hours</p>
            <a href="mailto:support@gymnation.com" className="text-brand font-bold text-sm hover:underline block">support@gymnation.com</a>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-base mb-1">Media & Retailers</h3>
            <p className="text-xs text-muted-foreground mb-3">For wholesale partnerships</p>
            <a href="mailto:partners@gymnation.com" className="text-brand font-bold text-sm hover:underline block">partners@gymnation.com</a>
          </div>
        </div>
      </div>
    )
  },
  careers: {
    title: "Careers",
    subtitle: "Join the elite team building the future of active performance.",
    icon: Briefcase,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-sm">
          At Gym Nation, we are building tools to push physical boundaries. We seek passionate, ambitious developers, sports nutritionists, physical trainers, and designers.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Why Gym Nation?</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>Fully remote positions with flexible work hour configurations.</li>
            <li>Free quarterly shipments of Gym Nation supplements and premium lifting gear.</li>
            <li>Competitive compensation, comprehensive health benefits, and retirement plans.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Open Positions</h2>
          <div className="p-4 border border-border rounded-xl flex items-center justify-between bg-muted/20">
            <div>
              <h4 className="font-bold text-sm">Lead Supplement Formulation Scientist</h4>
              <p className="text-xs text-muted-foreground">New York, NY / Remote</p>
            </div>
            <span className="text-xs text-brand font-semibold">Apply Now</span>
          </div>
        </section>
      </div>
    )
  },
  blog: {
    title: "Gym Nation Blog",
    subtitle: "Scientific training advice, nutrition guidelines, and athlete articles.",
    icon: BookOpen,
    content: (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mock Blog Post 1 */}
          <div className="border border-border rounded-2xl bg-card overflow-hidden hover:border-brand/30 transition-all group cursor-pointer">
            <div className="h-48 bg-muted relative flex items-center justify-center">
              <Dumbbell className="h-16 w-16 text-brand/20 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> July 10, 2026</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5"/> Coach Marcus</span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-brand transition-colors line-clamp-2">
                Understanding progressive overload: The hypertrophic response
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Learn how minor weekly increments in weight, repetitions, or volume are the fundamental drivers for long-term muscle development.
              </p>
            </div>
          </div>

          {/* Mock Blog Post 2 */}
          <div className="border border-border rounded-2xl bg-card overflow-hidden hover:border-brand/30 transition-all group cursor-pointer">
            <div className="h-48 bg-muted relative flex items-center justify-center">
              <ShieldCheck className="h-16 w-16 text-brand/20 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> July 8, 2026</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5"/> Dr. Chen</span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-brand transition-colors line-clamp-2">
                Supplement guide: Does Creatine HCL outperform Monohydrate?
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                A scientific analysis evaluating solubility ratios, dosing strategies, and effectiveness indexes of HCL vs Monohydrate creatine formulas.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const spec = SUPPORT_PAGES[slug];
  
  if (!spec) return { title: "Page Not Found" };
  
  return {
    title: `${spec.title} | Gym Nation`,
    description: spec.subtitle,
  };
}

export default async function SupportInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageSpec = SUPPORT_PAGES[slug];

  if (!pageSpec) {
    notFound();
  }

  const PageIcon = pageSpec.icon;

  return (
    <div className="min-h-screen pt-28 pb-12 bg-muted/10">
      <Container className="max-w-3xl">
        <div className="space-y-8">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Page Title Header */}
          <div className="p-8 sm:p-10 rounded-3xl border border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <PageIcon className="h-28 w-28" />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <PageIcon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">{pageSpec.title}</h1>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-xl leading-relaxed">
                  {pageSpec.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Page Body Content */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10">
            {pageSpec.content}
          </div>
        </div>
      </Container>
    </div>
  );
}
