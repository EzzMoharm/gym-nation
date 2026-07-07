"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createProduct, updateProduct } from "@/app/admin/actions";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    compare_at_price: number | null;
    category: string;
    brand: string;
    flavor: string;
    servings: number | null;
    serving_size: string;
    ingredients: string;
    image_url: string;
    is_featured: boolean;
    is_active: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [name, setName] = useState(product?.name || "");

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("image_url", imageUrl);
      formData.set("is_featured", String(isFeatured));
      formData.set("is_active", String(isActive));
      formData.set("slug", slug);

      const result = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing ? "Product updated successfully" : "Product created successfully"
        );
        router.push("/admin/products");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing
                ? "Update the product details below."
                : "Fill in the details to create a new product."}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand hover:bg-brand-light text-brand-foreground px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gold Standard Whey Protein"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  name="short_description"
                  defaultValue={product?.short_description || ""}
                  placeholder="Brief summary for product cards"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description || ""}
                  placeholder="Detailed product description..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price || ""}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compare_at_price">Compare at Price ($)</Label>
                <Input
                  id="compare_at_price"
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.compare_at_price || ""}
                  placeholder="Original price (optional)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={product?.category || ""}
                    placeholder="e.g. Protein, Pre-Workout"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    defaultValue={product?.brand || ""}
                    placeholder="e.g. Optimum Nutrition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="flavor">Flavor</Label>
                  <Input
                    id="flavor"
                    name="flavor"
                    defaultValue={product?.flavor || ""}
                    placeholder="e.g. Chocolate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    name="servings"
                    type="number"
                    min="0"
                    defaultValue={product?.servings || ""}
                    placeholder="e.g. 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serving_size">Serving Size</Label>
                  <Input
                    id="serving_size"
                    name="serving_size"
                    defaultValue={product?.serving_size || ""}
                    placeholder="e.g. 1 Scoop (30g)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  defaultValue={product?.ingredients || ""}
                  placeholder="List of ingredients..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Visible in the store
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Show on homepage
                  </p>
                </div>
                <Switch
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
