import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LandingPage } from "./LandingPage";

export function HomeRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (accessToken) return <Navigate to="/discover" replace />;
  return <LandingPage />;
}