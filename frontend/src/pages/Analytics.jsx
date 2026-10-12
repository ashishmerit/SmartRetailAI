
import { useEffect, useState } from "react";
import { BarChart3, LoaderCircle } from "lucide-react";

import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BarList({ items, labelKey, valueKey }) {
  const maximum = Math.max(1, ...items.map((item) => item[valueKey] || 0));

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const value = item[valueKey] || 0;
        const label = item[labelKey];

        return (
          <div key={`${label}-${index}`} className="space-y-1">
            <div className="flex justify-between gap-3 text-sm">
              <span>{label}</span>
              <span className="font-medium tabular-nums">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(value / maximum) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get("/analytics/summary"),
      api.get("/analytics/details"),
    ])
      .then(([summaryResponse, detailsResponse]) => {
        if (!active) return;
        setSummary(summaryResponse.data);
        setDetails(detailsResponse.data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load analytics. Verify your admin session and API."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading analytics...
      </div>
    );
  }

  if (error) {
    return <p role="alert" className="text-sm text-destructive">{error}</p>;
  }

  const visitItems = (details?.visit_trend || []).map((item) => ({
    ...item,
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <BarChart3 className="size-7" /> Analytics
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Database-backed customer, visit, review, and sentiment insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Customers", summary.total_customers],
          ["Visits Today", summary.visits_today],
          ["Total Visits", summary.total_visits],
          ["Total Reviews", summary.total_reviews],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">
              {Number(value ?? 0).toLocaleString()}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visits — Last 7 Days (UTC)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={visitItems}
              labelKey="label"
              valueKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Review Ratings</CardTitle></CardHeader>
          <CardContent>
            <BarList
              items={(details?.rating_distribution || []).map((item) => ({
                ...item,
                label: `${item.rating} ${item.rating === 1 ? "star" : "stars"}`,
              }))}
              labelKey="label"
              valueKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sentiment Distribution</CardTitle></CardHeader>
          <CardContent>
            <BarList
              items={details?.sentiment_distribution || []}
              labelKey="sentiment"
              valueKey="count"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Interpretation</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              These charts summarize stored records; they do not represent
              forecasts or prove that a trend is statistically significant.
            </p>
            <p>
              Product detection history is not persisted yet, so cumulative
              product counts are not included.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
