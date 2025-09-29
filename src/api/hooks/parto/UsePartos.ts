import { useEffect, useState } from "react";
import { PartoService } from "../../services/parto/PartoService";
import type { PartoRequestDTO } from "../../dtos/parto/PartoRequestDTO";
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
        console.error("Erro ao buscar gestações:", err);
        setError("Não foi possível carregar as gestações.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { partos, loading, error };
}

export function useParto(id: number | null) {
  const [parto, setParto] = useState<PartoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar parto");
      return;
    }

    const fetchParto = async () => {
      try {
        const data = await PartoService.buscarPorId(id);
        setParto(data);
      } catch (err) {
        console.error("Erro ao carregar parto:", err);
        setError("Não foi possível carregar o parto.");
      } finally {
        setLoading(false);
      }
    };

    fetchParto();
  }, [id]);

  return { parto, loading, error };
}

export function useCriarParto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaParto, setNovaParto] = useState<PartoResponseDTO | null>(null);

  const criarParto = async (dto: PartoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await PartoService.criar(dto);
      setNovaParto(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar parto:", err);
      setError("Não foi possível cadastrar o parto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarParto, novaParto, loading, error };
}
