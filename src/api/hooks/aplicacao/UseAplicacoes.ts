import { useEffect, useState } from "react";
import { AplicacaoService } from "../../services/aplicacao/AplicacaoService";
import type { AplicacaoRequestDTO } from "../../dtos/aplicacao/AplicacaoRequestDTO";
import type { AplicacaoResponseDTO } from "../../dtos/aplicacao/AplicacaoResponseDTO";

export function useAplicacoes() {
  const [aplicacoes, setAplicacoes] = useState<AplicacaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AplicacaoService.listarTodos();
        setAplicacoes(data);
      } catch (err) {
        console.error("Erro ao buscar aplicações:", err);
        setError("Não foi possível carregar as aplicações.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { aplicacoes, loading, error };
}

export function useAplicacao(id: number | null) {
  const [aplicacao, setAplicacao] = useState<AplicacaoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar aplicação");
      return;
    }

    const fetchAplicacao = async () => {
      try {
        const data = await AplicacaoService.buscarPorId(id);
        setAplicacao(data);
      } catch (err) {
        console.error("Erro ao carregar aplicação:", err);
        setError("Não foi possível carregar a aplicação.");
      } finally {
        setLoading(false);
      }
    };

    fetchAplicacao();
  }, [id]);

  return { aplicacao, loading, error };
}

export function useCriarAplicacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaAplicacao, setNovaAplicacao] = useState<AplicacaoResponseDTO | null>(null);

  const criarAplicacao = async (dto: AplicacaoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await AplicacaoService.criar(dto);
      setNovaAplicacao(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar aplicação:", err);
      setError("Não foi possível cadastrar a aplicação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarAplicacao, novaAplicacao, loading, error };
}
