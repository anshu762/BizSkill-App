"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ReviewModalProps = {
  exchangeId: string;
  revieweeId: string;
  revieweeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function ReviewModal({ exchangeId, revieweeId, revieweeName, open, onOpenChange, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;
    setSending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeId, revieweeId, rating, comment: comment || undefined }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted!");
      onSuccess();
      onOpenChange(false);
      setRating(0);
      setComment("");
    } catch {
      toast.error("Failed to submit review");
    }
    setSending(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-gray-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Review {revieweeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Comment (optional)</label>
            <Textarea
              className="border-white/10"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => e.target.value.length <= 200 && setComment(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">{comment.length}/200</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-gray-300">
              Cancel
            </Button>
            <Button
              disabled={rating === 0 || sending}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
