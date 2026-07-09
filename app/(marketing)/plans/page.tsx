import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { getActivePlans } from "@/app/admin/actions";
import { PlansListing } from "@/components/plans/plans-listing";

export const metadata: Metadata = {
  title: "Training Plans | Gym Nation",
  description: "Premium workout programs for every goal.",
};

export default async function PlansPage() {
  const { data: plans } = await getActivePlans();

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Training Plans</h1>
          <p className="text-lg text-muted-foreground">
            Science-based programming designed by elite coaches to help you build muscle, lose fat, and increase strength.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl font-black text-muted-foreground/10 mb-4">GN</div>
            <h3 className="text-lg font-semibold mb-1">No plans available</h3>
            <p className="text-muted-foreground text-sm">Check back soon for new additions.</p>
          </div>
        ) : (
          <PlansListing plans={plans} />
        )}
      </Container>
    </div>
  );
}
