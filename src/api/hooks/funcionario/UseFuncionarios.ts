import { useEffect, useState } from "react";
import { FuncionarioService } from "../../services/funcionario/FuncionarioService";
import type { FuncionarioResponseDTO } from "../../dtos/funcionario/FuncionarioResponseDTO";

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FuncionarioService.listarTodos()
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao buscar funcionários:", err))
      .finally(() => setLoading(false));
  }, []);

  return { funcionarios, loading };
};
