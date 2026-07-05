"use client";

import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Target, ArrowRight, Users } from "lucide-react";

const TRAINING_PLANS = [
  {
    id: "1",
    slug: "strength-foundation",
    name: "Strength Foundation",
    short_description:
      "Build a solid strength base with compound movements and progressive overload.",
    duration_weeks: 8,
    difficulty: "beginner",
    goal: "Build Muscle",
    price: 29.99,
    subscriber_count: 3420,
    average_rating: 4.8,
  },
  {
    id: "2",
    slug: "shred-30",
    name: "Shred 30",
    short_description:
      "Aggressive 30-day fat loss program combining HIIT, strength, and nutrition.",
    duration_weeks: 4,
    difficulty: "intermediate",
    goal: "Lose Fat",
    price: 24.99,
    subscriber_count: 5891,
    average_rating: 4.9,
  },
  {
    id: "3",
    slug: "powerlifting-peak",
    name: "Powerlifting Peak",
    short_description:
      "Peaking program for squat, bench, and deadlift. Designed for competition prep.",
    duration_weeks: 12,
    difficulty: "advanced",
    goal: "Increase Strength",
    price: 39.99,
    subscriber_count: 1876,
    average_rating: 4.7,
  },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-warning border-warning/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
  elite: "bg-brand/10 text-brand border-brand/20",
};

export function TrainingPlansSection() {
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
          {TRAINING_PLANS.map((plan) => (
            <StaggerItem key={plan.id}>
              <Link
                href={`/plans/${plan.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
              >
                {/* Image area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand/20 to-brand-dark/20">
                  <div className="flex h-full items-center justify-center">
                    <Dumbbell className="h-16 w-16 text-brand/30" />
                  </div>

                  {/* Difficulty badge */}
                  <Badge
                    variant="outline"
                    className={`absolute top-3 left-3 ${difficultyColors[plan.difficulty]} capitalize`}
                  >
                    {plan.difficulty}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Goal */}
                  <div className="flex items-center gap-1.5 text-xs font-medium text-brand">
                    <Target className="h-3 w-3" />
                    {plan.goal}
                  </div>

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
                      {plan.duration_weeks} weeks
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {plan.subscriber_count.toLocaleString()} enrolled
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
