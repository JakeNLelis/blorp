"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview } from "./actions";

type ReviewFormProps = {
  productId: string;
};

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await submitReview(productId, rating, comment);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setComment("");
        setRating(5);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-none border bg-card/45 p-6 space-y-6 max-w-xl font-sans">
      <div className="space-y-1.5">
        <h3 className="text-xl font-medium tracking-tight font-heading">
          Write a Review
        </h3>
        <p className="text-xs text-muted-foreground">
          Share your experience with this product. Since you purchased this
          product, your review will carry a{" "}
          <span className="text-emerald-500 font-semibold">Verified Buyer</span>{" "}
          badge.
        </p>
      </div>

      {success && (
        <div className="flex items-start gap-3 rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600 text-sm">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold">Review Submitted</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">
              Thank you for sharing your feedback!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-none border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm">
          <AlertCircle className="size-5 shrink-0 text-destructive/80" />
          <div>
            <p className="font-semibold">Submission Failed</p>
            <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                className="p-1 hover:scale-110 transition-transform rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHoverRating(val)}
                onMouseLeave={() => setHoverRating(null)}
                disabled={loading}
                aria-label={`Set rating to ${val} stars`}
                aria-pressed={rating === val}
              >
                <Star
                  className={`size-7 transition-colors ${
                    val <= (hoverRating ?? rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30 hover:text-amber-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="comment">
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="What did you think of the design, texture, and overall quality?"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-md justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting Review...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}
