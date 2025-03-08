import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation();

  return isAuthenticated ? children : (
    <Navigate to="/" replace state={{ from: location }} />
  );
}

export default ProtectedRoute;