import { useEffect, useState } from "react";
import { GestacaoService } from "../../services/gestacao/GestacaoService";
import type { GestacaoRequestDTO } from "../../dtos/gestacao/GestacaoRequestDTO";
import type { GestacaoResponseDTO } from "../../dtos/gestacao/GestacaoResponseDTO";

export function useGestacoes() {
  const [gestacoes, setGestacoes] = useState<GestacaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GestacaoService.listar();
        setGestacoes(data);
      } catch (err) {
        console.error("Erro ao buscar gestações:", err);
        setError("Não foi possível carregar as gestações.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { gestacoes, loading, error };
}

export function useGestacao(id: number | null) {
  const [gestacao, setGestacao] = useState<GestacaoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar gestação.");
      return;
    }

    const fetchGestacao = async () => {
      try {
        const data = await GestacaoService.buscarPorId(id);
        setGestacao(data);
      } catch (err) {
        console.error("Erro ao carregar gestação:", err);
        setError("Não foi possível carregar a gestação.");
      } finally {
        setLoading(false);
      }
    };

    fetchGestacao();
  }, [id]);

  return { gestacao, loading, error };
}

export function useCriarGestacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaGestacao, setNovaGestacao] = useState<GestacaoResponseDTO | null>(
    null
  );

  const criarGestacao = async (dto: GestacaoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await GestacaoService.criar(dto);
      setNovaGestacao(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar gestação:", err);
      setError("Não foi possível cadastrar a gestação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarGestacao, novaGestacao, loading, error };
}

export function useEditarGestacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gestacaoEditada, setGestacaoEditada] =
    useState<GestacaoResponseDTO | null>(null);

  const editarGestacao = async (id: number, dto: GestacaoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await GestacaoService.editar(id, dto);
      setGestacaoEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar gestação:", err);
      setError("Não foi possível editar a gestação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarGestacao, gestacaoEditada, loading, error };
}

export function useRemoverGestacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const removerGestacao = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await GestacaoService.remover(id);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao remover gestação:", err);
      setError("Não foi possível remover a gestação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerGestacao, success, loading, error };
}
