import { useAppSelector } from "@/store";
import React from "react";
import { LayoutRouteProps, Navigate } from "react-router-dom";

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
  const { token } = useAppSelector((state) => state.auth);

  // 🔐 If route is protected and user is NOT logged in → go to sign-in
  if (isAuthProtected && !token) {
    return <Navigate to="/sigin-in" replace />;
  }

  // 🚫 If route is public and user IS logged in → go to dashboard
  if (!isAuthProtected && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Otherwise render normally
  return Layout ? <Layout>{children}</Layout> : <>{children}</>;
};

export default AuthMiddleware;
