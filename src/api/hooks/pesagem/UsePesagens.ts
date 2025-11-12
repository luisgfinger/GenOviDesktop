import { useEffect, useState } from "react";
import { PesagemService } from "../../services/pesagem/PesagemService";
import type { PesagemRequestDTO } from "../../dtos/pesagem/PesagemRequestDTO";
import type { PesagemResponseDTO } from "../../dtos/pesagem/PesagemResponseDTO";


export function usePesagens() {
  const [pesagens, setPesagens] = useState<PesagemResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPesagens = async () => {
      try {
        const data = await PesagemService.listarTodos();
        setPesagens(data);
      } catch (err) {
        console.error("Erro ao buscar pesagens:", err);
        setError("Não foi possível carregar as pesagens.");
      } finally {
        setLoading(false);
      }
    };

    fetchPesagens();
  }, []);

  return { pesagens, loading, error };
}


export function usePesagem(id: number | null) {
  const [pesagem, setPesagem] = useState<PesagemResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar pesagem");
      return;
    }

    const fetchPesagem = async () => {
      try {
        const data = await PesagemService.buscarPorId(id);
        setPesagem(data);
      } catch (err) {
        console.error("Erro ao carregar pesagem:", err);
        setError("Não foi possível carregar a pesagem.");
      } finally {
        setLoading(false);
      }
    };

    fetchPesagem();
  }, [id]);

  return { pesagem, loading, error };
}


export function useCriarPesagem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaPesagem, setNovaPesagem] = useState<PesagemResponseDTO | null>(null);

  const criarPesagem = async (dto: PesagemRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await PesagemService.criar(dto);
      setNovaPesagem(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar pesagem:", err);
      setError("Não foi possível cadastrar a pesagem.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarPesagem, novaPesagem, loading, error };
}


export function useEditarPesagem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pesagemEditada, setPesagemEditada] = useState<PesagemResponseDTO | null>(null);

  const editarPesagem = async (id: number, dto: PesagemRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await PesagemService.editar(id, dto);
      setPesagemEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar pesagem:", err);
      setError("Não foi possível editar a pesagem.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarPesagem, pesagemEditada, loading, error };
}


export function useRemoverPesagem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removida, setRemovida] = useState<boolean>(false);

  const removerPesagem = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await PesagemService.remover(id);
      setRemovida(true);
    } catch (err) {
      console.error("Erro ao remover pesagem:", err);
      setError("Não foi possível remover a pesagem.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerPesagem, removida, loading, error };
}
