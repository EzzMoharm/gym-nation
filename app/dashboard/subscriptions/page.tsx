import type { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, Calendar, CheckCircle2, PauseCircle, XCircle, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMySubscriptions } from "@/app/dashboard/actions";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscriptions | Dashboard",
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  active: { label: "Active", icon: CheckCircle2, color: "text-success bg-success/10" },
  paused: { label: "Paused", icon: PauseCircle, color: "text-warning bg-warning/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive bg-destructive/10" },
  expired: { label: "Expired", icon: Clock, color: "text-muted-foreground bg-muted" },
};

export default async function SubscriptionsPage() {
  const { data: subscriptions } = await getMySubscriptions();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your training plan subscriptions.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium mb-2">No active subscriptions</p>
          <p className="text-muted-foreground mb-6">
            Subscribe to a training plan to get started on your fitness journey.
          </p>
          <Link href="/plans" className={buttonVariants({ className: "rounded-xl" })}>
            Browse Training Plans
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub: any) => {
            const plan = sub.plan;
            const status = statusConfig[sub.status] || statusConfig.active;
            const StatusIcon = status.icon;
            const totalWeeks = plan?.duration_weeks || 12;
            const progressPercent = Math.min(100, Math.round((sub.current_week / totalWeeks) * 100));

            return (
              <Card key={sub.id} className="overflow-hidden hover:border-brand/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Plan icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 shrink-0">
                      <Dumbbell className="h-7 w-7 text-brand" />
                    </div>

                    {/* Plan info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg truncate">{plan?.name || "Training Plan"}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Started {formatDateShort(sub.start_date)}
                        </span>
                        {sub.end_date && (
                          <span>Ends {formatDateShort(sub.end_date)}</span>
                        )}
                        <span>
                          Week {sub.current_week} of {totalWeeks}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-brand">{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* View plan link */}
                    {plan?.slug && (
                      <Link
                        href={`/plans/${plan.slug}`}
                        className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-xl shrink-0" })}
                      >
                        View Plan
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
