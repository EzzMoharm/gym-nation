"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";

export function CancelSubscriptionButton({ subId }: { subId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleCancel = async () => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", subId);

      if (error) throw error;

      toast.success("Subscription removed successfully.");
      router.refresh(); // Refresh Server Component data in-place
    } catch (err: any) {
      toast.error(err.message || "Failed to remove subscription.");
    }
  };

  const triggerButton = (
    <Button
      variant="ghost"
      className="rounded-xl h-11 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-2 px-3 shrink-0 w-full justify-center sm:w-auto"
    >
      <Trash2 className="h-4 w-4" />
      Remove Plan
    </Button>
  );

  return (
    <DeleteDialog
      title="Remove Training Plan"
      description="Are you sure you want to remove this training plan subscription? This will clear your current progress."
      onDelete={handleCancel}
      trigger={triggerButton}
    />
  );
}
