import React, { useMemo, useState } from "react";
import "./CadastrarOcorrenciaDoenca.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useCriarOcorrenciaDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import { formatEnum } from "../../../utils/formatEnum";

import type { OcorrenciaDoencaRequestDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaRequestDTO";
import type { DoencaResponseDTO } from "../../../api/dtos/doenca/DoencaResponseDTO";
import { useDoencas } from "../../../api/hooks/doenca/UseDoencas";
import { formatDate } from "../../../utils/formatDate";
import { createRegistroAuto } from "../../../utils/criarRegistro";
import { useNavigate } from "react-router-dom";

import { DateToIsoString } from "../../../utils/dateToIsoString";

const CadastrarOcorrenciaDoenca: React.FC = () => {
  const { ovinos} = useOvinos();
  const { doencas, loading: loadingDoenc, error: errorDoenc } = useDoencas();
  const {
    criarOcorrencia,
    loading: saving,
    error: errorSalvar,
  } = useCriarOcorrenciaDoenca();

  const [doencaId, setDoencaId] = useState<string>("");
  const [ovinoId, setOvinoId] = useState<string>("");
  const [, setOvinoNome] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");

    const navigate = useNavigate();

  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false);

  const doencasById = useMemo(() => {
    const m = new Map<string, DoencaResponseDTO>();
    (doencas ?? []).forEach((r) => m.set(String(r.id), r));
    return m;
  }, [doencas]);

  const handleSelectDoenca = (id: string) => {
    setDoencaId(id);
    if (id) {
      const r = doencasById.get(id);
      if (r) {
        setOvinoId(String(r.id));
        setOvinoNome(r.nome);
      }
    } else {
      setOvinoId("");
      setOvinoNome("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doencaId || !ovinoId) {
      toast.warn("Selecione a doença e o ovino.");
      return;
    }

    const dto: OcorrenciaDoencaRequestDTO = {
      ovinoId: Number(ovinoId),
      doencaId: Number(doencaId),
      dataInicio: DateToIsoString((dataInicio)),
      curado: false,
    };

    console.log("OcorrenciaDoenca DTO:", dto);

    try {
      const novaOcorrencia = await criarOcorrencia(dto);

      console.log("Nova Ocorrencia Doenca criada:", novaOcorrencia);

      await createRegistroAuto("ocorrenciaDoenca", novaOcorrencia, enviarSugestao);

      toast.success(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span>Adoecimento criado com sucesso!</span>
          <Button
            type="button"
            variant="toast"
            onClick={() => {
              const destino = `/dashboard/ovinos/doencas/doentes?searchId=${novaOcorrencia.id}`
              navigate(destino);
              toast.dismiss();
            }}
          >
            Visualizar agora
          </Button>
        </div>,
        {
          autoClose: 6000,
          style: {
            width: "440px",
          },
        }
      );
      setOvinoId("");
      setDoencaId("");
      setDataInicio("");
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar adoecimento.");
    }
  };

  return (
    <div className="cadastrar-ocorrenciaDoenca-bg flex-column">
      <form
        className="cadastrarOcorrenciaDoenca-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="doencaId">Doença</label>
            {loadingDoenc ? (
              <p>Carregando reproduções...</p>
            ) : errorDoenc ? (
              <p style={{ color: "red" }}>{errorDoenc}</p>
            ) : (
              <select
                id="doencaId"
                value={doencaId}
                onChange={(e) => handleSelectDoenca(e.target.value)}
              >
                <option value="">Selecione uma doença</option>
                {(doencas ?? []).map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.nome}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovinoId">Ovino</label>
            <select
              id="ovinoId"
              value={ovinoId}
              onChange={(e) => setOvinoId(e.target.value)}
              required
            >
              <option value="">Selecione o ovino...</option>
              {ovinos.map((o) => (
                <option key={o.id} value={String(o.id)}>
                  {o.nome} • {formatEnum(o.raca)} •{" "}
                  {o.dataNascimento ? formatDate(o.dataNascimento) : "-"}
                </option>
              ))}
            </select>
          </li>

          <li className="flex-column">
            <label htmlFor="dataInicio">Data de início</label>
            <input
              type="datetime-local"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </li>

          <li className="checkbox-sugestao">
            <input
              type="checkbox"
              id="enviarSugestao"
              checked={enviarSugestao}
              onChange={(e) => setEnviarSugestao(e.target.checked)}
            />
            <label htmlFor="enviarSugestao">Enviar como solicitação</label>
          </li>

          <div className="cadastrarOcorrenciaDoenca-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar adoecimento"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarOcorrenciaDoenca;
