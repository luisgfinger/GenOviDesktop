import { useAuth } from "../../context/AuthContext";

export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin;
}
