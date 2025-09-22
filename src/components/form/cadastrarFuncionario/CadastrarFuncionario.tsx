import React, { useState } from "react";
import "./CadastrarFuncionario.css";
import Button from "../../common/buttons/Button";
import { FuncionarioService } from "../../../api/services/funcionario/FuncionarioService";
import { toast } from "react-toastify";

const CadastrarFuncionario: React.FC = () => {
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState<string>("");
  const [dataAdmissao, setDataAdmissao] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !cpfCnpj || !endereco || !telefone || !dataAdmissao) {
      toast.warn("⚠️ Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novoFuncionario = {
        nome,
        cpfCnpj,
        endereco,
        telefone,
        dataAdmissao: `${dataAdmissao}T00:00:00`,
      };

      await FuncionarioService.salvar(novoFuncionario);
      toast.success("✅ Funcionário cadastrado com sucesso!");

      setNome("");
      setCpfCnpj("");
      setEndereco("");
      setTelefone("");
      setDataAdmissao("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao salvar funcionário. Tente novamente.");
    }
  };

  return (
    <div className="cadastrar-funcionario-bg">
      <form
        className="cadastrarFuncionario-container flex-column"
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
            <label htmlFor="cpfCnpj">CPF/CNPJ</label>
            <input
              type="text"
              id="cpfCnpj"
              placeholder="Insira apenas números"
              maxLength={14}
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ""))}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              placeholder="Insira o endereço"
              maxLength={80}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              placeholder="Insira o telefone"
              maxLength={15}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="dataAdmissao">Data de admissão</label>
            <input
              type="date"
              id="dataAdmissao"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
              required
            />
          </li>
          <Button variant="cadastrar" type="submit">
            Cadastrar funcionário
          </Button>
        </ul>
      </form>
    </div>
  );
};

export default CadastrarFuncionario;
