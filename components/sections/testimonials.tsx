"use client";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Marcus Johnson",
    role: "Competitive Powerlifter",
    avatar: "MJ",
    rating: 5,
    text: "Gym Nation's creatine and protein are the best I've ever used. The quality is unmatched, and their training plans helped me add 50lbs to my total in 12 weeks.",
  },
  {
    name: "Sarah Chen",
    role: "CrossFit Athlete",
    avatar: "SC",
    rating: 5,
    text: "I've tried dozens of supplement brands. Nothing comes close to the purity and effectiveness of Gym Nation products. The Shred 30 program transformed my body composition.",
  },
  {
    name: "David Rodriguez",
    role: "Personal Trainer",
    avatar: "DR",
    rating: 5,
    text: "I recommend Gym Nation to all my clients. The product quality is exceptional, shipping is fast, and the training plans are professionally designed. 10/10.",
  },
  {
    name: "Emily Thompson",
    role: "Marathon Runner",
    avatar: "ET",
    rating: 5,
    text: "Their amino acids and electrolyte formulas have been game-changers for my endurance training. Recovery time has decreased significantly since switching to Gym Nation.",
  },
  {
    name: "James Park",
    role: "Bodybuilder",
    avatar: "JP",
    rating: 5,
    text: "The Gold Standard Whey from Gym Nation is my go-to. Great taste, mixes perfectly, and the macros are spot on. Been a loyal customer for over 2 years.",
  },
  {
    name: "Aisha Williams",
    role: "Yoga Instructor",
    avatar: "AW",
    rating: 5,
    text: "Love their plant-based protein line! Clean ingredients, no bloating, and it tastes amazing. The subscription model makes it so convenient to never run out.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <Container>
        <AnimatedSection>
          <SectionHeader
            title="What Athletes Say"
            subtitle="Join 50,000+ athletes who trust Gym Nation for their fitness journey"
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/20 hover:shadow-md">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-brand/20" />

                {/* Rating */}
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-brand/10 text-brand text-sm font-bold">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
