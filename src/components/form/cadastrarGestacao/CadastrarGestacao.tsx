import React, { useMemo, useState } from "react";
import "./CadastrarGestacao.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useReproducoes } from "../../../api/hooks/reproducao/UseReproducoes";
import {
  useCriarGestacao,
  useGestacoes,
} from "../../../api/hooks/gestacao/UseGestacoes";
import { usePartos } from "../../../api/hooks/parto/UsePartos";
import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";

import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import type { GestacaoRequestDTO } from "../../../api/dtos/gestacao/GestacaoRequestDTO";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { useNavigate } from "react-router-dom";
import { DateToIsoString } from "../../../utils/dateToIsoString";

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
  const {
    reproducoes,
    loading: loadingRepros,
    error: errorRepros,
  } = useReproducoes();
  const {
    criarGestacao,
    loading: saving,
    error: errorSalvar,
  } = useCriarGestacao();
  const { gestacoes } = useGestacoes();
  const { partos } = usePartos();

  const [reproducaoId, setReproducaoId] = useState<string>("");
  const [ovelhaMaeId, setOvelhaMaeId] = useState<string>("");
  const [ovelhaPaiId, setOvelhaPaiId] = useState<string>("");
  const [dataGestacao, setDataGestacao] = useState<string>("");
  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false);

  const navigate = useNavigate();
 const idFuncionario = Number(localStorage.getItem("funcionarioId")) || 1;
  const reproducoesById = useMemo(() => {
    const map = new Map<string, ReproducaoResponseDTO>();
    (reproducoes ?? []).forEach((r) => map.set(String(r.id), r));
    return map;
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

  const femeas = useMemo(() => {
    const isOvelhaGestando = (ovelhaId: number): boolean => {
      const gestacaoAtiva = (gestacoes ?? []).some((g) => {
        const mae = g.ovelhaMae?.id;
        const partoExiste = (partos ?? []).some((p) => p.gestacao?.id === g.id);
        return mae === ovelhaId && !partoExiste;
      });
      return gestacaoAtiva;
    };

    return (ovinos ?? []).filter(
      (o) =>
        o.sexo === TypeSexo.FEMEA &&
        monthsBetween(o.dataNascimento) >= MIN_FEMALE_MONTHS &&
        !isOvelhaGestando(o.id)
    );
  }, [ovinos, gestacoes, partos]);

  const handleSelectReproducao = (id: string) => {
    setReproducaoId(id);

    if (!id) {
      setOvelhaPaiId("");
      setOvelhaMaeId("");
      return;
    }

    const r = reproducoesById.get(id);
    if (r) {
      setOvelhaPaiId(r.carneiro?.id ? String(r.carneiro.id) : "");
      setOvelhaMaeId(r.ovelha?.id ? String(r.ovelha.id) : "");
    }
  };

  const nomeOvino = (id: string | number | undefined): string => {
    const o = ovinos.find((ov) => ov.id === Number(id));
    return o ? `${o.nome ?? `#${o.id}`} • ${formatEnum(o.raca)}` : "—";
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
      dataGestacao: dataGestacao ? DateToIsoString(dataGestacao) : "",
      idFuncionario: idFuncionario,
      isSugestao: enviarSugestao,
    };

    try {
      const novaGestacao = await criarGestacao(dto);

      toast.success(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span>Gestação criada com sucesso!</span>
          <Button
            type="button"
            variant="toast"
            onClick={() => {
              const destino = `/dashboard/ovinos/gestacoes/gerenciar?searchId=${novaGestacao.id}`;
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
      setReproducaoId("");
      setOvelhaPaiId("");
      setOvelhaMaeId("");
      setDataGestacao("");
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar gestação.");
    }
  };

  return (
    <div className="cadastrar-gestacao-bg flex-column">
      <form
        className="cadastrarGestacao-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="reproducaoId">Reprodução (opcional)</label>
            {loadingRepros ? (
              <p>Carregando reproduções...</p>
            ) : errorRepros ? (
              <p style={{ color: "red" }}>{errorRepros}</p>
            ) : (
              <select
                id="reproducaoId"
                value={reproducaoId}
                onChange={(e) => handleSelectReproducao(e.target.value)}
              >
                <option value="">Nenhuma (informar manualmente)</option>
                {(reproducoes ?? []).map((r) => {
                  const carneiroNome = r.carneiro?.nome ?? "—";
                  const ovelhaNome = r.ovelha?.nome ?? "—";

                  return (
                    <option key={r.id} value={String(r.id)}>
                      {formatEnum(r.enumReproducao)} • {carneiroNome} ×{" "}
                      {ovelhaNome} • {formatDate(r.dataReproducao)}
                    </option>
                  );
                })}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaPaiId">Carneiro (pai)</label>
            {reproducaoId ? (
              <input
                type="text"
                value={nomeOvino(ovelhaPaiId)}
                readOnly
                disabled
              />
            ) : loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select
                id="ovelhaPaiId"
                value={ovelhaPaiId}
                onChange={(e) => setOvelhaPaiId(e.target.value)}
                required
              >
                <option value="">Selecione o carneiro...</option>
                {machos.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} •{" "}
                    {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaMaeId">Ovelha (mãe)</label>
            {reproducaoId ? (
              <input
                type="text"
                value={nomeOvino(ovelhaMaeId)}
                readOnly
                disabled
              />
            ) : loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select
                id="ovelhaMaeId"
                value={ovelhaMaeId}
                onChange={(e) => setOvelhaMaeId(e.target.value)}
                required
              >
                <option value="">Selecione a ovelha...</option>
                {femeas.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} •{" "}
                    {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="dataGestacao">Data de início</label>
            <input
              type="datetime-local"
              id="dataGestacao"
              value={dataGestacao}
              onChange={(e) => setDataGestacao(e.target.value)}
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
            <label htmlFor="enviarSugestao">Solicitar verificação</label>
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
