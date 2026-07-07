import type { Metadata } from "next";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dumbbell, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getActivePlans } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "My Training Plans | Dashboard",
};

export default async function DashboardPlansPage() {
  const { data: plans } = await getActivePlans();
  
  // For the sake of the showcase, if the user doesn't have an active plan 
  // (which they won't until we implement purchases), we'll show the first 
  // active plan from the database as their "subscribed" plan just to show the UI.
  const activePlan = plans[0];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Training Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Access your active subscriptions and workout schedules.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Active Plan Card */}
        {activePlan ? (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Dumbbell className="h-32 w-32" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success mb-4">
                Active Subscription
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{activePlan.name}</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                You are on Week 1 of {activePlan.duration_weeks}. Keep up the great work!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-xl h-12 gap-2">
                  <Calendar className="h-4 w-4" />
                  Today&apos;s Workout
                </Button>
                <Link href={`/plans/${activePlan.slug}`}>
                  <Button variant="outline" size="lg" className="rounded-xl h-12">
                    View Full Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any active subscriptions yet.
            </p>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-border mt-8">
        <h3 className="text-xl font-bold mb-4">Discover More Plans</h3>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for your next challenge? Browse our premium training programs.
          </p>
          <Link href="/plans" className={buttonVariants({ variant: "secondary" })}>
            Browse Programs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
