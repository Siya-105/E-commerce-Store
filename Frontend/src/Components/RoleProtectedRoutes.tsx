import type React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRole: string;
}

const RoleProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // wrong role
  if (role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;