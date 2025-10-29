import React, { useState } from "react";
import "./CadastrarUsuario.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";
import { useUsuarios } from "../../../api/hooks/usuario/UseUsuarios";
import { useFuncionarios } from "../../../api/hooks/funcionario/UseFuncionarios";
import { Role } from "../../../api/enums/role/Role";

const CadastrarUsuario: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [ativo, setAtivo] = useState<boolean>(true);
  const [autenticacao2fa, setAutenticacao2fa] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(Role.ROLE_USER);
  const [funcionarioId, setFuncionarioId] = useState<string>("");

  const { criarUsuario, loading } = useUsuarios();
  const {
    funcionarios,
    loading: loadingFuncionarios,
    error: errorFuncionarios,
  } = useFuncionarios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novoUsuario = {
        id: 0,
        email,
        senha,
        ativo,
        autenticacao2fa,
        roles: [role],
        funcionario: funcionarioId ? { id: Number(funcionarioId) } : undefined,
      };

      await criarUsuario(novoUsuario);
      toast.success("Usuário cadastrado com sucesso!");

      setEmail("");
      setSenha("");
      setAtivo(true);
      setAutenticacao2fa(false);
      setRole(Role.ROLE_USER);
      setFuncionarioId("");
    } catch {
      toast.error("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <div className="cadastrar-usuario-bg">
      <form
        className="cadastrarUsuario-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Insira o e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </li>

          <li className="flex-column">
            <label htmlFor="senha">Senha</label>
            <input
              className="cadastrarUsuario-container-input-senha"
              type="password"
              id="user-senha"
              placeholder="Insira a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </li>

          <li className="flex-column">
            <label htmlFor="role">Função</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              required
            >
              <option value={Role.ROLE_USER}>Usuário comum</option>
              <option value={Role.ROLE_ADMIN}>Administrador</option>
            </select>
          </li>

          <li className="flex-column">
            <label htmlFor="funcionarioId">Funcionário vinculado</label>
            {loadingFuncionarios ? (
              <p>Carregando funcionários...</p>
            ) : errorFuncionarios ? (
              <p style={{ color: "red" }}>{errorFuncionarios}</p>
            ) : (
              <select
                id="funcionarioId"
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(e.target.value)}
              >
                <option value="">Selecione o funcionário...</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={String(f.id)}>
                    {f.nome} — {f.cpfCnpj}
                  </option>
                ))}
              </select>
            )}
          </li>
          <li className="flex-column">
            <ul className="cadastrarUsuario-container-checks flex-column">
              <li
                className="flex-row"
              >
                <input
                  type="checkbox"
                  id="ativo"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                />
                <label htmlFor="ativo">Usuário ativo</label>
              </li>
              <li
                className="flex-row"
              >
                <input
                  type="checkbox"
                  id="autenticacao2fa"
                  checked={autenticacao2fa}
                  onChange={(e) => setAutenticacao2fa(e.target.checked)}
                />
                <label htmlFor="autenticacao2fa">
                  Autenticação em 2 etapas
                </label>
              </li>
            </ul>
          </li>
        </ul>

        <Button variant="cadastrar" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar usuário"}
        </Button>
      </form>
    </div>
  );
};

export default CadastrarUsuario;
