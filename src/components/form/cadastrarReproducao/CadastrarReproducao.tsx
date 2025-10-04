import React, { useMemo, useState } from "react";
import "./CadastrarReproducao.css"; 
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { TypeStatus } from "../../../api/enums/typeStatus/TypeStatus";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useCriarReproducao } from "../../../api/hooks/reproducao/UseReproducoes";
import type { ReproducaoRequestDTO } from "../../../api/dtos/reproducao/ReproducaoRequestDTO";

type Props = {
  minAgeMonths?: number;
};

function formatISODate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function diffMonthsFromNow(iso?: string): number {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  const years = now.getFullYear() - d.getFullYear();
  const months = years * 12 + (now.getMonth() - d.getMonth());
  const adjust = now.getDate() >= d.getDate() ? 0 : -1;
  return months + adjust;
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const CadastrarReproducao: React.FC<Props> = ({ minAgeMonths = 12 }) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const {
    criarReproducao,
    loading: saving,
    error: errorSalvar,
  } = useCriarReproducao();

  const [carneiroId, setCarneiroId] = useState<string>("");
  const [femeasIds, setFemeasIds] = useState<string[]>([]);
  const [typeReproducao, setTypeReproducao] = useState<TypeReproducao | "">("");
  const [dataReproducao, setDataReproducao] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const adultosAtivos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.status === TypeStatus.ATIVO &&
          diffMonthsFromNow(o.dataNascimento) >= minAgeMonths
      ),
    [ovinos, minAgeMonths]
  );

  const machosAdultos = useMemo(
    () => adultosAtivos.filter((o) => o.sexo === TypeSexo.MACHO),
    [adultosAtivos]
  );

  const femeasAdultas = useMemo(
    () =>
      adultosAtivos
        .filter((o) => o.sexo === TypeSexo.FEMEA && String(o.id) !== carneiroId)
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [adultosAtivos, carneiroId]
  );

  const filteredFemeas = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return femeasAdultas;
    return femeasAdultas.filter((o) => {
      const nome = normalize(o.nome ?? "");
      const fbb = normalize(o.fbb ?? "");
      const rfid = String(o.rfid ?? "");
      const raca = normalize(formatEnum(o.raca));
      const data = normalize(formatISODate(o.dataNascimento));
      return (
        nome.includes(q) ||
        fbb.includes(q) ||
        rfid.includes(q) ||
        raca.includes(q) ||
        data.includes(q)
      );
    });
  }, [query, femeasAdultas]);

  const handleToggleFemea = (id: string) => {
    setFemeasIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const allIds = filteredFemeas.map((o) => String(o.id));
    setFemeasIds(allIds);
  };

  const handleClearSelection = () => setFemeasIds([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !carneiroId ||
      femeasIds.length === 0 ||
      !typeReproducao ||
      !dataReproducao
    ) {
      toast.warn(
        "Preencha macho, pelo menos uma fêmea, tipo e data da reprodução."
      );
      return;
    }

    const lotes: ReproducaoRequestDTO[] = femeasIds.map((ovelhaId) => ({
      carneiroId: Number(carneiroId),
      ovelhaId: Number(ovelhaId),
      typeReproducao: typeReproducao as TypeReproducao,
      dataReproducao: `${dataReproducao}:00`,
      observacoes: observacoes || undefined,
    }));

    try {
      const results = await Promise.allSettled(
        lotes.map((dto) => criarReproducao(dto))
      );
      const sucessos = results.filter((r) => r.status === "fulfilled").length;
      const falhas = results.length - sucessos;

      if (sucessos > 0) toast.success(`Reproduções criadas: ${sucessos}`);
      if (falhas > 0) toast.error(`Falhas ao criar: ${falhas}`);

      if (sucessos > 0) {
        setFemeasIds([]);
        setCarneiroId("");
        setTypeReproducao("");
        setDataReproducao("");
        setObservacoes("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar reproduções.");
    }
  };

  return (
    <div className="cadastrar-reproducao-bg flex-column">
      <form
        className="cadastrarReproducao-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="carneiroId">Macho</label>
            {loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select
                id="carneiroId"
                value={carneiroId}
                onChange={(e) => setCarneiroId(e.target.value)}
              >
                <option value="">Selecione o macho adulto...</option>
                {machosAdultos.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome} • {formatEnum(o.raca)} •{" "}
                    {formatISODate(o.dataNascimento)}
                  </option>
                ))}
              </select>
            )}
            <small>
              <span>Machos adultos ativos: {machosAdultos.length}</span>
            </small>
          </li>

          <li className="flex-column">
            <label htmlFor="femeasSearch">Fêmeas</label>
            <div className="reproducao-toolbar flex-column">
              <input
                id="femeasSearch"
                type="text"
                placeholder="Buscar por nome, FBB, RFID, raça ou data…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="flex">
                <Button
                  type="button"
                  variant="cardSecondary"
                  onClick={handleSelectAllFiltered}
                  disabled={filteredFemeas.length === 0}
                >
                  Selecionar todas
                </Button>
                <Button
                  type="button"
                  variant="cardSecondary"
                  onClick={handleClearSelection}
                  disabled={femeasIds.length === 0}
                >
                  Limpar
                </Button>
              </span>
            </div>

            {femeasIds.length > 0 && (
              <div className="reproducao-chipbar">
                {femeasIds.map((id) => {
                  const o = femeasAdultas.find((x) => String(x.id) === id);
                  if (!o) return null;
                  return (
                    <span key={id} className="chip">
                      {o.nome}
                      <button
                        type="button"
                        className="chip__close"
                        onClick={() => handleToggleFemea(id)}
                        aria-label={`Remover ${o.nome}`}
                        title="Remover"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="reproducao-list">
              {loadingOvinos ? (
                <p>Carregando ovinos...</p>
              ) : errorOvinos ? (
                <p style={{ color: "red" }}>{errorOvinos}</p>
              ) : filteredFemeas.length === 0 ? (
                <p>Nenhuma fêmea encontrada para o filtro.</p>
              ) : (
                <ul>
                  {filteredFemeas.map((o) => {
                    const idStr = String(o.id);
                    const checked = femeasIds.includes(idStr);
                    return (
                      <li key={o.id} className="reproducao-list-item">
                        <input
                          type="checkbox"
                          id={`femea-${o.id}`}
                          checked={checked}
                          onChange={() => handleToggleFemea(idStr)}
                        />
                        <label
                          htmlFor={`femea-${o.id}`}
                          className="reproducao-list-item__label"
                        >
                          <div className="reproducao-list-item__name">
                            {o.nome}
                          </div>
                          <div className="reproducao-list-item__meta">
                            FBB: {o.fbb ?? "—"} • RFID: {o.rfid ?? "—"} •{" "}
                            {formatEnum(o.raca)} •{" "}
                            {formatISODate(o.dataNascimento)}
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="reproducao-count">
              <span>Selecionadas: {femeasIds.length}</span>
              <span>Filtradas: {filteredFemeas.length}</span>
              <span>Adultas ativas: {femeasAdultas.length}</span>
            </div>
          </li>

          <li className="flex-column">
            <label htmlFor="typeReproducao">Tipo de Reprodução</label>
            <select
              id="typeReproducao"
              value={typeReproducao}
              onChange={(e) =>
                setTypeReproducao(e.target.value as TypeReproducao)
              }
            >
              <option value="">Selecione...</option>
              {Object.values(TypeReproducao).map((t) => (
                <option key={t} value={t}>
                  {formatEnum(t)}
                </option>
              ))}
            </select>
          </li>

          <li className="flex-column">
            <label htmlFor="dataReproducao">Data/Hora da Reprodução</label>
            <input
              type="datetime-local"
              id="dataReproducao"
              value={dataReproducao}
              onChange={(e) => setDataReproducao(e.target.value)}
            />
          </li>
          <li className="flex-column">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Anotações adicionais (opcional)"
              maxLength={255}
            />
          </li>
          <div className="cadastrarReproducao-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar reproduções"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarReproducao;
