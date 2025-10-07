import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarOcorrenciaDoencas.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";

import { useOcorrenciasDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";

function formatISODateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.toLocaleDateString();
  const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dia} ${hora}`;
}

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

const GerenciarOcorrenciaDoencas: React.FC = () => {
  const { ocorrencias, loading, error } = useOcorrenciasDoenca();

  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("TODOS");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const items = useMemo<OcorrenciaDoencaResponseDTO[]>(() => ocorrencias ?? [], [ocorrencias]);

  const filtered: OcorrenciaDoencaResponseDTO[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return items
      .filter((p) => {
        if (df || dt) {
          const d = new Date(p.dataInicio ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }
        if (!query) return true;

        const campos = [
          p.ovino.nome ?? "",
          p.doenca.nome ?? "",
          String(p.ovino.rfid ?? ""),
          p.ovino.fbb ?? "",
          formatISODateTime(p.dataInicio),
          formatISODateTime(p.dataInicio),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataInicio ?? "").getTime();
        const db = new Date(b.dataInicio ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [items, q, tipo, dateFrom, dateTo]);

  const totalPages = viewAll ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = viewAll ? filtered : filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setTipo("TODOS");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setViewAll(false);
  };

  if (loading) return <p>Carregando doentes…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ocorrencia-page">
      <div className="ocorrencia-header flex">
        <h2>Doentes</h2>
        <Link to="/dashboard/ovinos/doencas/adoecimento">
          <Button type="button" variant="cardPrimary">
            Novo Adoecimento
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
        placeholder="Buscar por nome, doença, FBB, RFID..."
      />

      <div className="ocorrencia-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="ocorrencia-empty">Nenhum doente encontrado.</div>
      ) : (
        <div className="ocorrencia-list">
          {pageItems.map((g) => (
            <div key={g.id} className="ocorrencia-card">
              <div>
                <div className="ocorrencia-col-title">Ovino</div>
                <div className="ocorrencia-col-main">{g.ovino.nome ?? "—"}</div>
                <div className="ocorrencia-meta">
                  FBB: {g.ovino.fbb ?? "—"} • RFID: {g.ovino.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="ocorrencia-col-title">Detalhes</div>
                <div className="ocorrencia-meta">
                  <br />
                  <span>
                    <strong>Data Início:</strong>{" "}
                    {formatISODateTime(g.dataInicio) ?? "Não informado"}
                  </span>
                  <br />
                  <span>
                    <strong>Doença:</strong>{" "}
                    {g.doenca.nome ?? "Não informado"}
                  </span>
                </div>
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
          <Button type="button" variant="cardSecondary" onClick={() => setViewAll(false)}>
            Voltar à paginação
          </Button>
        </div>
      )}
    </div>
  );
};

export default GerenciarOcorrenciaDoencas;
