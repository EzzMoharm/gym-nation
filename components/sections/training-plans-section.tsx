"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Target, ArrowRight, Users } from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-warning border-warning/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
  elite: "bg-brand/10 text-brand border-brand/20",
};

interface TrainingPlansSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plans: any[];
}

export function TrainingPlansSection({ plans }: TrainingPlansSectionProps) {
  return (
    <section className="section-padding">
      <Container>
        <AnimatedSection>
          <SectionHeader
            title="Training Programs"
            subtitle="Expert-designed plans to reach your fitness goals faster"
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.id}>
              <Link
                href={`/plans/${plan.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
              >
                {/* Image area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand/20 to-brand-dark/20">
                  {plan.image_url ? (
                    <Image
                      src={plan.image_url}
                      alt={plan.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Dumbbell className="h-16 w-16 text-brand/30" />
                    </div>
                  )}

                  {/* Difficulty badge */}
                  <Badge
                    variant="outline"
                    className={`absolute top-3 left-3 ${plan.difficulty ? difficultyColors[plan.difficulty.toLowerCase()] || difficultyColors.beginner : difficultyColors.beginner} capitalize`}
                  >
                    {plan.difficulty || 'beginner'}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Goal */}
                  {plan.goal && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-brand">
                      <Target className="h-3 w-3" />
                      {plan.goal}
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="mt-2 text-lg font-bold group-hover:text-brand transition-colors">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {plan.short_description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {plan.duration_weeks || 4} weeks
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {(plan.subscriber_count || 0).toLocaleString()} enrolled
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <span className="text-xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-brand group-hover:gap-2 transition-all">
                      View Plan
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="mt-12 text-center">
          <Link href="/plans" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
            Browse All Plans
          </Link>
        </AnimatedSection>
      </Container>
    </section>
  );
}
