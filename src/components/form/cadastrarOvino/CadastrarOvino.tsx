import React, { useState } from "react";
import "./CadastrarOvino.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { TypeRaca } from "../../../api/enums/typeRaca/TypeRaca";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { TypeGrauPureza } from "../../../api/enums/typeGrauPureza/TypeGrauPureza";
import { TypeStatus } from "../../../api/enums/typeStatus/TypeStatus";
import { OvinoService } from "../../../api/services/ovino/OvinoService";
import { formatEnum } from "../../../utils/formatEnum";

import { useCompras } from "../../../api/hooks/compra/UseCompras";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { OvinoRequestDTO } from "../../../api/dtos/ovino/OvinoRequestDTO";

const CadastrarOvino: React.FC = () => {
  const [step, setStep] = useState(1);
  const [rfid, setRfid] = useState("");
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState<TypeRaca | "">("");
  const [fbb, setFbb] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [grauPureza, setGrauPureza] = useState<TypeGrauPureza | "">("");
  const [sexo, setSexo] = useState<TypeSexo | "">("");
  const [idOvelhaMae, setIdOvelhaMae] = useState("");
  const [idCarneiroPai, setIdCarneiroPai] = useState("");
  const [status, setStatus] = useState<TypeStatus>(TypeStatus.ATIVO);
  const [imagem, setImagem] = useState<File | null>(null);
  const [idParto, setIdParto] = useState("");
  const [idCompra, setIdCompra] = useState("");

  const { compras, loading, error } = useCompras();
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();

const handleNext = () => {
  if (step === 1 && (!idParto && !idCompra && !dataNascimento)) {
    toast.warn("Preencha Data de Nascimento ou selecione o Parto para continuar");
    return;
  }
  if (step === 2 && (!raca || !grauPureza || !sexo)) {
    toast.warn("Preencha Raça, Grau de Pureza e Sexo antes de continuar.");
    return;
  }
  if (step === 3 && (!rfid || !nome)) {
    toast.warn("Preencha RFID e Nome antes de continuar.");
    return;
  }

  setStep((prev) => Math.min(prev + 1, 4));
};


  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rfid || !nome || !raca || !grauPureza || !sexo) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novoOvino: OvinoRequestDTO = {
        rfid: Number(rfid),
        nome,
        raca,
        fbb: fbb,
        dataNascimento: `${dataNascimento}:00`,
        dataCadastro: new Date().toISOString(),
        typeGrauPureza: grauPureza,
        sexo,
        status,
        maeId: idOvelhaMae ? Number(idOvelhaMae) : undefined,
        paiId: idCarneiroPai ? Number(idCarneiroPai) : undefined,
        compraId: idCompra ? Number(idCompra) : undefined,
        partoId: idParto ? Number(idParto) : undefined,
        fotoOvino: imagem ? imagem.name : undefined,
      };

      await OvinoService.salvar(novoOvino);
      toast.success("Ovino cadastrado com sucesso!");

      setRfid("");
      setNome("");
      setRaca("");
      setFbb("");
      setDataNascimento("");
      setGrauPureza("");
      setSexo("");
      setIdOvelhaMae("");
      setIdCarneiroPai("");
      setStatus(TypeStatus.ATIVO);
      setImagem(null);
      setIdParto("");
      setIdCompra("");
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar ovino. Tente novamente.");
    }
  };

  return (
    <div className="cadastrar-ovino-bg flex-column">
      <div className="cadastrarOvino-progress-bar flex">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>4</div>
      </div>

      <form
        className="cadastrarOvino-container flex-column"
        onSubmit={handleSubmit}
      >
        {step === 1 && (
          <ul className="flex-column">
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
              {loading ? (
                <p>Carregando compras...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <select
                  id="idCompra"
                  value={idCompra}
                  onChange={(e) => setIdCompra(e.target.value)}
                >
                  <option value="">Selecione uma compra...</option>
                  {compras.map((compra) => (
                    <option key={compra.id} value={compra.id}>
                      {compra.dataCompra.split("T")[0]} - R$
                      {compra.valor.toFixed(2)}
                    </option>
                  ))}
                </select>
              )}
            </li>
            <li className="flex-column">
              <label htmlFor="dataNascimento">Data de nascimento</label>
              <input
                type="datetime-local"
                id="dataNascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </li>
            <li className="flex-column">
              <label htmlFor="idCarneiroPai">Ovino Pai</label>
              {loadingOvinos ? (
                <p>Carregando ovinos...</p>
              ) : errorOvinos ? (
                <p style={{ color: "red" }}>{errorOvinos}</p>
              ) : (
                <select
                  id="idCarneiroPai"
                  value={idCarneiroPai}
                  onChange={(e) => setIdCarneiroPai(e.target.value)}
                >
                  <option value="">Selecione o pai...</option>
                  {ovinos.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nome} ({formatEnum(o.raca)})
                    </option>
                  ))}
                </select>
              )}
            </li>
            <li className="flex-column">
              <label htmlFor="idOvelhaMae">Ovelha Mãe</label>
              {loadingOvinos ? (
                <p>Carregando ovinos...</p>
              ) : errorOvinos ? (
                <p style={{ color: "red" }}>{errorOvinos}</p>
              ) : (
                <select
                  id="idOvelhaMae"
                  value={idOvelhaMae}
                  onChange={(e) => setIdOvelhaMae(e.target.value)}
                >
                  <option value="">Selecione a mãe...</option>
                  {ovinos.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nome} ({formatEnum(o.raca)})
                    </option>
                  ))}
                </select>
              )}
            </li>
            <Button type="button" variant="cardPrimary" onClick={handleNext}>
              Próximo
            </Button>
          </ul>
        )}
        {step === 2 && (
          <ul className="flex-column">
            <li className="flex-column">
              <label htmlFor="raca">Raça</label>
              <select
                value={raca}
                onChange={(e) => setRaca(e.target.value as TypeRaca)}
              >
                <option value="">Selecione...</option>
                {Object.values(TypeRaca).map((r) => (
                  <option key={r} value={r}>
                    {formatEnum(r)}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex-column">
              <label htmlFor="grauPureza">Grau de pureza</label>
              <select
                value={grauPureza}
                onChange={(e) =>
                  setGrauPureza(e.target.value as TypeGrauPureza)
                }
              >
                <option value="">Selecione...</option>
                {Object.values(TypeGrauPureza).map((g) => (
                  <option key={g} value={g}>
                    {formatEnum(g)}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex-column">
              <label htmlFor="sexo">Sexo</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as TypeSexo)}
              >
                <option value="">Selecione...</option>
                {Object.values(TypeSexo).map((s) => (
                  <option key={s} value={s}>
                    {formatEnum(s)}
                  </option>
                ))}
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
              <label htmlFor="rfid">RFID</label>
              <input
                type="number"
                id="rfid"
                placeholder="Apenas números"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
              />
            </li>
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
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                placeholder="Apenas letras e números"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
                }
              />
            </li>
            <li className="flex-column">
              <label htmlFor="status">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TypeStatus)}
              >
                {Object.values(TypeStatus).map((st) => (
                  <option key={st} value={st}>
                    {formatEnum(st)}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex-column">
              <label htmlFor="imagem">Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagem(e.target.files[0]);
                  }
                }}
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
              <Button type="button" variant="cardPrimary" onClick={handleNext}>
                Próximo
              </Button>
            </div>
          </ul>
        )}

        {step === 4 && (
          <ul className="flex-column">
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
