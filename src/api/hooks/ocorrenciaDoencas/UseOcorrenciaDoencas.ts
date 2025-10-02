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

  return { ocorrencias, loading, error };
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

  return { ocorrencia, loading, error };
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
