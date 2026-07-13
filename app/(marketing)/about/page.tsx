import { Container } from "@/components/shared/container";
import { Dumbbell, Target, Shield, Users } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About Us",
  description: "Learn about Gym Nation's mission to fuel your fitness journey with premium supplements and elite training plans.",
};

const VALUES = [
  {
    title: "Premium Quality",
    description: "We source only the highest quality ingredients for our supplements to ensure maximum performance and recovery.",
    icon: Shield,
  },
  {
    title: "Elite Training",
    description: "Our training plans are designed by world-class athletes and coaches to help you shatter your plateaus.",
    icon: Dumbbell,
  },
  {
    title: "Result Driven",
    description: "Everything we do is focused on one thing: helping you achieve your specific fitness goals.",
    icon: Target,
  },
  {
    title: "Community First",
    description: "Join thousands of dedicated athletes who support and push each other to become better every day.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent" />
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Fueling The <span className="text-brand">Relentless</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Gym Nation isn't just another supplement company. We are a collective of athletes, coaches, and relentless individuals dedicated to pushing the boundaries of human performance.
          </p>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a rebellious spirit and a lofty objective: to offer premium, science-backed nutrition and elite training programs at a fair price, while leading the way for physically conscious businesses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We grew tired of the proprietary blends, under-dosed ingredients, and cookie-cutter workout plans that plagued the fitness industry. So we built the platform we always wished existed.
              </p>
            </div>
            {/* Gym Store Facade Image */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted">
              <Image
                src="/images/gym_store_facade.png"
                alt="Gym Nation Storefront"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-card border-y border-border/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we formulate, program, and build.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50">
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
