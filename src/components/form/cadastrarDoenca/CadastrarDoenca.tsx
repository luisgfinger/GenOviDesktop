import React, { useState } from "react";
import "./CadastrarDoenca.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";
import { useCriarDoenca } from "../../../api/hooks/doenca/UseDoencas";

const CadastrarDoenca: React.FC = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const { criarDoenca, loading } = useCriarDoenca();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !descricao) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novaDoenca = {
        nome,
        descricao,
      };

      await criarDoenca(novaDoenca);
      toast.success("Doença cadastrada com sucesso!");

      setNome("");
      setDescricao("");
    } catch {
      toast.error("Erro ao salvar doença. Tente novamente.");
    }
  };

  return (
    <div className="cadastrar-doenca-bg">
      <form
        className="cadastrarDoenca-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Insira o nome"
              maxLength={50}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="descircao">Descrição</label>
            <textarea
              id="descricao"
              placeholder="Insira a descrição"
              maxLength={255}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </li>
        </ul>
        <Button variant="cadastrar" type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar doença"}
          </Button>
      </form>
    </div>
  );
};

export default CadastrarDoenca;
