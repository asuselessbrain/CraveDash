"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProviderCuisineStatus } from "@/app/(providerLayout)/provider/data";

type CuisineActionResult = {
  success: boolean;
  message: string;
};

type CuisineActionsProps = {
  cuisineId?: string;
  status?: ProviderCuisineStatus;
  onDeleteAction: (formData: FormData) => Promise<CuisineActionResult>;
  onToggleStatusAction: (formData: FormData) => Promise<CuisineActionResult>;
  showDelete?: boolean;
  showToggle?: boolean;
  containerClassName?: string;
};

export default function CuisineActions({
  cuisineId,
  status,
  onDeleteAction,
  onToggleStatusAction,
  showDelete = true,
  showToggle = true,
  containerClassName,
}: CuisineActionsProps) {
  const router = useRouter();
  const [isDeleting, startDeleting] = useTransition();
  const [isTogglingStatus, startTogglingStatus] = useTransition();

  const canUpdateStatus = Boolean(cuisineId) && (status === "ACTIVE" || status === "INACTIVE");

  const handleDelete = () => {
    if (!cuisineId) {
      return;
    }

    startDeleting(async () => {
      const formData = new FormData();
      formData.set("cuisineId", cuisineId);

      try {
        const result = await onDeleteAction(formData);

        if (result.success) {
          toast.success(result.message || "Cuisine deleted successfully!");
          router.refresh();
          return;
        }

        toast.error(result.message || "Failed to delete cuisine.");
      } catch {
        toast.error("Something went wrong while deleting cuisine.");
      }
    });
  };

  const handleToggleStatus = () => {
    if (!cuisineId || !status) {
      return;
    }

    const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    startTogglingStatus(async () => {
      const formData = new FormData();
      formData.set("cuisineId", cuisineId);
      formData.set("nextStatus", nextStatus);

      try {
        const result = await onToggleStatusAction(formData);

        if (result.success) {
          toast.success(result.message || "Cuisine status updated successfully!");
          router.refresh();
          return;
        }

        toast.error(result.message || "Failed to update cuisine status.");
      } catch {
        toast.error("Something went wrong while updating cuisine status.");
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
          disabled={!cuisineId || isDeleting}
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
