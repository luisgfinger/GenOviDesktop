import { useEffect, useState } from "react";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    setIsAdmin(stored === "true");
  }, []);

  return isAdmin;
}
