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

function formatISODateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.toLocaleDateString();
  const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dia} ${hora}`;
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

  const byId = useMemo(() => {
    const m = new Map<number, { id: number; nome?: string; fbb?: string; rfid?: number }>();
    (ovinos ?? []).forEach((o) =>
      m.set(o.id, { id: o.id, nome: o.nome, fbb: o.fbb, rfid: o.rfid })
    );
    return m;
  }, [ovinos]);

const reprosHydrated: ReproducaoUI[] = useMemo(() => {
  const toBasic = (o: any) =>
    o && typeof o === "object"
      ? {
          id: Number(o.id),
          nome: o.nome,
          fbb: o.fbb,
          rfid: typeof o.rfid === "string" ? Number(o.rfid) : o.rfid,
        }
      : undefined;

  return (reproducoes ?? []).map((r) => {
    const anyR = r as any;

    const carneiroObj =
      anyR.carneiroPai ??
      anyR.carneiro ??
      anyR.pai ??
      anyR.macho ??
      anyR.ram ??
      (typeof anyR.carneiroId === "object" ? anyR.carneiroId : null);

    const ovelhaObj =
      anyR.ovelhaMae ??
      anyR.ovelha ??
      anyR.mae ??
      anyR.femea ??
      anyR.ewe ??
      (typeof anyR.ovelhaId === "object" ? anyR.ovelhaId : null);

    const carneiroId =
      (carneiroObj && Number(carneiroObj.id)) ||
      (typeof anyR.carneiroPaiId !== "undefined" ? Number(anyR.carneiroPaiId) : undefined) ||
      (typeof anyR.carneiroId !== "object" ? Number(anyR.carneiroId) : undefined);

    const ovelhaId =
      (ovelhaObj && Number(ovelhaObj.id)) ||
      (typeof anyR.ovelhaMaeId !== "undefined" ? Number(anyR.ovelhaMaeId) : undefined) ||
      (typeof anyR.ovelhaId !== "object" ? Number(anyR.ovelhaId) : undefined);

    const carneiroHydrated =
      r.carneiroPai ??
      toBasic(carneiroObj) ??
      (carneiroId && byId.get(carneiroId)) ??
      (carneiroId ? { id: carneiroId } : undefined);

    const ovelhaHydrated =
      r.ovelhaMae ??
      toBasic(ovelhaObj) ??
      (ovelhaId && byId.get(ovelhaId)) ??
      (ovelhaId ? { id: ovelhaId } : undefined);

    return { ...r, carneiroPai: carneiroHydrated, ovelhaMae: ovelhaHydrated };
  });
}, [reproducoes, byId]);

  const filtered: ReproducaoUI[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return reprosHydrated
      .filter((r) => {
        if (tipo !== "TODOS" && r.typeReproducao !== (tipo as TypeReproducao)) return false;

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
          formatISODateTime(r.dataReproducao),
        ].map((x) => normalize(String(x)));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataReproducao ?? "").getTime();
        const db = new Date(b.dataReproducao ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [reprosHydrated, q, tipo, dateFrom, dateTo]);

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

  if (loading) return <p>Carregando reproduções…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="repros-page">
      <div className="repros-header">
        <h2>Reproduções</h2>
        <Link to="/dashboard/ovinos/reproducoes/criar">
          <Button type="button" variant="cardPrimary">Nova Reprodução</Button>
        </Link>
      </div>

      <div className="repros-filters">
        <div className="repros-filter-group">
          <label htmlFor="repros-busca">Buscar</label>
          <input
            id="repros-busca"
            className="repros-input"
            type="text"
            placeholder="Buscar por pai/mãe, FBB, RFID, observações…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
              setViewAll(false);
            }}
          />
        </div>

        <div className="repros-filter-group">
          <label htmlFor="repros-tipo">Tipo</label>
          <select
            id="repros-tipo"
            className="repros-select"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setPage(1);
              setViewAll(false);
            }}
          >
            <option value="TODOS">Todos</option>
            {Object.values(TypeReproducao).map((t) => (
              <option key={t} value={t}>
                {formatEnum(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="repros-filter-group">
          <label htmlFor="repros-de">De</label>
          <input
            id="repros-de"
            className="repros-date"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
              setViewAll(false);
            }}
          />
        </div>

        <div className="repros-filter-group">
          <label htmlFor="repros-ate">Até</label>
          <input
            id="repros-ate"
            className="repros-date"
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
              setViewAll(false);
            }}
          />
        </div>

        <Button type="button" variant="cardSecondary" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </div>

      <div className="repros-counter">
        Mostrando <strong>{pageItems.length}</strong> de <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="repros-empty">Nenhuma reprodução encontrada.</div>
      ) : (
        <div className="repros-list">
          {pageItems.map((r) => (
            <div key={r.id} className="repros-card">
              <div>
                <div className="repros-col-title">Carneiro (pai)</div>
                <div className="repros-col-main">{r.carneiroPai?.nome ?? "—"}</div>
                <div className="repros-meta">
                  FBB: {r.carneiroPai?.fbb ?? "—"} • RFID: {r.carneiroPai?.rfid ?? "—"}
                </div>
              </div>

              <div>
                <div className="repros-col-title">Ovelha (mãe)</div>
                <div className="repros-col-main">{r.ovelhaMae?.nome ?? "—"}</div>
                <div className="repros-meta">
                  FBB: {r.ovelhaMae?.fbb ?? "—"} • RFID: {r.ovelhaMae?.rfid ?? "—"}
                </div>
              </div>

              <div>
                <div className="repros-col-title">Detalhes</div>
                <div className="repros-meta">
                  <span><strong>Tipo:</strong> {r.typeReproducao ? formatEnum(r.typeReproducao) : "—"}</span><br />
                  <span><strong>Data:</strong> {formatISODateTime(r.dataReproducao)}</span><br />
                  {r.observacoes && <em>{r.observacoes}</em>}
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
          <Button type="button" variant="cardSecondary" onClick={() => setViewAll(false)}>
            Voltar à paginação
          </Button>
        </div>
      )}
    </div>
  );
};

export default GerenciarReproducoes;
