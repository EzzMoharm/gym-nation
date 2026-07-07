import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CategoriesSection } from "@/components/sections/categories-section";
import { TrainingPlansSection } from "@/components/sections/training-plans-section";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { getFeaturedProducts, getFeaturedPlans } from "@/app/admin/actions";

export default async function HomePage() {
  const { data: featuredProducts } = await getFeaturedProducts();
  const { data: featuredPlans } = await getFeaturedPlans();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts || []} />
      <CategoriesSection />
      <TrainingPlansSection plans={featuredPlans || []} />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
