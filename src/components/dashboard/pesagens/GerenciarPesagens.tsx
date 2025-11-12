import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarPesagens.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { usePesagens } from "../../../api/hooks/pesagem/UsePesagens";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { PesagemResponseDTO } from "../../../api/dtos/pesagem/PesagemResponseDTO";
import FilterBar from "../../common/filter-bar/FilterBar";
import PesagemDetalhes from "./PesagemDetalhes";
import { formatDate } from "../../../utils/formatDate";
import { formatEnum } from "../../../utils/formatEnum";
import { getRegistroStatusByEntityId } from "../../../utils/getRegistroStatusById";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type PesagemUI = PesagemResponseDTO & {
  ovinoNome?: string;
  racaNome?: string;
};

const PAGE_SIZE = 5;

const GerenciarPesagens: React.FC = () => {
  const { pesagens, loading, error } = usePesagens();
  const { ovinos } = useOvinos();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedPesagem, setSelectedPesagem] = useState<PesagemUI | null>(null);


  const pesagensHydrated: PesagemUI[] = useMemo(() => {
    return (pesagens ?? []).map((p) => {
      const ovino =
        p.ovino?.id && ovinos
          ? (ovinos.find((o) => o.id === p.ovino?.id) ?? p.ovino)
          : p.ovino;

      return {
        ...p,
        ovinoNome: ovino?.nome ?? `#${ovino?.id ?? "-"}`,
        racaNome: ovino?.raca ? formatEnum(ovino.raca) : "—",
      };
    });
  }, [pesagens, ovinos]);


  const filtered: PesagemUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return pesagensHydrated
      .filter((p) => {
        if (df || dt) {
          const d = new Date(p.dataPesagem ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          p.id ? String(p.id) : "",
          p.ovinoNome ?? "",
          p.racaNome ?? "",
          formatDate(p.dataPesagem, true),
          String(p.peso ?? ""),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataPesagem ?? "").getTime();
        const db = new Date(b.dataPesagem ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [pesagensHydrated, q, dateFrom, dateTo]);

  const totalPages = viewAll ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = viewAll ? filtered : filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setViewAll(false);
  };

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchId = params.get("searchId");
    if (searchId) {
      setQ(searchId);
      setPage(1);
      setViewAll(false);
    }
  }, [location.search]);

  if (loading) return <p>Carregando pesagens…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pesagens-page">
      <div className="pesagens-header flex">
        <Link to="/dashboard/ovinos/pesagens/criar">
          <Button type="button" variant="cardPrimary">
            Nova Pesagem
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
        placeholder="Buscar por id, ovino, raça, peso…"
      />

      <div className="pesagens-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="pesagens-empty">Nenhuma pesagem encontrada.</div>
      ) : (
        <div className="pesagens-list">
          {pageItems.map((p) => (
            <div key={p.id} className="pesagem-card flex-between">
              <div className="pesagem-info">
                <h4>#{p.id} — {p.ovinoNome}</h4>
                <p><strong>Raça:</strong> {p.racaNome}</p>
                <p><strong>Peso:</strong> {p.peso.toFixed(2)} kg</p>
                <p><strong>Data:</strong> {formatDate(p.dataPesagem, true)}</p>
              </div>

              <div className="pesagem-actions flex-column">
                <Button
                  type="button"
                  variant="cardSecondary"
                  onClick={() => setSelectedPesagem(p)}
                >
                  Ver mais
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="pesagens-pagination">
          <PaginationMenu
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            showViewAll={filtered.length > PAGE_SIZE}
            onViewAll={() => {
              setViewAll(true);
              setPage(1);
            }}
          />
        </div>
      )}

      {viewAll && filtered.length > PAGE_SIZE && (
        <div className="pesagens-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selectedPesagem && (
        <PesagemDetalhes
          pesagem={selectedPesagem}
          onClose={() => setSelectedPesagem(null)}
        />
      )}
    </div>
  );
};

export default GerenciarPesagens;
