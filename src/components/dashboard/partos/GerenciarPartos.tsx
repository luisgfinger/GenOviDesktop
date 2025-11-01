import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarPartos.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { usePartos } from "../../../api/hooks/parto/UsePartos";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { PartoResponseDTO } from "../../../api/dtos/parto/PartoResponseDTO";
import FilterBar from "../../common/filter-bar/FilterBar";
import PartoDetalhes from "./PartoDetalhes";
import { formatDate } from "../../../utils/formatDate";
import PartoCard from "../../common/cards/registrosCard/PartoCard";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type PartoUI = PartoResponseDTO & {
  ovelhaPai?: { id: number; nome?: string; fbb?: string; rfid?: number };
  ovelhaMae?: { id: number; nome?: string; fbb?: string; rfid?: number };
};

const PAGE_SIZE = 5;

const GerenciarPartos: React.FC = () => {
  const { partos, loading, error } = usePartos();
  const { ovinos } = useOvinos();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(""); 
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const [selectedParto, setSelectedParto] = useState<PartoUI | null>(null);

  const partosHydrated: PartoUI[] = useMemo(() => {
    return (partos ?? []).map((p) => {
      const ovelhaPai =
        p.pai?.id && ovinos
          ? (ovinos.find((o) => o.id === p.pai?.id) ?? p.pai)
          : p.pai;

      const ovelhaMae =
        p.mae?.id && ovinos
          ? (ovinos.find((o) => o.id === p.mae.id) ?? p.mae)
          : p.mae;

      return { ...p, ovelhaPai, ovelhaMae };
    });
  }, [partos, ovinos]);

  const filtered: PartoUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return partosHydrated
      .filter((p) => {
        if (df || dt) {
          const d = new Date(p.dataParto ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;
        const campos = [
          p.ovelhaPai?.nome ?? "",
          p.ovelhaMae?.nome ?? "",
          p.ovelhaPai?.fbb ?? "",
          p.ovelhaMae?.fbb ?? "",
          String(p.ovelhaPai?.rfid ?? ""),
          String(p.ovelhaMae?.rfid ?? ""),
          formatDate(p.dataParto, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataParto ?? "").getTime();
        const db = new Date(b.dataParto ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [partosHydrated, q, dateFrom, dateTo]);

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

  if (loading) return <p>Carregando partos…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="partos-page">
      <div className="partos-header flex">
        <h2>Partos</h2>
        <Link to="/dashboard/ovinos/partos/criar">
          <Button type="button" variant="cardPrimary">
            Novo Parto
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

      <div className="partos-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="partos-empty">Nenhum parto encontrado.</div>
      ) : (
        <div className="partos-list">
          {pageItems.map((p) => (
            <PartoCard key={p.id} parto={p} onView={() => setSelectedParto(p)} />
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="partos-pagination">
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
        <div className="partos-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selectedParto && (
        <PartoDetalhes
          parto={selectedParto}
          onClose={() => setSelectedParto(null)}
        />
      )}
    </div>
  );
};

export default GerenciarPartos;
