import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { MOCK_PLANS } from "@/lib/mock-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Target, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { TrainingPlan } from "@/types";

export const metadata: Metadata = {
  title: "Training Plans | Gym Nation",
  description: "Premium workout programs for every goal.",
};

function PlanCard({ plan }: { plan: Partial<TrainingPlan> }) {
  return (
    <Link
      href={`/plans/${plan.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="relative aspect-video overflow-hidden bg-muted border-b border-border">
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.name!}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-muted-foreground/10 uppercase">
            {plan.goal}
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-background text-foreground hover:bg-background border-none font-semibold shadow-sm">
            {plan.difficulty?.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-brand font-medium mb-2">
          <span>{plan.category}</span>
        </div>

        <h3 className="text-xl font-bold leading-snug group-hover:text-brand transition-colors mb-2">
          {plan.name}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {plan.short_description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {plan.duration_weeks} Weeks
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {plan.subscriber_count?.toLocaleString()} active
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(plan.price!)}</span>
            {plan.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(plan.compare_at_price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-semibold text-sm">{plan.average_rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PlansPage() {
  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Training Plans</h1>
          <p className="text-lg text-muted-foreground">
            Science-based programming designed by elite coaches to help you build muscle, lose fat, and increase strength.
          </p>
        </div>

        {/* Categories / Filters Placeholder */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <Button variant="default" className="rounded-xl">All Plans</Button>
          <Button variant="secondary" className="rounded-xl">Hypertrophy</Button>
          <Button variant="secondary" className="rounded-xl">Strength</Button>
          <Button variant="secondary" className="rounded-xl">Fat Loss</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
}
