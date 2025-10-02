import { useEffect, useState } from "react";
import { FuncionarioService } from "../../services/funcionario/FuncionarioService";
import type { FuncionarioRequestDTO } from "../../dtos/funcionario/FuncionarioRequestDTO";
import type { FuncionarioResponseDTO } from "../../dtos/funcionario/FuncionarioResponseDTO";

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const data = await FuncionarioService.listarTodos();
        setFuncionarios(data);
      } catch (err) {
        console.error("Erro ao buscar funcionários:", err);
        setError("Não foi possível carregar os funcionários.");
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  return { funcionarios, loading, error };
}

export function useCriarFuncionario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoFuncionario, setNovoFuncionario] = useState<FuncionarioResponseDTO | null>(null);

  const criarFuncionario = async (dto: FuncionarioRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await FuncionarioService.salvar(dto);
      setNovoFuncionario(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar funcionário:", err);
      setError("Não foi possível cadastrar o funcionário.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarFuncionario, novoFuncionario, loading, error };
}
