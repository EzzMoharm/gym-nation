"use client";

import { motion } from "motion/react";
import { Container } from "@/components/shared/container";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="section-padding">
      <Container>
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16">
            {/* Background gradient orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              {/* Icon */}
              <motion.div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-7 w-7 text-brand" />
              </motion.div>

              {/* Content */}
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Stay in the Loop
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Get exclusive deals, new product drops, and training tips
                delivered to your inbox. No spam — just gains.
              </p>

              {/* Form */}
              <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 pl-10 rounded-xl"
                    aria-label="Email address"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-brand hover:bg-brand-light text-brand-foreground font-semibold gap-2"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <p className="mt-4 text-xs text-muted-foreground">
                Join 25,000+ subscribers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
