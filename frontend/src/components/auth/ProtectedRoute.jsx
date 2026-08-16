import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  // No authenticated user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated but wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/customer/dashboard"
        replace
      />
    );
  }

  return children;
}