import React, { useState } from "react";
import "./CadastrarOvino.css";
import Button from "../../common/buttons/Button";

const TypeGrauPureza = {
  PURO_ORIGEM: "Puro de origem",
  PURO_POR_CRUZA: "Puro por cruza",
  CRUZADO_CONTROLADO: "Cruzado controlado",
  CRUZADO_INDETERMINADO: "Cruzado indeterminado",
};

const TypeStatus = {
  ATIVO: "Ativo",
  VENDIDO: "Vendido",
  DESATIVADO: "Desativado",
  MORTO: "Morto",
};

const CadastrarOvino: React.FC = () => {
  const [step, setStep] = useState(1);
  const [rfid, setRfid] = useState("");
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [fbb, setFbb] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [grauPureza, setGrauPureza] = useState("");
  const [sexo, setSexo] = useState("");
  const [idOvelhaMae, setIdOvelhaMae] = useState("");
  const [idCarneiroPai, setIdCarneiroPai] = useState("");
  const [status, setStatus] = useState("ATIVO");
  const [imagem, setImagem] = useState<File | null>(null);
  const [idParto, setIdParto] = useState("");
  const [idCompra, setIdCompra] = useState("");

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      rfid,
      nome,
      raca,
      fbb,
      dataNascimento,
      grauPureza,
      sexo,
      idOvelhaMae,
      idCarneiroPai,
      status,
      imagem,
      idParto,
      idCompra,
    });
  };

  return (
    <div className="cadastrar-ovino-bg flex-column">
      <div className="cadastrarOvino-progress-bar flex">
        <div className={`step step1 ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`step step3 ${step >= 3 ? "active" : ""}`}>3</div>
      </div>
      <form
        className="cadastrarOvino-container flex-column"
        onSubmit={handleSubmit}
      >
        {step === 1 && (
          <ul className="flex-column">
            <li className="flex-column">
              <label htmlFor="rfid">RFID</label>
              <input
                type="number"
                id="rfid"
                placeholder="Apenas números"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                required
              />
            </li>
            <li className="flex-column">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                placeholder="Apenas letras e números"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
                }
                required
              />
            </li>
            <li className="flex-column">
              <label htmlFor="raca">Raça</label>
              <input
                type="text"
                id="raca"
                placeholder="Insira a raça"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                required
              />
            </li>
            <Button type="button" variant="cardPrimary" onClick={handleNext}>
              Próximo
            </Button>
          </ul>
        )}

        {step === 2 && (
          <ul className="flex-column">
            <li className="flex-column">
              <label htmlFor="fbb">FBB</label>
              <input
                type="text"
                id="fbb"
                placeholder="O-123456"
                value={fbb}
                onChange={(e) =>
                  setFbb(`O-${e.target.value.replace(/\D/g, "")}`)
                }
              />
            </li>
            <li className="flex-column">
              <label htmlFor="dataNascimento">Data de nascimento</label>
              <input
                type="datetime-local"
                id="dataNascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </li>
            <li className="flex-column">
              <label htmlFor="grauPureza">Grau de pureza</label>
              <select
                value={grauPureza}
                onChange={(e) => setGrauPureza(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {Object.entries(TypeGrauPureza).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex-column">
              <label htmlFor="sexo">Sexo</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </li>
            <div className="cadastrarOvino-form-navigation flex">
              <Button
                type="button"
                variant="cardSecondary"
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button type="button" variant="cardPrimary" onClick={handleNext}>
                Próximo
              </Button>
            </div>
          </ul>
        )}

        {step === 3 && (
          <ul className="flex-column">
            <li className="flex-column">
              <label htmlFor="status">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                {Object.entries(TypeStatus).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex-column">
              <label htmlFor="imagem">Insira a imagem</label>
              <div className="file-input flex">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagem(e.target.files[0]);
                  }
                }}
              />
              </div>
            </li>
            <li className="flex-column">
              <label htmlFor="idParto">Parto</label>
              <input
                type="text"
                value={idParto}
                onChange={(e) => setIdParto(e.target.value)}
              />
            </li>
            <li className="flex-column">
              <label htmlFor="idCompra">Compra</label>
              <input
                type="text"
                value={idCompra}
                onChange={(e) => setIdCompra(e.target.value)}
              />
            </li>
            <div className="cadastrarOvino-form-navigation flex">
              <Button
                type="button"
                variant="cardSecondary"
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button type="submit" variant="cardPrimary">
                Cadastrar
              </Button>
            </div>
          </ul>
        )}
      </form>
    </div>
  );
};

export default CadastrarOvino;
