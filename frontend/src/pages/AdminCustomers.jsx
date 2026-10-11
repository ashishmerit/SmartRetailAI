import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Users,
  Award,
} from "lucide-react";

import api from "@/api/axios";
import { Card } from "@/components/ui/card";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCustomers = async () => {
      try {
        const response = await api.get("/customers/");

        if (mounted) {
          setCustomers(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.detail ||
              "Unable to load customers."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading customers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
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
          CUSTOMER MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Customers
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage and review registered SmartRetailAI customers.
        </p>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Customers
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {customers.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Registered customers
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Loyalty Points
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {customers.reduce(
                  (total, customer) =>
                    total + (customer.loyalty_points || 0),
                  0
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Across all customers
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

      </section>

      {/* Customer list */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Customer Directory
          </h2>

          <p className="text-sm text-muted-foreground">
            Customer accounts and loyalty information.
          </p>
        </div>

        <Card className="overflow-hidden">

          {customers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No customers found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Enrolled customers will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">

              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between"
                >

                  {/* Customer */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="font-medium">
                        {customer.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Customer #{customer.id}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 text-sm">

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>

                  </div>

                  {/* Loyalty */}
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-medium">
                        {customer.loyalty_points || 0} points
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Loyalty balance
                      </p>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </Card>
      </section>

    </div>
  );
}