import { useEffect, useState } from "react";
import { CompraService } from "../../services/compra/CompraService";
import type { Compra } from "../../models/compra/CompraModel";

export function useCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CompraService.listarTodos();
        setCompras(data);
      } catch (err) {
        console.error("Erro ao buscar compras:", err);
        setError("Não foi possível carregar as compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { compras, loading, error };
}
