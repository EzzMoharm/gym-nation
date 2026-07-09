import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { getPlanBySlug } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils";
import { Clock, Dumbbell, Target, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SubscribeButton } from "./subscribe-button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: plan } = await getPlanBySlug(slug);
  
  if (!plan) return { title: "Plan Not Found" };
  
  return {
    title: `${plan.name} | Gym Nation`,
    description: plan.short_description,
  };
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: plan } = await getPlanBySlug(slug);

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center">
              {plan.image_url ? (
                <Image
                  src={plan.image_url}
                  alt={plan.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="text-6xl font-black text-muted-foreground/10 uppercase tracking-widest">{plan.category}</span>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm text-brand font-medium mb-3">
                <span className="px-2 py-1 rounded-md bg-brand/10">{plan.difficulty.toUpperCase()}</span>
                {plan.category && <span className="px-2 py-1 rounded-md bg-muted text-foreground">{plan.category}</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{plan.name}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Clock className="w-4 h-4"/> Duration</span>
                <span className="font-bold text-lg">{plan.duration_weeks} Weeks</span>
              </div>
              {plan.goal && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Target className="w-4 h-4"/> Goal</span>
                  <span className="font-bold text-lg">{plan.goal}</span>
                </div>
              )}
              {plan.equipment_needed && plan.equipment_needed.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Dumbbell className="w-4 h-4"/> Equipment</span>
                  <span className="font-bold text-lg text-balance">{plan.equipment_needed.join(", ")}</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Program Overview</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  This program is designed to guide you step-by-step through {plan.duration_weeks} weeks of rigorous training. 
                  {plan.goal ? ` Every workout, set, and rep is explicitly laid out to ensure you achieve maximum ${plan.goal.toLowerCase()}.` : ""}
                </p>
                <ul>
                  <li>Detailed daily workout splits</li>
                  <li>Video demonstrations for all exercises</li>
                  <li>Progress tracking dashboard</li>
                  <li>Nutrition protocols and macros</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar / Checkout */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">{formatPrice(plan.price)}</h3>
              {plan.compare_at_price && (
                <p className="text-sm text-muted-foreground line-through mb-6">
                  Normally {formatPrice(plan.compare_at_price)}
                </p>
              )}
              
              <SubscribeButton planId={plan.id} planSlug={plan.slug} />
              
              <p className="text-xs text-center text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Lifetime access to this specific plan version
              </p>

              <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="font-semibold text-sm">What&apos;s included:</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span> Full {plan.duration_weeks}-week schedule
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span> Form guides & video database
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span> Mobile app access
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span> Direct messaging with coaches
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
