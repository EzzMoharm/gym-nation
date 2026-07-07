import type { Metadata } from "next";
import { PlanForm } from "@/components/admin/plan-form";

export const metadata: Metadata = {
  title: "Add New Plan | Gym Nation Admin",
};

export default function NewPlanPage() {
  return <PlanForm />;
}
