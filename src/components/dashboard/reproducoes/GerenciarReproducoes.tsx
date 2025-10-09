import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarReproducoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { useReproducoes } from "../../../api/hooks/reproducao/UseReproducoes";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";
import FilterBar from "../../common/filter-bar/FilterBar";
import ActionButtons from "../../common/buttons/ActionButtons";
import ReproducaoDetalhes from "./ReproducoesDetalhes";
import { formatDate } from "../../../utils/formatDate";


function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type ReproducaoUI = ReproducaoResponseDTO & {
  carneiroPai?: { id: number; nome?: string; fbb?: string; rfid?: number };
  ovelhaMae?: { id: number; nome?: string; fbb?: string; rfid?: number };
};

const PAGE_SIZE = 5;

const GerenciarReproducoes: React.FC = () => {
  const { reproducoes, loading, error } = useReproducoes();
  const { ovinos } = useOvinos();

  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("TODOS");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const [selectedRepro, setSelectedRepro] = useState<ReproducaoUI | null>(null);

  const reprosHydrated: ReproducaoUI[] = useMemo(() => {
    return (reproducoes ?? []).map((r) => {
      const carneiroPai =
        r.carneiroPai?.id && ovinos
          ? (ovinos.find((o) => o.id === r.carneiroPai?.id) ?? r.carneiroPai)
          : r.carneiroPai;

      const ovelhaMae =
        r.ovelhaMae?.id && ovinos
          ? (ovinos.find((o) => o.id === r.ovelhaMae?.id) ?? r.ovelhaMae)
          : r.ovelhaMae;

      return { ...r, carneiroPai, ovelhaMae };
    });
  }, [reproducoes, ovinos]);

  const filtered: ReproducaoUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return reprosHydrated
      .filter((r) => {
        if (tipo !== "TODOS" && r.typeReproducao !== (tipo as TypeReproducao))
          return false;

        if (df || dt) {
          const d = new Date(r.dataReproducao ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;
        const campos = [
          r.observacoes ?? "",
          r.typeReproducao ?? "",
          r.carneiroPai?.nome ?? "",
          r.carneiroPai?.fbb ?? "",
          String(r.carneiroPai?.rfid ?? ""),
          r.ovelhaMae?.nome ?? "",
          r.ovelhaMae?.fbb ?? "",
          String(r.ovelhaMae?.rfid ?? ""),
          formatDate(r.dataReproducao, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataReproducao ?? "").getTime();
        const db = new Date(b.dataReproducao ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [reprosHydrated, q, tipo, dateFrom, dateTo]);

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
    setTipo("TODOS");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setViewAll(false);
  };

  if (loading) return <p>Carregando reproduções…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="repros-page">
      <div className="repros-header flex">
        <h2>Reproduções</h2>
        <Link to="/dashboard/ovinos/reproducoes/criar">
          <Button type="button" variant="cardPrimary">
            Nova Reprodução
          </Button>
        </Link>
      </div>

      <FilterBar
        q={q}
        setQ={setQ}
        tipo={tipo}
        setTipo={setTipo}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        clearFilters={clearFilters}
        setPage={setPage}
        setViewAll={setViewAll}
        placeholder="Buscar por pai/mãe, FBB, RFID, observações…"
      />

      <div className="repros-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="repros-empty">Nenhuma reprodução encontrada.</div>
      ) : (
        <div className="repros-list">
          {pageItems.map((r) => (
            <div key={r.id} className="repros-card">
              <div>
                <div className="repros-col-title">Carneiro (Macho)</div>
                <div className="repros-col-main">
                  {r.carneiroPai?.nome ?? "—"}
                </div>
                <div className="repros-meta">
                  FBB: {r.carneiroPai?.fbb ?? "—"} • RFID:{" "}
                  {r.carneiroPai?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="repros-col-title">Ovelha (Fêmea)</div>
                <div className="repros-col-main">
                  {r.ovelhaMae?.nome ?? "—"}
                </div>
                <div className="repros-meta">
                  FBB: {r.ovelhaMae?.fbb ?? "—"} • RFID:{" "}
                  {r.ovelhaMae?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="repros-col-title">Detalhes</div>
                <div className="repros-meta">
                  <span>
                    <strong>Tipo:</strong>{" "}
                    {r.typeReproducao ? formatEnum(r.typeReproducao) : "—"}
                  </span>
                  <br />
                  <span>
                    <strong>Data:</strong> {formatDate(r.dataReproducao, true)}
                  </span>
                </div>
              </div>
              <div>
                <div className="repros-meta">
                  <span>
                    <Button
                      variant="cardSecondary"
                      onClick={() => setSelectedRepro(r)}
                    >
                      Ver mais
                    </Button>
                  </span>
                </div>
              </div>
              <div>
                <div className="repros-meta">
                  <span>
                    <ActionButtons
                      onEdit={() => setSelectedRepro(r)}
                      showRemove={false}
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="repros-pagination">
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
        <div className="repros-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selectedRepro && (
        <ReproducaoDetalhes
          reproducao={selectedRepro}
          onClose={() => setSelectedRepro(null)}
        />
      )}
    </div>
  );
};

export default GerenciarReproducoes;
