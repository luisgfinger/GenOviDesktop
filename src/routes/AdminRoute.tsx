import { Navigate, Outlet } from "react-router-dom";
import { useIsAdmin } from "../api/hooks/useIsAdmin";

const AdminRoute = () => {
  const isAdmin = useIsAdmin();

  console.log("AdminRoute -> isAdmin:", isAdmin);

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
