import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarGestacoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { usePartos } from "../../../api/hooks/parto/UsePartos";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";
import FilterBar from "../../common/filter-bar/FilterBar";
import GestacaoDetalhes from "./GestacaoDetalhes";
import GestacaoCard from "../../common/cards/registrosCard/GestacaoCard";
import { formatDate } from "../../../utils/formatDate";
import { getRegistroStatusByEntityId } from "../../../utils/getRegistroStatusById";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type GestacaoUI = GestacaoResponseDTO & {
  ovelhaPai?: { id: number; nome?: string; fbb?: string; rfid?: number };
  ovelhaMae?: { id: number; nome?: string; fbb?: string; rfid?: number };
  statusGestacao?: "EM_ANDAMENTO" | "CONCLUIDA";
};

const PAGE_SIZE = 5;

const GerenciarGestacoes: React.FC = () => {
  const { gestacoes, loading, error } = useGestacoes();
  const { ovinos } = useOvinos();
  const { partos } = usePartos();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState<"TODOS" | "EM_ANDAMENTO" | "CONCLUIDA">("TODOS");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedGestacao, setSelectedGestacao] = useState<GestacaoUI | null>(null);

  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>({});

    const handleConfirm = (id: number) => {
    setRegistroStatus((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

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

      const concluida = partos?.some((p) => p.gestacao?.id === g.id) ?? false;

      return {
        ...g,
        ovelhaPai,
        ovelhaMae,
        statusGestacao: concluida ? "CONCLUIDA" : "EM_ANDAMENTO",
      };
    });
  }, [gestacoes, ovinos, partos]);

  useEffect(() => {
    if (!gestacoesHydrated.length) return;

    const fetchStatuses = async () => {
      const statusMap: Record<number, boolean> = {};

      for (const g of gestacoesHydrated) {
        if (!g.id) continue;
        const status = await getRegistroStatusByEntityId(g.id);
        statusMap[g.id] = status === false;
      }

      setRegistroStatus(statusMap);
    };

    fetchStatuses();
  }, [gestacoesHydrated]);

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

        if (status !== "TODOS" && g.statusGestacao !== status) return false;

        if (!query) return true;

        const campos = [
          g.id ? String(g.id) : "",
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
  }, [gestacoesHydrated, q, dateFrom, dateTo, status]);

  const totalPages = viewAll ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = viewAll ? filtered : filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setStatus("TODOS");
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

  if (loading) return <p>Carregando gestações…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="gestacoes-page">
      <div className="gestacoes-header flex">
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
        placeholder="Buscar por id, pai/mãe, FBB, RFID…"
        status={status}
        setStatus={setStatus}
        statusLabel="Status"
        statusOptions={[
          { value: "EM_ANDAMENTO", label: "Em andamento" },
          { value: "CONCLUIDA", label: "Concluída" },
        ]}
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
            <GestacaoCard
              key={g.id}
              gestacao={g}
              confirmado={registroStatus[g.id ?? 0] ?? false}
              onView={() => setSelectedGestacao(g)}
              onEdit={() => setSelectedGestacao(g)}
              onConfirm={handleConfirm}
            />
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="gestacoes-pagination">
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
