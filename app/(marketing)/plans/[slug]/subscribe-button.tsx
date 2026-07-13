"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { subscribeToPlan } from "@/app/dashboard/actions";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SubscribeButton({ planId, planSlug }: { planId: string; planSlug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe to a plan");
      router.push(`/login?redirect=/plans/${planSlug}`);
      return;
    }

    // Redirect to secure checkout to handle payment process for the training plan
    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <Button
      size="lg"
      className="w-full h-14 rounded-xl text-lg font-bold bg-brand hover:bg-brand-light text-brand-foreground mb-4"
      onClick={handleSubscribe}
      disabled={isPending}
    >
      {isPending ? (
        <span className="flex items-center gap-2 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Subscribing...
        </span>
      ) : (
        "Subscribe Now"
      )}
    </Button>
  );
}
