"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ArrowRight, Play, Zap, Shield, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_bg.png"
          alt="Premium Gym Environment"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 10%) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(1 0 0 / 10%) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <Container className="relative z-10 pt-24 pb-12">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-brand" />
              New: Summer Collection 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-8 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Fuel Your{" "}
            <span className="text-gradient">Greatness</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed sm:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Premium nutrition supplements and expert training programs designed
            for athletes who refuse to settle. Elevate every rep, every set,
            every day.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/shop" className={buttonVariants({ size: "lg", className: "h-13 px-8 text-base font-semibold bg-brand hover:bg-brand-light text-brand-foreground gap-2 rounded-xl" })}>
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/plans" className={buttonVariants({ variant: "outline", size: "lg", className: "h-13 px-8 text-base font-semibold gap-2 rounded-xl" })}>
              <Play className="h-4 w-4" />
              Browse Plans
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand" />
              Free shipping over $75
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              Lab tested & certified
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand" />
              30-day money back
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "200+", label: "Premium Products" },
              { number: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black sm:text-4xl text-gradient">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
