
import { useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  UserPlus,
  XCircle,
} from "lucide-react";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Enrollment() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [image, setImage] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getErrorMessage = (err) =>
    err.response?.data?.detail ||
    err.response?.data?.message ||
    err.message ||
    "Something went wrong. Please try again.";

  const createAccount = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register/customer", {
        email: form.email.trim(),
        password: form.password,
      });

      setAccount(true);
      setSuccess(
        "Customer enrollment and account creation completed successfully."
      );
    } catch (err) {
      setError(
        `Customer was enrolled successfully, but account creation failed: ${getErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!enrollment && !image) {
      setError("Please select a face image.");
      return;
    }

    if (enrollment) {
      await createAccount();
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("image", image);

      const response = await api.post(
        "/enrollment/customer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEnrollment(response.data);

      // Enrollment succeeded. Create the login account separately.
      // If this fails, the form retains the enrollment result so the
      // admin can retry account creation without enrolling the face again.
      setLoading(false);
      await createAccount();
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setImage(null);
    setEnrollment(null);
    setAccount(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
      <div>
        <div className="flex items-center gap-2">
          <UserPlus className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer Enrollment
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Register a customer, enroll their face, and create their login
          account.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-green-600/30 bg-green-600/5 p-4 text-sm"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {enrollment && (
        <Card>
          <CardContent className="flex items-start gap-3 pt-6">
            <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-600" />
            <div className="space-y-1">
              <p className="font-medium">Face enrollment completed</p>
              <p className="text-sm text-muted-foreground">
                {enrollment.message}
              </p>
              <p className="text-sm">
                Customer ID: {enrollment.customer_id}
              </p>
              <p className="text-sm">
                Embedding dimensions: {enrollment.embedding_dimensions}
              </p>
              {account !== true && (
                <p className="pt-2 text-sm">
                  Create the customer's login account below. Face enrollment
                  will not be repeated.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {account
              ? "Enrollment Complete"
              : enrollment
                ? "Create Customer Account"
                : "Customer Details"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {account ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The customer can now sign in using their registered email
                address and password.
              </p>
              <Button onClick={resetForm}>
                Enroll Another Customer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!enrollment && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter customer name"
                        value={form.name}
                        onChange={updateField}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="customer@example.com"
                        value={form.email}
                        onChange={updateField}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={updateField}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Face Image
                    </label>

                    <label
                      htmlFor="image"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition hover:bg-muted/50"
                    >
                      <ImagePlus className="size-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {image ? image.name : "Choose a face image"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Select a clear image with the customer's face visible.
                      </span>
                    </label>

                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) =>
                        setImage(event.target.files?.[0] || null)
                      }
                      required={!enrollment}
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {enrollment
                    ? "Set Customer Password"
                    : "Customer Login Password"}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Set a password for customer login"
                  value={form.password}
                  onChange={updateField}
                  required
                  minLength={8}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : enrollment ? (
                    "Retry Account Creation"
                  ) : (
                    "Enroll Customer"
                  )}
                </Button>

                {!enrollment && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Clear Form
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
