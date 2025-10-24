import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarOcorrenciaDoencas.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";
import ActionButtons from "../../common/buttons/ActionButtons";
import OcorrenciaDoencaDetalhes from "./OcorrenciaDoencaDetalhes";

import { useOcorrenciasDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";
import { formatDate } from "../../../utils/formatDate";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

const GerenciarOcorrenciasDoenca: React.FC = () => {
  const { ocorrencias, loading, error } = useOcorrenciasDoenca();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<OcorrenciaDoencaResponseDTO | null>(
    null
  );

  const items = useMemo<OcorrenciaDoencaResponseDTO[]>(
    () => ocorrencias ?? [],
    [ocorrencias]
  );

  const filtered: OcorrenciaDoencaResponseDTO[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return items
      .filter((o) => {
        if (df || dt) {
          const d = new Date(o.dataInicio ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          o.ovino?.nome ?? "",
          o.doenca?.nome ?? "",
          o.doenca?.descricao ?? "",
          String(o.ovino?.rfid ?? ""),
          formatDate(o.dataInicio, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataInicio ?? "").getTime();
        const db = new Date(b.dataInicio ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [items, q, dateFrom, dateTo]);

  const totalPages = viewAll
    ? 1
    : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = viewAll
    ? filtered
    : filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setViewAll(false);
  };

  if (loading) return <p>Carregando ocorrências de doenças…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ocorrencia-page">
      <div className="ocorrencia-header flex">
        <h2>Ocorrências de Doenças</h2>
        <Link to="/dashboard/ovinos/ocorrencias-doenca/cadastrar">
          <Button type="button" variant="cardPrimary">
            Nova Ocorrência
          </Button>
        </Link>
      </div>

      <FilterBar
        q={q}
        setQ={setQ}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        clearFilters={clearFilters}
        setPage={setPage}
        setViewAll={setViewAll}
        placeholder="Buscar por ovino, doença, descrição ou RFID..."
      />

      <div className="ocorrencia-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="ocorrencia-empty">
          Nenhuma ocorrência de doença encontrada.
        </div>
      ) : (
        <div className="ocorrencia-list">
          {pageItems.map((o) => (
            <div key={o.id} className="ocorrencia-card">
              <div>
                <div className="ocorrencia-col-title">Ovino</div>
                <div className="ocorrencia-col-main">
                  {o.ovino?.nome ?? "—"}
                </div>
                <div className="ocorrencia-meta">
                  FBB: {o.ovino?.fbb ?? "—"} • RFID: {o.ovino?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="ocorrencia-col-title">Doença</div>
                <div className="ocorrencia-meta">
                  <span>
                    <strong>Nome:</strong> {o.doenca?.nome ?? "—"}
                  </span>
                  <br />
                  <span>
                    <strong>Data de Início:</strong>{" "}
                    {formatDate(o.dataInicio, true)}
                  </span>
                  <br />
                  {o.dataFinal ? (
                    <span>
                      <strong>Data Final:</strong>{" "}
                      {formatDate(o.dataFinal, true)}
                    </span>
                  ) : (
                    <span>
                      <strong>Curado:</strong> {o.curado ? "Sim" : "Não"}
                    </span>
                  )}
                  <br />
                </div>
              </div>
              <div className="ocorrencia-actions flex">
                <Button variant="cardSecondary" onClick={() => setSelected(o)}>
                  Ver mais
                </Button>
                <ActionButtons
                  onEdit={() => setSelected(o)}
                  showRemove={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="ocorrencia-pagination">
          <PaginationMenu
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            showViewAll={filtered.length > PAGE_SIZE}
            onViewAll={() => {
              setViewAll(true);
              setPage(1);
            }}
          />
        </div>
      )}

      {viewAll && filtered.length > PAGE_SIZE && (
        <div className="ocorrencia-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selected && (
        <OcorrenciaDoencaDetalhes
          ocorrencia={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default GerenciarOcorrenciasDoenca;
