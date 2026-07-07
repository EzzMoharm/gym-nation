"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deletePlan } from "@/app/admin/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PlanDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  return (
    <DeleteDialog
      title={`Delete "${name}"?`}
      description="This will permanently remove this training plan. This action cannot be undone."
      onDelete={async () => {
        const result = await deletePlan(id);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Plan deleted");
          router.refresh();
        }
      }}
    />
  );
}
