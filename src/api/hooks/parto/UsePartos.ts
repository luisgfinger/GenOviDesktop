import { useEffect, useState } from "react";
import { PartoService } from "../../services/parto/PartoService";
import type { PartoResponseDTO } from "../../dtos/parto/PartoResponseDTO";

export function usePartos() {
  const [partos, setPartos] = useState<PartoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PartoService.listar();
        setPartos(data);
      } catch (err) {
        console.error("Erro ao buscar partos:", err);
        setError("Não foi possível carregar os partos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { partos, loading, error };
}
