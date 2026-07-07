import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Edit Product | Gym Nation Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product } = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}
