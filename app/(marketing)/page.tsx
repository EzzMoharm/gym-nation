import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CategoriesSection } from "@/components/sections/categories-section";
import { TrainingPlansSection } from "@/components/sections/training-plans-section";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { FeaturesSection } from "@/components/sections/features-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <TrainingPlansSection />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
