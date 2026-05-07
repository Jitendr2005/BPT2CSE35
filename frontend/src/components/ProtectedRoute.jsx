import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-shell centered">Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
  }

  return children;
}

export default ProtectedRoute;
