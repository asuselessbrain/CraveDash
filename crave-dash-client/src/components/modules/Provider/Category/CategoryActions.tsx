"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProviderCategoryStatus } from "@/app/(providerLayout)/provider/data";

type CategoryActionResult = {
  success: boolean;
  message: string;
};

type CategoryActionsProps = {
  categoryId?: string;
  status?: ProviderCategoryStatus;
  onDeleteAction: (formData: FormData) => Promise<CategoryActionResult>;
  onToggleStatusAction: (formData: FormData) => Promise<CategoryActionResult>;
  showDelete?: boolean;
  showToggle?: boolean;
  containerClassName?: string;
};

export default function CategoryActions({
  categoryId,
  status,
  onDeleteAction,
  onToggleStatusAction,
  showDelete = true,
  showToggle = true,
  containerClassName,
}: CategoryActionsProps) {
  const router = useRouter();
  const [isDeleting, startDeleting] = useTransition();
  const [isTogglingStatus, startTogglingStatus] = useTransition();

  const canUpdateStatus = Boolean(categoryId) && (status === "ACTIVE" || status === "INACTIVE");

  const handleDelete = () => {
    if (!categoryId) {
      return;
    }

    startDeleting(async () => {
      const formData = new FormData();
      formData.set("categoryId", categoryId);

      try {
        const result = await onDeleteAction(formData);

        if (result.success) {
          toast.success(result.message || "Category deleted successfully!");
          router.refresh();
          return;
        }

        toast.error(result.message || "Failed to delete category.");
      } catch {
        toast.error("Something went wrong while deleting category.");
      }
    });
  };

  const handleToggleStatus = () => {
    if (!categoryId || !status) {
      return;
    }

    const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    startTogglingStatus(async () => {
      const formData = new FormData();
      formData.set("categoryId", categoryId);
      formData.set("nextStatus", nextStatus);

      try {
        const result = await onToggleStatusAction(formData);

        if (result.success) {
          toast.success(result.message || "Category status updated successfully!");
          router.refresh();
          return;
        }

        toast.error(result.message || "Failed to update category status.");
      } catch {
        toast.error("Something went wrong while updating category status.");
      }
    });
  };

  return (
    <div className={containerClassName}>
      {showDelete ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="w-full rounded-xl"
          disabled={!categoryId || isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      ) : null}

      {showToggle && canUpdateStatus ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full rounded-xl"
          disabled={isTogglingStatus}
          onClick={handleToggleStatus}
        >
          {isTogglingStatus
            ? "Updating..."
            : status === "ACTIVE"
              ? "Mark Inactive"
              : "Mark Active"}
        </Button>
      ) : null}
    </div>
  );
}
