import React, { useMemo, useState } from "react";
import "./CadastrarGestacao.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useReproducoes } from "../../../api/hooks/reproducao/UseReproducoes";
import { useCriarGestacao, useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { usePartos } from "../../../api/hooks/parto/UsePartos";
import { formatEnum } from "../../../utils/formatEnum";

import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import type { GestacaoRequestDTO } from "../../../api/dtos/gestacao/GestacaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { formatDate } from "../../../utils/formatDate";

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

const CadastrarGestacao: React.FC = () => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { reproducoes, loading: loadingRepros, error: errorRepros } = useReproducoes();
  const { criarGestacao, loading: saving, error: errorSalvar } = useCriarGestacao();
  const { gestacoes } = useGestacoes();
  const { partos } = usePartos();

  const [reproducaoId, setReproducaoId] = useState<string>("");
  const [ovelhaMaeId, setOvelhaMaeId] = useState<string>("");
  const [ovelhaPaiId, setOvelhaPaiId] = useState<string>("");
  const [dataGestacao, setDataGestacao] = useState<string>("");
  const [carneiroPaiNome, setCarneiroPaiNome] = useState<string>("");
  const [ovelhaMaeNome, setOvelhaMaeNome] = useState<string>("");

  const reproducoesById = useMemo(() => {
    const m = new Map<string, ReproducaoResponseDTO>();
    (reproducoes ?? []).forEach((r) => m.set(String(r.id), r));
    return m;
  }, [reproducoes]);

  const machos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.MACHO &&
          monthsBetween(o.dataNascimento) >= MIN_MALE_MONTHS
      ),
    [ovinos]
  );

  const isOvelhaGestando = (ovelhaId: number): boolean => {
    const gestacaoAtiva = (gestacoes ?? []).some((g) => {
      const mae = g.ovelhaMae?.id;
      const partoExiste = (partos ?? []).some((p) => p.gestacao?.id === g.id);
      return mae === ovelhaId && !partoExiste;
    });
    return gestacaoAtiva;
  };

  const femeas = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.FEMEA &&
          monthsBetween(o.dataNascimento) >= MIN_FEMALE_MONTHS &&
          !isOvelhaGestando(o.id)
      ),
    [ovinos, gestacoes, partos]
  );

  const handleSelectReproducao = (id: string) => {
    setReproducaoId(id);

    if (id) {
      const r = reproducoesById.get(id);
      if (r) {
        setOvelhaPaiId(String(r.carneiroPai?.id ?? ""));
        setOvelhaMaeId(String(r.ovelhaMae?.id ?? ""));
        setCarneiroPaiNome(r.carneiroPai?.nome || `#${r.carneiroPai?.id ?? ""}`);
        setOvelhaMaeNome(r.ovelhaMae?.nome || `#${r.ovelhaMae?.id ?? ""}`);
      }
    } else {
      setOvelhaPaiId("");
      setOvelhaMaeId("");
      setCarneiroPaiNome("");
      setOvelhaMaeNome("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ovelhaMaeId || !ovelhaPaiId) {
      toast.warn("Selecione ovelha e carneiro.");
      return;
    }

    const dto: GestacaoRequestDTO = {
      reproducaoId: reproducaoId ? Number(reproducaoId) : undefined,
      ovelhaMaeId: Number(ovelhaMaeId),
      ovelhaPaiId: Number(ovelhaPaiId),
      dataGestacao: dataGestacao ? new Date(dataGestacao).toISOString() : "",
    };

    try {
      await criarGestacao(dto);
      toast.success("Gestação cadastrada com sucesso!");
      setReproducaoId("");
      setOvelhaPaiId("");
      setOvelhaMaeId("");
      setCarneiroPaiNome("");
      setOvelhaMaeNome("");
      setDataGestacao("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar gestação.");
    }
  };

  return (
    <div className="cadastrar-gestacao-bg flex-column">
      <form className="cadastrarGestacao-container flex-column" onSubmit={handleSubmit}>
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="reproducaoId">Reprodução (opcional)</label>
            {loadingRepros ? (
              <p>Carregando reproduções...</p>
            ) : errorRepros ? (
              <p style={{ color: "red" }}>{errorRepros}</p>
            ) : (
              <select id="reproducaoId" value={reproducaoId} onChange={(e) => handleSelectReproducao(e.target.value)}>
                <option value="">Nenhuma (informar manualmente)</option>
                {(reproducoes ?? []).map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {formatEnum(r.typeReproducao)} • {r.carneiroPai?.nome || `#${r.carneiroPai?.id}`} ×{" "}
                    {r.ovelhaMae?.nome || `#${r.ovelhaMae?.id}`} • {formatDate(r.dataReproducao)}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaPaiId">Carneiro (pai)</label>
            {reproducaoId ? (
              <input type="text" value={carneiroPaiNome} readOnly disabled />
            ) : loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select id="ovelhaPaiId" value={ovelhaPaiId} onChange={(e) => setOvelhaPaiId(e.target.value)} required>
                <option value="">Selecione o carneiro...</option>
                {machos.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaMaeId">Ovelha (mãe)</label>
            {reproducaoId ? (
              <input type="text" value={ovelhaMaeNome} readOnly disabled />
            ) : loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select id="ovelhaMaeId" value={ovelhaMaeId} onChange={(e) => setOvelhaMaeId(e.target.value)} required>
                <option value="">Selecione a ovelha...</option>
                {femeas.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="dataGestacao">Data da Gestação</label>
            <input
              type="date"
              id="dataGestacao"
              value={dataGestacao}
              onChange={(e) => setDataGestacao(e.target.value)}
              required
            />
          </li>

          <div className="cadastrarGestacao-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar gestação"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarGestacao;
