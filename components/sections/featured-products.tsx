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

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
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
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
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

