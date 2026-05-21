import { Navigate } from "react-router-dom";
import { getUser } from "../api/api";

function AdminProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? children : <Navigate to="/dashboard" replace />;
}

export default AdminProtectedRoute;

