import React, { useMemo, useState } from "react";
import "./CadastrarParto.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { useCriarParto } from "../../../api/hooks/parto/UsePartos";
import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";
import { createRegistroAuto } from "../../../utils/criarRegistro";

import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import type { PartoRequestDTO } from "../../../api/dtos/parto/PartoRequestDTO";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";

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

interface CadastrarPartoProps {
  onSuccess?: (
    partoId: number,
    qtdFilhotes: number,
    maeId: number,
    paiId: number,
    dataPartoISO: string
  ) => void;
}

const CadastrarParto: React.FC<CadastrarPartoProps> = ({ onSuccess }) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { gestacoes, loading: loadingGestacoes, error: errorGestacoes } = useGestacoes();
  const { criarParto, loading: saving, error: errorSalvar } = useCriarParto();

  const [gestacaoId, setGestacaoId] = useState<string>("");
  const [ovelhaMaeId, setOvelhaMaeId] = useState<string>("");
  const [ovelhaPaiId, setOvelhaPaiId] = useState<string>("");
  const [dataParto, setDataParto] = useState<string>("");
  const [qtdFilhotes, setQtdFilhotes] = useState<number>(1);
  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false);

  const [carneiroPaiNome, setCarneiroPaiNome] = useState<string>("");
  const [ovelhaMaeNome, setOvelhaMaeNome] = useState<string>("");

  const gestacoesById = useMemo(() => {
    const m = new Map<string, GestacaoResponseDTO>();
    (gestacoes ?? []).forEach((r) => m.set(String(r.id), r));
    return m;
  }, [gestacoes]);

  const machos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.MACHO &&
          monthsBetween(o.dataNascimento) >= MIN_MALE_MONTHS
      ),
    [ovinos]
  );

  const femeas = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.FEMEA &&
          monthsBetween(o.dataNascimento) >= MIN_FEMALE_MONTHS
      ),
    [ovinos]
  );

  const handleSelectGestacao = (id: string) => {
    setGestacaoId(id);

    if (id) {
      const r = gestacoesById.get(id);
      if (r) {
        setOvelhaPaiId(String(r.ovelhaPai?.id ?? ""));
        setOvelhaMaeId(String(r.ovelhaMae?.id ?? ""));
        setCarneiroPaiNome(r.ovelhaPai?.nome || `#${r.ovelhaPai?.id ?? ""}`);
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

    const dto: PartoRequestDTO = {
      gestacaoId: gestacaoId ? Number(gestacaoId) : undefined,
      ovelhaMaeId: Number(ovelhaMaeId),
      ovelhaPaiId: Number(ovelhaPaiId),
      dataParto: dataParto ? new Date(dataParto).toISOString() : "",
    };

    try {
      console.log("DTO enviado:", dto);
      const partoCriado = await criarParto(dto);

      await createRegistroAuto("parto", partoCriado as any, enviarSugestao);

      toast.success("Parto cadastrado com sucesso!");

      onSuccess?.(
        partoCriado.id,
        qtdFilhotes,
        Number(ovelhaMaeId),
        Number(ovelhaPaiId),
        dto.dataParto
      );

      setGestacaoId("");
      setOvelhaPaiId("");
      setOvelhaMaeId("");
      setCarneiroPaiNome("");
      setOvelhaMaeNome("");
      setDataParto("");
      setQtdFilhotes(1);
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar parto.");
    }
  };

  return (
    <div className="cadastrar-parto-bg flex-column">
      <form className="cadastrarParto-container flex-column" onSubmit={handleSubmit}>
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="gestacaoId">Gestação (opcional)</label>
            {loadingGestacoes ? (
              <p>Carregando gestações...</p>
            ) : errorGestacoes ? (
              <p style={{ color: "red" }}>{errorGestacoes}</p>
            ) : (
              <select
                id="gestacaoId"
                value={gestacaoId}
                onChange={(e) => handleSelectGestacao(e.target.value)}
              >
                <option value="">Nenhuma (informar manualmente)</option>
                {(gestacoes ?? []).map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.ovelhaPai?.nome || `#${r.ovelhaPai?.id}`} ×{" "}
                    {r.ovelhaMae?.nome || `#${r.ovelhaMae?.id}`} •{" "}
                    {formatDate(r.dataGestacao)}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaPaiId">Carneiro (pai)</label>
            {gestacaoId ? (
              <input type="text" value={carneiroPaiNome} readOnly disabled />
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
                    {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="ovelhaMaeId">Ovelha (mãe)</label>
            {gestacaoId ? (
              <input type="text" value={ovelhaMaeNome} readOnly disabled />
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
                    {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="dataParto">Data do parto</label>
            <input
              type="datetime-local"
              id="dataParto"
              value={dataParto}
              onChange={(e) => setDataParto(e.target.value)}
              required
            />
          </li>

          <li className="flex-column">
            <label htmlFor="qtdFilhotes">Quantidade de filhotes</label>
            <input
              id="qtdFilhotes"
              type="number"
              min={1}
              value={qtdFilhotes}
              onChange={(e) => setQtdFilhotes(Number(e.target.value))}
            />
          </li>
          <li className="checkbox-sugestao">
            <input
              type="checkbox"
              id="enviarSugestao"
              checked={enviarSugestao}
              onChange={(e) => setEnviarSugestao(e.target.checked)}
            />
            <label htmlFor="enviarSugestao">Enviar como sugestão</label>
          </li>

          <div className="cadastrarParto-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar parto"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarParto;
