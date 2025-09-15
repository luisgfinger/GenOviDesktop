import React, { useState } from "react";
import "./CadastrarOvino.css";
import FuncionarioAutocomplete from "../funcionarioAutoComplete/FuncionarioAutoComplete";
import OvinoAutocomplete from "../ovinoAutoComplete/OvinoAutoComplete";

import OvinoService from "../../../api/services/ovino/OvinoService";
import Button from "../../common/buttons/Button";

const CadastrarOvino: React.FC = () => {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [criadorId, setCriadorId] = useState<string>("");
  const [fbb, setFbb] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [typeGrauPureza, setTypeGrauPureza] = useState("");
  const [peso, setPeso] = useState("");
  const [ovelhaMaeId, setOvelhaMaeId] = useState<string | null>(null);
  const [carneiroPaiId, setCarneiroPaiId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [comportamento, setComportamento] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ovinoData = {
        nome,
        raca,
        criadorId,
        fbb,
        sexo,
        dataNascimento,
        tempoFazendo: 5,
        typeGrauPureza,
        peso: Number(peso),
        ascendenciaId: 3,
        status,
        comportamento: comportamento ?? "Não informado",
      };

      console.log("Enviando para API:", ovinoData);

      const novoOvino = await OvinoService.create(ovinoData);

      alert(`✅ Ovino criado com sucesso! ID: ${novoOvino.id}`);

      setNome("");
      setRaca("");
      setCriadorId("");
      setFbb("");
      setSexo("");
      setDataNascimento("");
      setTypeGrauPureza("");
      setPeso("");
      setOvelhaMaeId(null);
      setCarneiroPaiId(null);
      setStatus("");
      setComportamento("");
    } catch (error) {
      console.error("Erro ao criar ovino:", error);
      alert("❌ Erro ao criar ovino. Verifique os dados e tente novamente.");
    }
  };

  return (
    <form className="cadastrarOvino-container flex-column" onSubmit={handleSubmit}>
      <div className="cadastrarOvino-line1 flex">
        <ul>
          <li className="cadastrarOvino-imageUpdate flex">
              <h3>Imagem</h3>
          </li>
        </ul>

        <ul className="cadastrarOvino-line1-column1 flex-column">
          <li>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Insira o nome"
              maxLength={25}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor="">Raça</label>
            <input
              type="text"
              placeholder="Insira a raça"
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor="funcionario">Funcionario</label>
            <FuncionarioAutocomplete onSelect={(id) => setCriadorId(id)} />
          </li>
        </ul>

        <ul className="cadastrarOvino-line1-column2 flex-column">
          <li>
            <label htmlFor="fbb">FBB</label>
            <input
              type="text"
              id="fbb"
              name="fbb"
              placeholder="Ex: FBB-12345 ou FBB/2024/001"
              maxLength={20}
              value={fbb}
              onChange={(e) => setFbb(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor="sexo">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione o sexo
              </option>
              <option value="MACHO">Masculino</option>
              <option value="FEMEA">Feminino</option>
            </select>
          </li>
          <li>
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              type="datetime-local"
              id="dataNascimento"
              name="dataNascimento"
              max={new Date().toISOString().slice(0, 16)}
              min="2000-01-01T00:00"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </li>
        </ul>
      </div>

      <div className="cadastrarOvino-line2 flex">
        <ul className="cadastrarOvino-line2-column1 flex-column">
          <li className="flex">
            <span className="flex-column">
              <label htmlFor="grauPureza">Grau de pureza</label>
              <select
                id="grauPureza"
                name="grauPureza"
                value={typeGrauPureza}
                onChange={(e) => setTypeGrauPureza(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione o grau de pureza
                </option>
                <option value="PURO_ORIGEM">Puro de Origem</option>
                <option value="PURO_POR_CRUZA">Puro por Cruza</option>
                <option value="CRUZADO_CONTROLADO">Cruzado Controlado</option>
                <option value="CRUZADO_INDETERMINADO">Cruzado Indeterminado</option>
              </select>
            </span>
            <span className="flex-column">
              <label htmlFor="peso">Peso (gramas)</label>
              <input
                type="number"
                id="peso"
                name="peso"
                placeholder="Ex: 3500, 65000"
                min={100}
                max={200000}
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                required
              />
            </span>
          </li>

          <li className="flex-column">
            <label htmlFor="">Ovelha mãe</label>
            <OvinoAutocomplete type="femea" onSelect={(id) => setOvelhaMaeId(id)} />
          </li>
        </ul>

        <ul className="cadastrarOvinoline2-column2 flex-column">
          <li className="flex-column">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione o status
              </option>
              <option value="ATIVO">Ativo</option>
              <option value="VENDIDO">Vendido</option>
              <option value="DESATIVADO">Desativado</option>
              <option value="MORTO">Morto</option>
            </select>
          </li>
          <li className="flex-column">
            <label htmlFor="">Carneiro pai</label>
            <OvinoAutocomplete type="macho" onSelect={(id) => setCarneiroPaiId(id)} />
          </li>
        </ul>
      </div>

      <span className="cadastrarOvino-line3 flex-column">
        <label htmlFor="">Comportamento</label>
        <input
          type="text"
          placeholder="Insira o comportamento"
          value={comportamento}
          onChange={(e) => setComportamento(e.target.value)}
        />
      </span>

      <Button variant="pagination" type="submit">
        Criar ovino
      </Button>
    </form>
  );
};

export default CadastrarOvino;
