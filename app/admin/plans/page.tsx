import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlans } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import { PlanDeleteButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Plans | Gym Nation Admin",
};

export default async function AdminPlansPage() {
  const { data: plans } = await getPlans();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Plans</h1>
          <p className="text-muted-foreground mt-2">
            Manage your training plans. {plans.length} plan
            {plans.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Link href="/admin/plans/new">
          <Button className="gap-2 bg-brand hover:bg-brand-light text-brand-foreground">
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl font-black text-muted-foreground/10 mb-4">
              GN
            </div>
            <h3 className="text-lg font-semibold mb-1">No plans yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add your first training plan to get started.
            </p>
            <Link href="/admin/plans/new">
              <Button className="gap-2 bg-brand hover:bg-brand-light text-brand-foreground">
                <Plus className="h-4 w-4" />
                Add Plan
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Difficulty</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(
                  (plan: {
                    id: string;
                    name: string;
                    slug: string;
                    price: number;
                    duration_weeks: number;
                    difficulty: string;
                    category: string;
                    image_url: string;
                    is_active: boolean;
                    is_featured: boolean;
                  }) => (
                    <tr
                      key={plan.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {plan.image_url ? (
                              <Image
                                src={plan.image_url}
                                alt={plan.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground/50">
                                GN
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {plan.name}
                            </div>
                            {plan.category && (
                              <div className="text-xs text-muted-foreground">
                                {plan.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{formatPrice(plan.price)}</td>
                      <td className="px-6 py-4">
                        {plan.duration_weeks} weeks
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize">{plan.difficulty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.is_active
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {plan.is_active ? "Active" : "Draft"}
                          </span>
                          {plan.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/plans/${plan.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <PlanDeleteButton id={plan.id} name={plan.name} />
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
