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

function formatISODate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

const CadastrarOcorrenciaDoenca: React.FC = () => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { doencas, loading: loadingDoenc, error: errorDoenc } = useDoencas();
  const {
    criarOcorrencia,
    loading: saving,
    error: errorSalvar,
  } = useCriarOcorrenciaDoenca();

  const [doencaId, setDoencaId] = useState<string>("");
  const [ovinoId, setOvinoId] = useState<string>("");
  const [ovinoNome, setOvinoNome] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");

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
      dataInicio: new Date(dataInicio).toISOString(),
      curada: false,
    };

    try {
      console.log("DTO enviado:", dto);
      await criarOcorrencia(dto);
      toast.success("Adoecimento cadastrada com sucesso!");
      setOvinoId("");
      setDoencaId("");
      setDataInicio("");
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
                    {formatISODate(o.dataNascimento)}
                  </option>
                ))}
              </select>
          </li>
          <li className="flex-column">
            <label htmlFor="dataInicio">Data de início</label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
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
