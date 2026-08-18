import { useState } from "react";
import { Star } from "lucide-react";

import api from "@/api/axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReviewForm({ onSubmitted }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!review.trim()) {
      setError("Please enter a review.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/reviews/", {
        review: review.trim(),
        rating,
      });

      setReview("");
      setRating(5);
      setSuccess("Your review was submitted successfully.");

      if (onSubmitted) {
        await onSubmitted();
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to submit your review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share your experience</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <p className="mb-2 text-sm font-medium">
              Rating
            </p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded-md p-1 hover:bg-muted"
                  aria-label={`${value} star rating`}
                >
                  <Star
                    className="size-5"
                    fill={
                      value <= rating
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="review"
              className="mb-2 block text-sm font-medium"
            >
              Review
            </label>

            <textarea
              id="review"
              value={review}
              onChange={(event) =>
                setReview(event.target.value)
              }
              placeholder="Tell us about your store experience..."
              rows={5}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-primary">
              {success}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}