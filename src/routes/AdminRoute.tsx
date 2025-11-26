import { Navigate, Outlet } from "react-router-dom";
import { useIsAdmin } from "../api/hooks/useIsAdmin";

const AdminRoute = () => {
  const isAdmin = useIsAdmin();

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
