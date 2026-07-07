"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteProduct } from "@/app/admin/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProductDeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  return (
    <DeleteDialog
      title={`Delete "${name}"?`}
      description="This will permanently remove this product from your store. This action cannot be undone."
      onDelete={async () => {
        const result = await deleteProduct(id);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Product deleted");
          router.refresh();
        }
      }}
    />
  );
}
