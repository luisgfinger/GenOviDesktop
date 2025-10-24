import { useEffect, useState } from "react";
import { OcorrenciaDoencaService } from "../../services/ocorrenciaDoenca.ts/OcorrenciaDoencaService";
import type { OcorrenciaDoencaRequestDTO } from "../../dtos/ocorrendiaDoenca/OcorrenciaDoencaRequestDTO";
import type { OcorrenciaDoencaResponseDTO } from "../../dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";


export function useOcorrenciasDoenca() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDoencaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await OcorrenciaDoencaService.listarTodos();
        setOcorrencias(data);
      } catch (err) {
        console.error("Erro ao buscar ocorrências de doença:", err);
        setError("Não foi possível carregar as ocorrências.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ocorrencias, loading, error, setOcorrencias };
}


export function useOcorrenciaDoenca(id: number | null) {
  const [ocorrencia, setOcorrencia] = useState<OcorrenciaDoencaResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar ocorrência de doença");
      return;
    }

    const fetchOcorrencia = async () => {
      try {
        const data = await OcorrenciaDoencaService.buscarPorId(id);
        setOcorrencia(data);
      } catch (err) {
        console.error("Erro ao carregar ocorrência de doença:", err);
        setError("Não foi possível carregar a ocorrência.");
      } finally {
        setLoading(false);
      }
    };

    fetchOcorrencia();
  }, [id]);

  return { ocorrencia, loading, error, setOcorrencia };
}

export function useCriarOcorrenciaDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaOcorrencia, setNovaOcorrencia] = useState<OcorrenciaDoencaResponseDTO | null>(null);

  const criarOcorrencia = async (dto: OcorrenciaDoencaRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await OcorrenciaDoencaService.criar(dto);
      setNovaOcorrencia(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar ocorrência de doença:", err);
      setError("Não foi possível cadastrar a ocorrência.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarOcorrencia, novaOcorrencia, loading, error };
}

export function useEditarOcorrenciaDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocorrenciaEditada, setOcorrenciaEditada] = useState<OcorrenciaDoencaResponseDTO | null>(null);

  const editarOcorrencia = async (id: number, dto: OcorrenciaDoencaRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await OcorrenciaDoencaService.editar(id, dto);
      setOcorrenciaEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar ocorrência de doença:", err);
      setError("Não foi possível editar a ocorrência.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarOcorrencia, ocorrenciaEditada, loading, error };
}

export function useRemoverOcorrenciaDoenca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const removerOcorrencia = async (id: number) => {
    setLoading(true);
    setError(null);
    setSucesso(false);

    try {
      await OcorrenciaDoencaService.remover(id);
      setSucesso(true);
    } catch (err) {
      console.error("Erro ao remover ocorrência de doença:", err);
      setError("Não foi possível remover a ocorrência.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerOcorrencia, sucesso, loading, error };
}
