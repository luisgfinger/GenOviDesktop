import React, { use, useState } from "react";
import "./CadastrarFuncionario.css";
import Button from "../../common/buttons/Button";

const CadastrarFuncionario: React.FC = () => {
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    
  };


  return (
    <div className="cadastrar-funcionario-bg">
    <form
      className="cadastrarFuncionario-container flex-column"
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
        <Button variant="cadastrar" type="submit">
          Cadastrar funcionario
        </Button>
      </ul>
    </form>
    </div>
  );
};

export default CadastrarFuncionario;
