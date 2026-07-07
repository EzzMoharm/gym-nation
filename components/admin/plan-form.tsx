"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { createPlan, updatePlan } from "@/app/admin/actions";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PlanFormProps {
  plan?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    compare_at_price: number | null;
    duration_weeks: number;
    difficulty: string;
    goal: string;
    category: string;
    equipment_needed: string[];
    image_url: string;
    is_featured: boolean;
    is_active: boolean;
  };
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter();
  const isEditing = !!plan;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(plan?.image_url || "");
  const [isFeatured, setIsFeatured] = useState(plan?.is_featured || false);
  const [isActive, setIsActive] = useState(plan?.is_active ?? true);
  const [name, setName] = useState(plan?.name || "");
  const [difficulty, setDifficulty] = useState(plan?.difficulty || "beginner");

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
      formData.set("difficulty", difficulty);

      const result = isEditing
        ? await updatePlan(plan.id, formData)
        : await createPlan(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing ? "Plan updated successfully" : "Plan created successfully"
        );
        router.push("/admin/plans");
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
            href="/admin/plans"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Plan" : "New Training Plan"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing
                ? "Update the plan details below."
                : "Fill in the details to create a new training plan."}
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
            "Create Plan"
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
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hypertrophy 101"
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
                  defaultValue={plan?.short_description || ""}
                  placeholder="Brief summary for plan cards"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={plan?.description || ""}
                  placeholder="Detailed plan description..."
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
                  defaultValue={plan?.price || ""}
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
                  defaultValue={plan?.compare_at_price || ""}
                  placeholder="Original price (optional)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration_weeks">Duration (weeks) *</Label>
                  <Input
                    id="duration_weeks"
                    name="duration_weeks"
                    type="number"
                    min="1"
                    defaultValue={plan?.duration_weeks || 4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select value={difficulty} onValueChange={(val) => setDifficulty(val || "beginner")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Input
                    id="goal"
                    name="goal"
                    defaultValue={plan?.goal || ""}
                    placeholder="e.g. Muscle Building"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={plan?.category || ""}
                  placeholder="e.g. Bodybuilding, Powerlifting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment_needed">
                  Equipment Needed{" "}
                  <span className="text-muted-foreground font-normal">
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  id="equipment_needed"
                  name="equipment_needed"
                  defaultValue={plan?.equipment_needed?.join(", ") || ""}
                  placeholder="e.g. Barbell, Dumbbells, Cables"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Image</CardTitle>
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
                    Visible on the site
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
