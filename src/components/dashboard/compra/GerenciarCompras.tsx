import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarCompras.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";
import ActionButtons from "../../common/buttons/ActionButtons";
import CompraDetalhes from "./CompraDetalhes";

import { useCompras } from "../../../api/hooks/compra/UseCompras";
import { useVendedores } from "../../../api/hooks/vendedor/UseVendedores";
import type { CompraResponseDTO } from "../../../api/dtos/compra/CompraResponseDTO";
import { formatDate } from "../../../utils/formatDate";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type CompraUI = CompraResponseDTO & {
  vendedor?: { id: number; nome?: string; telefone?: string };
};

const PAGE_SIZE = 5;

const GerenciarCompras: React.FC = () => {
  const { compras, loading, error } = useCompras();
  const { vendedores } = useVendedores();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<CompraUI | null>(null);

  const comprasHydrated: CompraUI[] = useMemo(() => {
    return (compras ?? []).map((c) => {
      const vendedor =
        c.vendedor?.id && vendedores
          ? (vendedores.find((v) => v.id === c.vendedor?.id) ?? c.vendedor)
          : c.vendedor;
      return { ...c, vendedor };
    });
  }, [compras, vendedores]);

  const filtered: CompraUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return comprasHydrated
      .filter((c) => {
        if (df || dt) {
          const d = new Date(c.dataCompra ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;
        const campos = [
          c.vendedor?.nome ?? "",
          c.vendedor?.telefone ?? "",
          String(c.valor ?? ""),
          formatDate(c.dataCompra, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataCompra ?? "").getTime();
        const db = new Date(b.dataCompra ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [comprasHydrated, q, dateFrom, dateTo]);

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

  if (loading) return <p>Carregando compras…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="compras-page">
      <div className="compras-header flex">
        <h2>Compras</h2>
        <Link to="/dashboard/ovinos/compra/criar">
          <Button type="button" variant="cardPrimary">
            Nova Compra
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
        placeholder="Buscar por vendedor, valor, data…"
      />

      <div className="compras-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="compras-empty">Nenhuma compra encontrada.</div>
      ) : (
        <div className="compras-list">
          {pageItems.map((c) => (
            <div key={c.id} className="compras-card">
              <div>
                <div className="compras-col-title">Vendedor</div>
                <div className="compras-col-main">
                  {c.vendedor?.nome ?? "—"}
                </div>
                <div className="compras-meta">
                  {c.vendedor?.telefone
                    ? `Tel: ${c.vendedor.telefone}`
                    : "Sem telefone"}
                </div>
              </div>

              <div>
                <div className="compras-col-title">Data da Compra</div>
                <div className="compras-meta">{formatDate(c.dataCompra, true)}</div>
              </div>

              <div>
                <div className="compras-col-title">Valor Total</div>
                <div className="compras-meta">
                  R$ {Number(c.valor ?? 0).toFixed(2)}
                </div>
              </div>

              <div>
                <Button
                  variant="cardSecondary"
                  onClick={() => setSelectedCompra(c)}
                >
                  Ver mais
                </Button>
              </div>

              <div>
                <ActionButtons
                  onEdit={() => setSelectedCompra(c)}
                  showRemove={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="compras-pagination">
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
        <div className="compras-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selectedCompra && (
        <CompraDetalhes
          compra={selectedCompra}
          onClose={() => setSelectedCompra(null)}
        />
      )}
    </div>
  );
};

export default GerenciarCompras;
