import { Navigate } from "react-router-dom";
import { getUser } from "../api/api";

function ProtectedRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

