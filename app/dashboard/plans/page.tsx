import type { Metadata } from "next";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dumbbell, Calendar, ArrowRight, Target, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMySubscriptions } from "@/app/dashboard/actions";
import { CancelSubscriptionButton } from "../subscriptions/cancel-button";

export const metadata: Metadata = {
  title: "My Training Plans | Dashboard",
};

export default async function DashboardPlansPage() {
  const { data: subscriptions } = await getMySubscriptions();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Training Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Access your active subscriptions, workout schedules, and training details.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Active Plans List */}
        {subscriptions && subscriptions.length > 0 ? (
          subscriptions.map((sub: any) => {
            const plan = sub.plan;
            if (!plan) return null;
            
            const totalWeeks = plan.duration_weeks || 12;
            const progressPercent = Math.min(100, Math.round((sub.current_week / totalWeeks) * 100));

            return (
              <div 
                key={sub.id} 
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-brand/30 transition-colors"
              >
                {/* Background icon for design accent */}
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <Dumbbell className="h-32 w-32" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  {/* Plan Thumbnail */}
                  <div className="relative aspect-[16/10] w-full md:w-48 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                    {plan.image_url ? (
                      <Image
                        src={plan.image_url}
                        alt={plan.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Dumbbell className="h-10 w-10 text-brand/30" />
                      </div>
                    )}
                  </div>

                  {/* Plan Info */}
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2 items-center">
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                          Active Subscription
                        </span>
                        <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand capitalize">
                          {plan.difficulty}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold">{plan.name}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {plan.short_description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-muted-foreground border-y border-border/50 py-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-brand" />
                        {totalWeeks} Weeks Total
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Target className="h-3.5 w-3.5 text-brand" />
                        {plan.goal}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium col-span-2 sm:col-span-1">
                        <Calendar className="h-3.5 w-3.5 text-brand" />
                        Week {sub.current_week} of {totalWeeks}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Course Completion</span>
                        <span className="font-semibold text-brand">{progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 items-stretch sm:items-center w-full">
                      <Link href={`/plans/${plan.slug}`} className="w-full sm:w-auto">
                        <Button className="rounded-xl h-11 w-full sm:w-auto gap-2 bg-brand text-brand-foreground hover:bg-brand-light font-semibold">
                          <Calendar className="h-4 w-4" />
                          View Workouts
                        </Button>
                      </Link>
                      <Link href={`/plans/${plan.slug}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="rounded-xl h-11 w-full sm:w-auto border-border w-full">
                          View Full Details
                        </Button>
                      </Link>
                      <CancelSubscriptionButton subId={sub.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground/35 mb-4" />
            <p className="text-lg font-bold mb-2">No Active Subscriptions</p>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              You are not currently subscribed to any training plans. Find an expert-designed routine to jumpstart your targets.
            </p>
            <Link href="/plans" className={buttonVariants({ className: "rounded-xl bg-brand hover:bg-brand-light text-brand-foreground font-semibold px-6" })}>
              Find a Plan
            </Link>
          </div>
        )}
      </div>

      {/* Cross-Sell */}
      {subscriptions && subscriptions.length > 0 && (
        <div className="pt-8 border-t border-border mt-8">
          <h3 className="text-xl font-bold mb-4">Discover More Challenges</h3>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              Ready to expand your targets? Browse other expert-designed strength, hypertrophy, and speed programs.
            </p>
            <Link href="/plans" className={buttonVariants({ variant: "secondary", className: "rounded-xl font-semibold gap-1.5 cursor-pointer" })}>
              Browse Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
