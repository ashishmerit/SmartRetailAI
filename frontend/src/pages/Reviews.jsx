
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/reviews/admin")
      .then((response) => setReviews(response.data))
      .catch((err) =>
        setError(err.response?.data?.detail || "Could not load reviews.")
      )
      .finally(() => setLoading(false));
  }, []);

  const positive = reviews.filter(
    (review) => review.sentiment?.toLowerCase() === "positive"
  ).length;

  const negative = reviews.filter(
    (review) => review.sentiment?.toLowerCase() === "negative"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <Star className="size-7" /> Reviews & Sentiment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review feedback, ratings and sentiment predictions stored by the system.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Reviews</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">
            {loading ? "…" : reviews.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Positive</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">{loading ? "…" : positive}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Negative</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">{loading ? "…" : negative}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer Reviews</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews found.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">Customer #{review.customer_id}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="size-4" />
                      {review.rating}/5
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                    {review.review}
                  </p>
                  <div className="mt-3">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs">
                      Sentiment: {review.sentiment || "Unavailable"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
