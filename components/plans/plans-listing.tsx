"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PlanData {
  id: string;
  slug: string;
  name: string;
  image_url?: string;
  goal?: string;
  difficulty?: string;
  category?: string;
  short_description?: string;
  duration_weeks?: number;
  subscriber_count?: number;
  price: number;
  compare_at_price?: number;
}

function PlanCard({ plan }: { plan: PlanData }) {
  return (
    <Link
      href={`/plans/${plan.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="relative aspect-video overflow-hidden bg-muted border-b border-border">
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-muted-foreground/10 uppercase">
            {plan.goal || "PLAN"}
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
          {(plan.subscriber_count ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {plan.subscriber_count?.toLocaleString()} active
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(plan.price)}</span>
            {plan.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(plan.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PlansListing({ plans }: { plans: PlanData[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract categories dynamically
  const categories = useMemo(() => {
    return [...new Set(plans.map((p) => p.category).filter(Boolean))] as string[];
  }, [plans]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return plans;
    return plans.filter((p) => p.category === selectedCategory);
  }, [plans, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        <Button
          variant={selectedCategory === null ? "default" : "secondary"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-xl transition-all"
        >
          All Plans
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "secondary"}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-xl transition-all"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid List */}
      {filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h3 className="text-lg font-semibold mb-1">No plans found</h3>
          <p className="text-muted-foreground text-sm">Try choosing another category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
