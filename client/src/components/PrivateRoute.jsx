// client/src/components/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Validando sessão...</p>;

  if (!usuario) {
    const redirectTo = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect=${redirectTo}`} />;
  }

  return children;
}
