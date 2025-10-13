import { useEffect, useState } from "react";
import { RegistroService } from "../../services/registro/RegistroService";
import type { RegistroRequestDTO } from "../../dtos/registro/RegistroRequestDTO";
import type { RegistroResponseDTO } from "../../dtos/registro/RegistroResponseDTO";


export function useRegistros() {
  const [registros, setRegistros] = useState<RegistroResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await RegistroService.listarTodos();
        setRegistros(data);
      } catch (err) {
        console.error("Erro ao buscar registros:", err);
        setError("Não foi possível carregar os registros.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { registros, loading, error };
}

export function useRegistro(id: number | null) {
  const [registro, setRegistro] = useState<RegistroResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar registro");
      return;
    }

    const fetchRegistro = async () => {
      try {
        const data = await RegistroService.buscarPorId(id);
        setRegistro(data);
      } catch (err) {
        console.error("Erro ao carregar registro:", err);
        setError("Não foi possível carregar o registro.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistro();
  }, [id]);

  return { registro, loading, error };
}

export function useCriarRegistro() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoRegistro, setNovoRegistro] = useState<RegistroResponseDTO | null>(null);

  const criarRegistro = async (dto: RegistroRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await RegistroService.criar(dto);
      setNovoRegistro(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar registro:", err);
      setError("Não foi possível cadastrar o registro.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarRegistro, novoRegistro, loading, error };
}

export function useEditarRegistro() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registroEditado, setRegistroEditado] = useState<RegistroResponseDTO | null>(null);

  const editarRegistro = async (id: number, dto: RegistroRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await RegistroService.editar(id, dto);
      setRegistroEditado(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar registro:", err);
      setError("Não foi possível editar o registro.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarRegistro, registroEditado, loading, error };
}

export function useRemoverRegistro() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removido, setRemovido] = useState<boolean>(false);

  const removerRegistro = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await RegistroService.remover(id);
      setRemovido(true);
    } catch (err) {
      console.error("Erro ao remover registro:", err);
      setError("Não foi possível remover o registro.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerRegistro, removido, loading, error };
}
