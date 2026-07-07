import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlanById } from "@/app/admin/actions";
import { PlanForm } from "@/components/admin/plan-form";

export const metadata: Metadata = {
  title: "Edit Plan | Gym Nation Admin",
};

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: plan } = await getPlanById(id);

  if (!plan) {
    notFound();
  }

  return <PlanForm plan={plan} />;
}
