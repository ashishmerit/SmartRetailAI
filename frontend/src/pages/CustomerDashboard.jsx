import { useEffect, useState } from "react";
import {
  Award,
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  Star,
  UserRound,
} from "lucide-react";

import api from "@/api/axios";
import { Card } from "@/components/ui/card";

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [visits, setVisits] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          customerResponse,
          visitsResponse,
          reviewsResponse,
        ] = await Promise.all([
          api.get("/customers/me"),
          api.get("/customers/me/visits"),
          api.get("/customers/me/reviews"),
        ]);

        setCustomer(customerResponse.data);
        setVisits(visitsResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load your customer dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-destructive/30 p-6">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">

      {/* Header */}
      <section>
        <p className="text-sm font-medium text-primary">
          CUSTOMER WORKSPACE
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome back, {customer.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Here's your SmartRetailAI activity at a glance.
        </p>
      </section>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Loyalty Points
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {customer.loyalty_points}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Available points
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Store Visits
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {visits.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Recorded visits
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Reviews
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {reviews.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Submitted reviews
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

      </section>

      {/* Profile */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Your Profile
          </h2>

          <p className="text-sm text-muted-foreground">
            Information associated with your retail account.
          </p>
        </div>

        <Card className="divide-y">

          <div className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <UserRound className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {customer.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <Mail className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <Phone className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Phone
              </p>

              <p className="mt-1 font-medium">
                {customer.phone}
              </p>
            </div>
          </div>

        </Card>
      </section>

      {/* Recent Visits */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Recent Visits
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest visits to the store.
          </p>
        </div>

        <Card className="overflow-hidden">

          {visits.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No visits recorded yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your store visits will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {visits.slice(0, 5).map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-muted p-2.5">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="font-medium">
                        Store Visit
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          visit.visit_time
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Card>
      </section>

      {/* Reviews */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Your Reviews
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest feedback and sentiment analysis.
          </p>
        </div>

        <Card className="overflow-hidden">

          {reviews.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No reviews yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your submitted reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="space-y-3 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />

                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>

                    {review.sentiment && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {review.sentiment}
                      </span>
                    )}

                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          )}

        </Card>
      </section>

    </div>
  );
}