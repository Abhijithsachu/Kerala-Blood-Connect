import { Navigate } from "react-router-dom";
import { getUser } from "../api/api";

function HospitalProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "hospital" ? children : <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
}

export default HospitalProtectedRoute;
