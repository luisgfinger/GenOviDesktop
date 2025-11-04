import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarAplicacoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";
import AplicacaoDetalhes from "./AplicacaoDetalhes";

import { useAplicacoes } from "../../../api/hooks/aplicacao/UseAplicacoes";
import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";
import { formatDate } from "../../../utils/formatDate";
import AplicacaoCard from "../../common/cards/registrosCard/AplicacaoCard";
import { getRegistroStatusByEntityId } from "../../../utils/getRegistroStatusById";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

interface GerenciarAplicacoesProps {
  isVacina: boolean;
}

const GerenciarAplicacoes: React.FC<GerenciarAplicacoesProps> = ({ isVacina }) => {
  const { aplicacoes, loading, error } = useAplicacoes();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<AplicacaoResponseDTO | null>(null);
  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>({});

  const items = useMemo<AplicacaoResponseDTO[]>(() => aplicacoes ?? [], [aplicacoes]);

  const filteredByType = useMemo(
    () => items.filter((a) => a.medicamento?.isVacina === isVacina),
    [items, isVacina]
  );

  const handleConfirm = (id: number) => {
  setRegistroStatus((prev) => ({
    ...prev,
    [id]: true,
  }));
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

  useEffect(() => {
    if (!filteredByType.length) return;

    const fetchStatuses = async () => {
      const statusMap: Record<number, boolean> = {};

      for (const a of filteredByType) {
        if (!a.id) continue;
        const status = await getRegistroStatusByEntityId(a.id);
        statusMap[a.id] = status === false;
      }

      setRegistroStatus(statusMap);
    };

    fetchStatuses();
  }, [filteredByType]);

  const filtered: AplicacaoResponseDTO[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return filteredByType
      .filter((a) => {
        if (df || dt) {
          const d = new Date(a.dataAplicacao ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          String(a.id ?? ""),            
          a.ovino?.nome ?? "",
          a.medicamento?.nome ?? "",
          a.medicamento?.fabricante ?? "",
          String(a.ovino?.rfid ?? ""),
          formatDate(a.dataAplicacao, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataAplicacao ?? "").getTime();
        const db = new Date(b.dataAplicacao ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [filteredByType, q, dateFrom, dateTo]);

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

  if (loading)
    return <p>Carregando {isVacina ? "vacinas…" : "medicamentos…"} </p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="aplicacao-page">
      <div className="aplicacao-header flex">
        <Link
          to={`/dashboard/ovinos/aplicacoes/cadastrar/${isVacina ? "vacina" : "medicamento"}`}
        >
          <Button type="button" variant="cardPrimary">
            Nova {isVacina ? "Vacinação" : "Aplicação"}
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
        placeholder={`Buscar por ID, ovino, ${isVacina ? "vacina" : "medicamento"}, fabricante ou RFID...`}
      />

      <div className="aplicacao-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="aplicacao-empty">
          Nenhuma {isVacina ? "vacinação" : "aplicação"} encontrada.
        </div>
      ) : (
        <div className="aplicacao-list">
          {pageItems.map((a) => (
            <AplicacaoCard
              key={a.id}
              aplicacao={a}
              confirmado={registroStatus[a.id ?? 0] ?? false}
              onView={() => setSelected(a)}
              onEdit={() => setSelected(a)}
              onConfirm={handleConfirm}
            />
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="aplicacao-pagination">
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
        <div className="aplicacao-pagination">
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
        <AplicacaoDetalhes
          isVacina={selected.medicamento.isVacina}
          aplicacao={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default GerenciarAplicacoes;
