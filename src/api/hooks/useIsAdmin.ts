import { useEffect, useState } from "react";

export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");

    setIsAdmin(stored === "true");
  }, []);

  return isAdmin;
}
