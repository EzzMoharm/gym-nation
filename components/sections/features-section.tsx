"use client";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Truck, Shield, RefreshCcw, HeadphonesIcon } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over $75. Fast 2-3 day shipping nationwide.",
  },
  {
    icon: Shield,
    title: "Lab Tested",
    description: "Every batch is third-party tested for purity, potency, and safety.",
  },
  {
    icon: RefreshCcw,
    title: "30-Day Returns",
    description: "Not satisfied? Full refund within 30 days, no questions asked.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Certified nutritionists available 24/7 to answer your questions.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding border-t border-border/50">
      <Container>
        <AnimatedSection>
          <SectionHeader
            title="Why Choose Gym Nation"
            subtitle="We're committed to quality, transparency, and your results"
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                  <feature.icon className="h-7 w-7 text-brand" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
