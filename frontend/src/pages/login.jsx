import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../auth/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
  setServerError("");

  try {
    const response = await login(
      data.email,
      data.password
    );

    if (response.role === "ADMIN") {
      navigate("/admin/dashboard", {
        replace: true,
      });
      return;
    }

    if (response.role === "CUSTOMER") {
      navigate("/customer/dashboard", {
        replace: true,
      });
      return;
    }

    setServerError(
      "Your account does not have a valid application role."
    );

  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      "Unable to sign in. Please check your credentials.";

    setServerError(message);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-muted lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    SmartRetailAI
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Intelligent Retail Platform
                  </p>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="mb-4 text-sm font-medium text-primary">
                  SMART RETAIL INTELLIGENCE
                </p>

                <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                  Intelligent retail,
                  <br />
                  built around you.
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                  Access your SmartRetailAI workspace and
                  connect with AI-powered retail intelligence,
                  customer insights, and personalized assistance.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              AI-powered retail management platform
            </p>
          </div>
        </div>

        {/* Login panel */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold">
                    SmartRetailAI
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Intelligent Retail Platform
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue to your workspace.
              </p>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 pl-10"
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-11 pl-10 pr-10"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Secure access to SmartRetailAI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}