import { useEffect, useState } from "react";
import { MedicamentoService } from "../../services/medicamento/MedicamentoService";
import type { MedicamentoRequestDTO } from "../../dtos/medicamento/MedicamentoRequestDTO";
import type { MedicamentoResponseDTO } from "../../dtos/medicamento/MedicamentoResponseDTO";

export function useMedicamentos() {
  const [medicamentos, setMedicamentos] = useState<MedicamentoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MedicamentoService.listarTodos();
        setMedicamentos(data);
      } catch (err) {
        console.error("Erro ao buscar medicamentos:", err);
        setError("Não foi possível carregar os medicamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { medicamentos, loading, error };
}

export function useMedicamento(id: number | null) {
  const [medicamento, setMedicamento] = useState<MedicamentoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar medicamento");
      return;
    }

    const fetchMedicamento = async () => {
      try {
        const data = await MedicamentoService.buscarPorId(id);
        setMedicamento(data);
      } catch (err) {
        console.error("Erro ao carregar medicamento:", err);
        setError("Não foi possível carregar o medicamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamento();
  }, [id]);

  return { medicamento, loading, error };
}

export function useCriarMedicamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoMedicamento, setNovoMedicamento] = useState<MedicamentoResponseDTO | null>(null);

  const criarMedicamento = async (dto: MedicamentoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await MedicamentoService.criar(dto);
      setNovoMedicamento(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar medicamento:", err);
      setError("Não foi possível cadastrar o medicamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarMedicamento, novoMedicamento, loading, error };
}

export function useEditarMedicamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicamentoEditado, setMedicamentoEditado] = useState<MedicamentoResponseDTO | null>(null);

  const editarMedicamento = async (id: number, dto: MedicamentoRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await MedicamentoService.atualizar(id, dto);
      setMedicamentoEditado(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar medicamento:", err);
      setError("Não foi possível editar o medicamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarMedicamento, medicamentoEditado, loading, error };
}

export function useRemoverMedicamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const removerMedicamento = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await MedicamentoService.remover(id);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao remover medicamento:", err);
      setError("Não foi possível remover o medicamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerMedicamento, success, loading, error };
}
