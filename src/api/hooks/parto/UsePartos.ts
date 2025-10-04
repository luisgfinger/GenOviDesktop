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

export function useParto(id: number | null) {
  const [parto, setParto] = useState<PartoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar parto.");
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
  const [novoParto, setNovoParto] = useState<PartoResponseDTO | null>(null);

  const criarParto = async (dto: PartoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await PartoService.criar(dto);
      setNovoParto(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar parto:", err);
      setError("Não foi possível cadastrar o parto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarParto, novoParto, loading, error };
}

export function useEditarParto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partoEditado, setPartoEditado] = useState<PartoResponseDTO | null>(null);

  const editarParto = async (id: number, dto: PartoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await PartoService.editar(id, dto);
      setPartoEditado(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar parto:", err);
      setError("Não foi possível editar o parto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarParto, partoEditado, loading, error };
}

export function useRemoverParto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removido, setRemovido] = useState(false);

  const removerParto = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await PartoService.remover(id);
      setRemovido(true);
    } catch (err) {
      console.error("Erro ao remover parto:", err);
      setError("Não foi possível remover o parto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerParto, removido, loading, error };
}
