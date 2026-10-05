import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase() || "owner";

  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to={userRole === "nominee" ? "/nominee" : "/owner"} replace />;
  }

  return children;
}