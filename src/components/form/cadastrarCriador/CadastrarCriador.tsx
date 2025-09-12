import React, { use, useState } from "react";
import "./CadastrarCriador.css";
import CriadorService from "../../../api/services/criador/CriadorService";
import Button from "../../common/buttons/Button";

const CadastrarCriador: React.FC = () => {
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const criadorData = {
        cpfCnpj: cpfCnpj.replace(/\D/g, ""),
        endereco,
        nome,
        telefone,
      };

      console.log("Enviando para API:", criadorData);

      const novoCriador = await CriadorService.create(criadorData);

      alert(`✅ Criador cadastrado com sucesso! ID: ${novoCriador.id}`);

      setCpfCnpj("");
      setEndereco("");
      setNome("");
      setTelefone("");
    } catch (error) {
      console.error("Erro ao cadastrar criador:", error);
      alert(
        "❌ Erro ao cadastrar criador. Verifique os dados e tente novamente."
      );
    }
  };
  return (
    <form
      className="cadastrarCriador-container flex-column"
      onSubmit={handleSubmit}
    >
      <ul className="flex-column">
        <li className="flex-column">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Insira o nome"
            maxLength={50}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </li>
        <li className="flex-column">
          <label htmlFor="cpf/cnpj">CPF/CNPJ</label>
          <input
            type="text"
            id="cpfCnpj"
            name="cpfCnpj"
            placeholder="Insira o CPF/CNPJ(apenas números)"
            maxLength={14}
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ""))}
            required
          />
        </li>
        <li className="flex-column">
          <label htmlFor="cpf/cnpj">Endereço</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
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
            name="telefone"
            placeholder="Insira o telefone"
            maxLength={80}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </li>
        <Button variant="pagination" type="submit">
          Cadastrar criador
        </Button>
      </ul>
    </form>
  );
};

export default CadastrarCriador;
