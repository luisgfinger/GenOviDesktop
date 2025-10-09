import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarGestacoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";
import FilterBar from "../../common/filter-bar/FilterBar";
import ActionButtons from "../../common/buttons/ActionButtons";
import GestacaoDetalhes from "./GestacaoDetalhes";
import { formatDate } from "../../../utils/formatDate";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type GestacaoUI = GestacaoResponseDTO & {
  ovelhaPai?: { id: number; nome?: string; fbb?: string; rfid?: number };
  ovelhaMae?: { id: number; nome?: string; fbb?: string; rfid?: number };
};

const PAGE_SIZE = 5;

const GerenciarGestacoes: React.FC = () => {
  const { gestacoes, loading, error } = useGestacoes();
  const { ovinos } = useOvinos();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const [selectedGestacao, setSelectedGestacao] = useState<GestacaoUI | null>(null);

  const gestacoesHydrated: GestacaoUI[] = useMemo(() => {
    return (gestacoes ?? []).map((g) => {
      const ovelhaPai =
        g.ovelhaPai?.id && ovinos
          ? (ovinos.find((o) => o.id === g.ovelhaPai?.id) ?? g.ovelhaPai)
          : g.ovelhaPai;

      const ovelhaMae =
        g.ovelhaMae?.id && ovinos
          ? (ovinos.find((o) => o.id === g.ovelhaMae?.id) ?? g.ovelhaMae)
          : g.ovelhaMae;

      return { ...g, ovelhaPai, ovelhaMae };
    });
  }, [gestacoes, ovinos]);

  const filtered: GestacaoUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return gestacoesHydrated
      .filter((g) => {
        if (df || dt) {
          const d = new Date(g.dataGestacao ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;
        const campos = [
          g.ovelhaPai?.nome ?? "",
          g.ovelhaMae?.nome ?? "",
          g.ovelhaPai?.fbb ?? "",
          g.ovelhaMae?.fbb ?? "",
          String(g.ovelhaPai?.rfid ?? ""),
          String(g.ovelhaMae?.rfid ?? ""),
          formatDate(g.dataGestacao, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataGestacao ?? "").getTime();
        const db = new Date(b.dataGestacao ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [gestacoesHydrated, q, dateFrom, dateTo]);

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

  if (loading) return <p>Carregando gestações…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="gestacoes-page">
      <div className="gestacoes-header flex">
        <h2>Gestações</h2>
        <Link to="/dashboard/ovinos/gestacoes/criar">
          <Button type="button" variant="cardPrimary">
            Nova Gestação
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
        placeholder="Buscar por pai/mãe, FBB, RFID…"
      />

      <div className="gestacoes-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="gestacoes-empty">Nenhuma gestação encontrada.</div>
      ) : (
        <div className="gestacoes-list">
          {pageItems.map((g) => (
            <div
              key={g.id}
              className="gestacoes-card"
            >
              <div>
                <div className="gestacoes-col-title">Ovelha (mãe)</div>
                <div className="gestacoes-col-main">
                  {g.ovelhaMae?.nome ?? "—"}
                </div>
                <div className="gestacoes-meta">
                  FBB: {g.ovelhaMae?.fbb ?? "—"} • RFID:{" "}
                  {g.ovelhaMae?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="gestacoes-col-title">Carneiro (pai)</div>
                <div className="gestacoes-col-main">
                  {g.ovelhaPai?.nome ?? "—"}
                </div>
                <div className="gestacoes-meta">
                  FBB: {g.ovelhaPai?.fbb ?? "—"} • RFID:{" "}
                  {g.ovelhaPai?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="gestacoes-col-title">Data</div>
                <div className="gestacoes-meta">
                  {formatDate(g.dataGestacao, true)}
                </div>
              </div>
              <div>
                <div className="gestacoes-meta">
                  <span>
                    <Button
                      variant="cardSecondary"
                      onClick={() => setSelectedGestacao(g)}
                    >
                      Ver mais
                    </Button>
                  </span>
                </div>
              </div>
              <div>
                <div className="gestacoes-meta">
                  <ActionButtons
                    onEdit={() => setSelectedGestacao(g)}
                    showRemove={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="gestacoes-pagination">
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
        <div className="gestacoes-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selectedGestacao && (
        <GestacaoDetalhes
          gestacao={selectedGestacao}
          onClose={() => setSelectedGestacao(null)}
        />
      )}
    </div>
  );
};

export default GerenciarGestacoes;
