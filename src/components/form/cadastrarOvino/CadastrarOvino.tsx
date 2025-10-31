import React, { useEffect, useMemo, useState } from "react";
import "./CadastrarOvino.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { TypeRaca } from "../../../api/enums/typeRaca/TypeRaca";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { TypeGrauPureza } from "../../../api/enums/typeGrauPureza/TypeGrauPureza";
import { TypeStatus } from "../../../api/enums/typeStatus/TypeStatus";
import { formatEnum } from "../../../utils/formatEnum";

import { useCompras } from "../../../api/hooks/compra/UseCompras";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useSalvarOvino } from "../../../api/hooks/ovino/UseOvinos";
import { usePartos } from "../../../api/hooks/parto/UsePartos";
import { PartoService } from "../../../api/services/parto/PartoService";

import type { OvinoRequestDTO } from "../../../api/dtos/ovino/OvinoRequestDTO";

function monthsBetween(iso?: string): number {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;

  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());

  if (now.getDate() < d.getDate()) months--;
  return Math.max(0, months);
}

const MIN_MALE_MONTHS = 7;
const MIN_FEMALE_MONTHS = 8;

interface CadastrarOvinoProps {
  partoId?: number;
  maeId?: number;
  paiId?: number;
  compraId?: number;
  dataNascimento?: string;
  onSuccess?: () => void;
}

const CadastrarOvino: React.FC<CadastrarOvinoProps> = ({
  partoId,
  maeId,
  paiId,
  compraId,
  dataNascimento,
  onSuccess,
}) => {
  const toLocalInput = (iso?: string) => (iso ? iso.substring(0, 16) : "");

  const [step, setStep] = useState(1);
  const [rfid, setRfid] = useState("");
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState<TypeRaca | "">("");
  const [fbb, setFbb] = useState("");
  const [dataNasc, setDataNasc] = useState(toLocalInput(dataNascimento));
  const [grauPureza, setGrauPureza] = useState<TypeGrauPureza | "">("");
  const [sexo, setSexo] = useState<TypeSexo | "">("");
  const [idOvelhaMae, setIdOvelhaMae] = useState(maeId ? String(maeId) : "");
  const [idCarneiroPai, setIdCarneiroPai] = useState(
    paiId ? String(paiId) : ""
  );
  const [status, setStatus] = useState<TypeStatus>(TypeStatus.ATIVO);
  const [imagem, setImagem] = useState<File | null>(null);
  const [idParto, setIdParto] = useState(partoId ? String(partoId) : "");
  const [idCompra, setIdCompra] = useState(compraId ? String(compraId) : "");

  const { compras, loading, error } = useCompras();
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { salvar, loading: saving, error: errorSalvar } = useSalvarOvino();
  const { partos, loading: loadingPartos, error: errorPartos } = usePartos();

  const machos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.MACHO &&
          o.status === TypeStatus.ATIVO &&
          monthsBetween(o.dataNascimento) >= MIN_MALE_MONTHS
      ),
    [ovinos]
  );

  const femeas = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.FEMEA &&
          o.status === TypeStatus.ATIVO &&
          monthsBetween(o.dataNascimento) >= MIN_FEMALE_MONTHS
      ),
    [ovinos]
  );

  const racasFiltradas = useMemo(() => {
    const pai = ovinos?.find((o) => o.id === Number(idCarneiroPai));
    const mae = ovinos?.find((o) => o.id === Number(idOvelhaMae));

    if (pai?.raca && mae?.raca) {
      return pai.raca === mae.raca ? [pai.raca] : [pai.raca, mae.raca];
    }

    if (pai?.raca) return [pai.raca];
    if (mae?.raca) return [mae.raca];

    return Object.values(TypeRaca);
  }, [ovinos, idCarneiroPai, idOvelhaMae]);

  useEffect(() => {
    if (raca && !racasFiltradas.includes(raca)) {
      setRaca("");
    }
  }, [racasFiltradas, raca]);

  const handleSelectParto = async (partoId: string) => {
    setIdParto(partoId);

    if (!partoId) {
      setDataNasc("");
      setIdOvelhaMae("");
      setIdCarneiroPai("");
      return;
    }

    try {
      const parto = await PartoService.buscarPorId(Number(partoId));

      if (parto.dataParto) {
        setDataNasc(parto.dataParto.substring(0, 16));
      }
      if (parto.ovinoMae) {
        setIdOvelhaMae(String(parto.ovinoMae.id));
      }
      if (parto.ovinoPai) {
        setIdCarneiroPai(String(parto.ovinoPai.id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar dados do parto.");
    }
  };

  const handleNext = () => {
    if (step === 1 && !idParto && !idCompra && !dataNasc) {
      toast.warn(
        "Preencha Data de Nascimento ou selecione Parto/Compra para continuar."
      );
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
        fbb,
        dataNascimento: dataNasc ? `${dataNasc}:00` : undefined,
        dataCadastro: new Date().toISOString(),
        grauPureza: grauPureza,
        sexo,
        status,
        maeId: idOvelhaMae ? Number(idOvelhaMae) : undefined,
        paiId: idCarneiroPai ? Number(idCarneiroPai) : undefined,
        compra: compraId ? compraId : idCompra ? Number(idCompra) : undefined,
        parto: partoId ? partoId : idParto ? Number(idParto) : undefined,
        fotoOvino: imagem?.name,
      };

      await salvar(novoOvino);
      toast.success("Ovino cadastrado com sucesso!");
      onSuccess?.();

      setRfid("");
      setNome("");
      setRaca("");
      setFbb("");
      setDataNasc(toLocalInput(dataNascimento));
      setGrauPureza("");
      setSexo("");
      setStatus(TypeStatus.ATIVO);
      setImagem(null);
      if (!compraId) setIdCompra("");
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
              {loadingPartos ? (
                <p>Carregando partos...</p>
              ) : errorPartos ? (
                <p style={{ color: "red" }}>{errorPartos}</p>
              ) : (
                <select
                  id="idParto"
                  value={idParto}
                  onChange={(e) => handleSelectParto(e.target.value)}
                  disabled={!!partoId}
                >
                  <option value="">Selecione um parto...</option>
                  {partos.map((parto) => (
                    <option key={parto.id} value={parto.id}>
                      {parto.dataParto?.split("T")[0]} - Mãe:{" "}
                      {parto.ovinoMae?.nome ?? "?"} | Pai:{" "}
                      {parto.ovinoPai?.nome ?? "?"}
                    </option>
                  ))}
                </select>
              )}
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
                  disabled={!!idParto || !!compraId}
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
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                disabled={!!idParto}
              />
            </li>

            <li className="flex-column">
              <label htmlFor="idCarneiroPai">Ovino Pai</label>
              <select
                id="idCarneiroPai"
                value={idCarneiroPai}
                onChange={(e) => setIdCarneiroPai(e.target.value)}
                disabled={!!idParto}
              >
                <option value="">Selecione o pai...</option>
                {machos.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome} ({formatEnum(o.raca)})
                  </option>
                ))}
              </select>
            </li>

            <li className="flex-column">
              <label htmlFor="idOvelhaMae">Ovelha Mãe</label>
              <select
                id="idOvelhaMae"
                value={idOvelhaMae}
                onChange={(e) => setIdOvelhaMae(e.target.value)}
                disabled={!!idParto}
              >
                <option value="">Selecione a mãe...</option>
                {femeas.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome} ({formatEnum(o.raca)})
                  </option>
                ))}
              </select>
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
                id="raca"
                value={raca}
                onChange={(e) => setRaca(e.target.value as TypeRaca)}
              >
                <option value="">Selecione...</option>
                {racasFiltradas.map((r) => (
                  <option key={r} value={r}>
                    {formatEnum(r)}
                  </option>
                ))}
              </select>
            </li>

            <li className="flex-column">
              <label htmlFor="grauPureza">Grau de pureza</label>
              <select
                id="grauPureza"
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
                id="sexo"
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
            <li className="flex-column">
              <label htmlFor="status">Status</label>
              <select
                id="status"
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
              <div className="file-input flex">
                <input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagem(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </li>

            <div className="cadastrarOvino-form-navigation flex">
              <Button
                type="button"
                variant="cardSecondary"
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button type="submit" variant="cardPrimary" disabled={saving}>
                {saving ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>

            {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
          </ul>
        )}
      </form>
    </div>
  );
};

export default CadastrarOvino;
