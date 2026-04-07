import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "instructor" | "student";
  allowGuest?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  allowGuest = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-20 mb-4" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isAuthenticated && !allowGuest) {
    return <Navigate to="/auth" replace />;
  }

  if (isAuthenticated && requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
