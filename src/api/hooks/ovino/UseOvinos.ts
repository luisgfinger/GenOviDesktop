import { useEffect, useState } from "react";
import type { Ovino } from "../../models/ovino/OvinoModel"
import { OvinoService } from "../../services/ovino/OvinoService";

export function useOvinos() {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOvinos = async () => {
      try {
        const data = await OvinoService.listarTodos();
        setOvinos(data);
      } catch (err) {
        setError("Erro ao carregar ovinos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOvinos();
  }, []);

  return { ovinos, loading, error };
}
