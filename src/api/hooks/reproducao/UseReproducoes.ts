import { useEffect, useState } from "react";
import { ReproducaoService } from "../../services/reproducao/ReproducaoService";
import type { ReproducaoResponseDTO } from "../../dtos/reproducao/ReproducaoResponseDTO";
import type { ReproducaoRequestDTO } from "../../dtos/reproducao/ReproducaoRequestDTO";

export function useReproducoes() {
  const [reproducoes, setReproducoes] = useState<ReproducaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ReproducaoService.listar();
        setReproducoes(data);
      } catch (err) {
        console.error("Erro ao buscar reproduções:", err);
        setError("Não foi possível carregar as reproduções.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { reproducoes, setReproducoes, loading, error };
}

export function useReproducao(id: number | null) {
  const [reproducao, setReproducao] = useState<ReproducaoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar reprodução");
      return;
    }

    const fetchReproducao = async () => {
      try {
        const data = await ReproducaoService.buscarPorId(id);
        setReproducao(data);
      } catch (err) {
        console.error("Erro ao carregar reprodução:", err);
        setError("Não foi possível carregar a reprodução.");
      } finally {
        setLoading(false);
      }
    };

    fetchReproducao();
  }, [id]);

  return { reproducao, loading, error };
}

export function useCriarReproducao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaReproducao, setNovaReproducao] = useState<ReproducaoResponseDTO | null>(null);

  const criarReproducao = async (dto: ReproducaoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await ReproducaoService.criar(dto);
      setNovaReproducao(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar reprodução:", err);
      setError("Não foi possível cadastrar a reprodução.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarReproducao, novaReproducao, loading, error };
}

export function useEditarReproducao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reproducaoEditada, setReproducaoEditada] = useState<ReproducaoResponseDTO | null>(null);

  const editarReproducao = async (id: number, dto: ReproducaoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await ReproducaoService.editar(id, dto);
      setReproducaoEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar reprodução:", err);
      setError("Não foi possível editar a reprodução.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarReproducao, reproducaoEditada, loading, error };
}

export function useRemoverReproducao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removida, setRemovida] = useState(false);

  const removerReproducao = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await ReproducaoService.remover(id);
      setRemovida(true);
    } catch (err) {
      console.error("Erro ao remover reprodução:", err);
      setError("Não foi possível remover a reprodução.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerReproducao, removida, loading, error };
}
