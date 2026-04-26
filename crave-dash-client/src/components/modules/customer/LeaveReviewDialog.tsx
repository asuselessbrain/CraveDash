"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createReview } from "@/services/review";

type ReviewMealItem = {
  mealId: string;
  mealName: string;
};

type LeaveReviewDialogProps = {
  orderId: string;
  items: ReviewMealItem[];
};

export default function LeaveReviewDialog({ orderId, items }: LeaveReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(items[0]?.mealId ?? "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMeal = useMemo(
    () => items.find((item) => item.mealId === selectedMealId),
    [items, selectedMealId]
  );
  const hasReviewableItems = items.length > 0;

  const handleSubmitReview = async () => {
    if (!selectedMealId) {
      toast.error("Please select a meal first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createReview({
        mealId: selectedMealId,
        orderId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (response?.success) {
        toast.success(response?.message || "Review submitted successfully.");
        setOpen(false);
        setComment("");
        setRating(5);
        return;
      }

      toast.error(response?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!hasReviewableItems}
        >
          {hasReviewableItems ? "Leave Review" : "No reviewable meals"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Share your experience</DialogTitle>
          <DialogDescription>
            Your feedback helps other customers choose meals with confidence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Meal</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              value={selectedMealId}
              onChange={(event) => setSelectedMealId(event.target.value)}
              disabled={isSubmitting}
            >
              {items.map((item) => (
                <option key={item.mealId} value={item.mealId}>
                  {item.mealName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded-md p-1 text-slate-300 transition hover:text-amber-400"
                  disabled={isSubmitting}
                  aria-label={`Rate ${value} star`}
                >
                  <Star
                    className={`h-6 w-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{rating}/5</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Comment</label>
            <div className="relative">
              <MessageSquareText className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={`How was ${selectedMeal?.mealName || "the meal"}?`}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-800 outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmitReview}
            className="h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
