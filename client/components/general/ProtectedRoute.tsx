import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, fetchUserData, clearError } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Only fetch user data if we don't have it yet
        if (!user && isAuthenticated) {
          await fetchUserData();
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        clearError();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, user, fetchUserData, clearError]);

  // Show loading state while checking authentication
  if (loading || isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Check if user has the required role if specified
  // For admin role, check is_admin boolean, otherwise just check if authenticated
  const hasRequiredRole = !requiredRole || 
    (requiredRole === 'admin' ? user?.is_admin === true : true);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have required role, redirect to unauthorized or home
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and has required role, render children
  return <>{children}</>;
}

export default ProtectedRoute;