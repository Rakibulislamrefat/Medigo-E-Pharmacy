import { Navigate, Outlet } from "react-router-dom";

import type { Role } from "../../types/domain";
import { useAuthStore } from "../../features/auth/authStore";

export function RequireRole(props: { role: Role }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== props.role) return <Navigate to="/" replace />;
  return <Outlet />;
}

