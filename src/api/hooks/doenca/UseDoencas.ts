import { useEffect, useState } from "react";
import { DoencaService } from "../../services/doenca/DoencaService";
import type { DoencaRequestDTO } from "../../dtos/doenca/DoencaRequestDTO";
import type { DoencaResponseDTO } from "../../dtos/doenca/DoencaResponseDTO";


export function useDoencas() {
  const [doencas, setDoencas] = useState<DoencaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoencas = async () => {
      try {
        const data = await DoencaService.listarTodos();
        setDoencas(data);
      } catch (err) {
        console.error("Erro ao buscar doenças:", err);
        setError("Não foi possível carregar as doenças.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoencas();
  }, []);

  return { doencas, loading, error };
}


export function useDoenca(id: number | null) {
  const [doenca, setDoenca] = useState<DoencaResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar doença");
      return;
    }

    const fetchDoenca = async () => {
      try {
        const data = await DoencaService.buscarPorId(id);
        setDoenca(data);
      } catch (err) {
        console.error("Erro ao carregar doença:", err);
        setError("Não foi possível carregar a doença.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoenca();
  }, [id]);

  return { doenca, loading, error };
}

export function useCriarDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaDoenca, setNovaDoenca] = useState<DoencaResponseDTO | null>(null);

  const criarDoenca = async (dto: DoencaRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await DoencaService.salvar(dto);
      setNovaDoenca(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar doença:", err);
      setError("Não foi possível cadastrar a doença.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarDoenca, novaDoenca, loading, error };
}

export function useEditarDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doencaEditada, setDoencaEditada] = useState<DoencaResponseDTO | null>(null);

  const editarDoenca = async (id: number, dto: DoencaRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await DoencaService.editar(id, dto);
      setDoencaEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar doença:", err);
      setError("Não foi possível editar a doença.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarDoenca, doencaEditada, loading, error };
}

export function useRemoverDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const removerDoenca = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await DoencaService.remover(id);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao remover doença:", err);
      setError("Não foi possível remover a doença.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerDoenca, success, loading, error };
}
