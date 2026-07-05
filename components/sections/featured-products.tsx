"use client";

import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductCard } from "@/components/shop/product-card";

// Static featured products data
const FEATURED_PRODUCTS: Partial<Product>[] = [
  {
    id: "1",
    slug: "gold-standard-whey",
    name: "Gold Standard 100% Whey",
    short_description: "24g protein per serving, 5.5g BCAAs",
    price: 34.99,
    compare_at_price: 44.99,
    average_rating: 4.8,
    review_count: 2847,
    flavor: "Double Rich Chocolate",
    is_featured: true,
    category: { id: "1", slug: "protein", name: "Protein", description: null, image_url: null, parent_id: null, position: 1, is_active: true },
    brand: { id: "1", slug: "optimum-nutrition", name: "Optimum Nutrition", description: null, logo_url: null, website_url: null, is_active: true },
  },
  {
    id: "2",
    slug: "c4-original-pre-workout",
    name: "C4 Original Pre-Workout",
    short_description: "150mg caffeine, explosive energy",
    price: 29.99,
    compare_at_price: null,
    average_rating: 4.6,
    review_count: 1923,
    flavor: "Fruit Punch",
    is_featured: true,
    category: { id: "2", slug: "pre-workout", name: "Pre-Workout", description: null, image_url: null, parent_id: null, position: 2, is_active: true },
    brand: { id: "2", slug: "cellucor", name: "Cellucor", description: null, logo_url: null, website_url: null, is_active: true },
  },
  {
    id: "3",
    slug: "creatine-monohydrate",
    name: "Micronized Creatine Monohydrate",
    short_description: "5g pure creatine, 60 servings",
    price: 19.99,
    compare_at_price: 27.99,
    average_rating: 4.9,
    review_count: 3156,
    flavor: "Unflavored",
    is_featured: true,
    category: { id: "3", slug: "creatine", name: "Creatine", description: null, image_url: null, parent_id: null, position: 3, is_active: true },
    brand: { id: "3", slug: "optimum-nutrition", name: "Optimum Nutrition", description: null, logo_url: null, website_url: null, is_active: true },
  },
  {
    id: "4",
    slug: "essential-amino-energy",
    name: "Essential Amino Energy",
    short_description: "5g amino acids, natural caffeine",
    price: 24.99,
    compare_at_price: 29.99,
    average_rating: 4.7,
    review_count: 1456,
    flavor: "Concord Grape",
    is_featured: true,
    category: { id: "5", slug: "amino-acids", name: "Amino Acids", description: null, image_url: null, parent_id: null, position: 5, is_active: true },
    brand: { id: "3", slug: "optimum-nutrition", name: "Optimum Nutrition", description: null, logo_url: null, website_url: null, is_active: true },
  },
];

export function FeaturedProducts() {
  return (
    <section className="section-padding">
      <Container>
        <AnimatedSection>
          <SectionHeader
            title="Featured Products"
            subtitle="Hand-picked premium supplements trusted by over 50,000 athletes"
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product as Product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="mt-12 text-center">
          <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
            View All Products
          </Link>
        </AnimatedSection>
      </Container>
    </section>
  );
}

