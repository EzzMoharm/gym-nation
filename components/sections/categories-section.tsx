"use client";

import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Protein",
    slug: "protein",
    description: "Whey, Casein, Plant-Based",
    productCount: 48,
    gradient: "from-blue-600/20 to-purple-600/20",
    icon: "💪",
  },
  {
    name: "Pre-Workout",
    slug: "pre-workout",
    description: "Energy & Focus",
    productCount: 32,
    gradient: "from-red-600/20 to-orange-600/20",
    icon: "⚡",
  },
  {
    name: "Creatine",
    slug: "creatine",
    description: "Monohydrate & HCL",
    productCount: 18,
    gradient: "from-green-600/20 to-emerald-600/20",
    icon: "🔥",
  },
  {
    name: "Vitamins & Minerals",
    slug: "vitamins",
    description: "Daily Essentials",
    productCount: 56,
    gradient: "from-yellow-600/20 to-amber-600/20",
    icon: "🌿",
  },
  {
    name: "Amino Acids",
    slug: "amino-acids",
    description: "BCAAs & EAAs",
    productCount: 24,
    gradient: "from-cyan-600/20 to-teal-600/20",
    icon: "🧬",
  },
  {
    name: "Weight Management",
    slug: "weight-management",
    description: "Fat Burners & Lean",
    productCount: 28,
    gradient: "from-pink-600/20 to-rose-600/20",
    icon: "⚖️",
  },
];

export function CategoriesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <Container>
        <AnimatedSection>
          <SectionHeader
            title="Shop by Category"
            subtitle="Find exactly what your body needs"
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                {/* Icon */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl transition-transform group-hover:scale-110">
                  {category.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.productCount} products
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="relative z-10 h-5 w-5 text-muted-foreground transition-all group-hover:text-brand group-hover:translate-x-1" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
