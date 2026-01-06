import { useAppSelector } from "@/store";
import React from "react";
import { LayoutRouteProps, Navigate, useLocation } from "react-router-dom";

interface AuthMiddlewareProps {
  layout?: React.FC<LayoutRouteProps>;
  isAuthProtected: boolean;
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  layout: Layout,
  children,
  isAuthProtected,
}) => {
  const { token, can_register } = useAppSelector((state) => state.auth);
  const location = useLocation();


  // 🔐 Priority: If can_register is true → ALWAYS redirect to sign-up (never sign-in)
  // Only redirect if not already on sign-up page to avoid redirect loops
  if (!token && can_register) {
    if (location.pathname !== "/sigin-up") {
      return <Navigate to="/sigin-up" replace />;
    }
    // If already on sign-up page, allow it to render
    return Layout ? <Layout>{children}</Layout> : <>{children}</>;
  }

  // 🔐 If route is protected and user is NOT logged in → redirect to sign-in
  // Only redirect if can_register is false/undefined and not already on sign-in
  if (isAuthProtected && !token) {
    if (location.pathname !== "/sigin-in") {
      return <Navigate to="/sigin-in" replace />;
    }
    // If already on sign-in page, allow it to render
    return Layout ? <Layout>{children}</Layout> : <>{children}</>;
  }

  // 🚫 If route is public and user IS logged in → go to dashboard
  if (!isAuthProtected && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Otherwise render normally
  return Layout ? <Layout>{children}</Layout> : <>{children}</>;
};

export default AuthMiddleware;
