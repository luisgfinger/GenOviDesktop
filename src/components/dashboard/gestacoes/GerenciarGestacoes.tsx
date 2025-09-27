import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarGestacoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";

import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";
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

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

const GerenciarGestacoes: React.FC = () => {
  const { gestacoes, loading, error } = useGestacoes();

  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("TODOS");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const items = useMemo<GestacaoResponseDTO[]>(() => gestacoes ?? [], [gestacoes]);

  const filtered: GestacaoResponseDTO[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return items
      .filter((g) => {
        if (tipo !== "TODOS" && g.reproducao?.typeReproducao !== (tipo as TypeReproducao)) {
          return false;
        }
        if (df || dt) {
          const d = new Date(g.dataGestacao ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          g.ovelhaPai?.nome ?? "",
          g.ovelhaPai?.fbb ?? "",
          String(g.ovelhaPai?.rfid ?? ""),
          g.ovelhaMae?.nome ?? "",
          g.ovelhaMae?.fbb ?? "",
          String(g.ovelhaMae?.rfid ?? ""),
          g.reproducao?.observacoes ?? "",
          g.reproducao?.typeReproducao ?? "",
          formatISODateTime(g.reproducao?.dataReproducao),
          formatISODateTime(g.dataGestacao),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataGestacao ?? "").getTime();
        const db = new Date(b.dataGestacao ?? "").getTime();
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

  if (loading) return <p>Carregando gestações…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="gest-page">
      <div className="gest-header flex">
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

      <div className="gest-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="gest-empty">Nenhuma gestação encontrada.</div>
      ) : (
        <div className="gest-list">
          {pageItems.map((g) => (
            <div key={g.id} className="gest-card">
              <div>
                <div className="gest-col-title">Carneiro (Macho)</div>
                <div className="gest-col-main">{g.ovelhaPai?.nome ?? "—"}</div>
                <div className="gest-meta">
                  FBB: {g.ovelhaPai?.fbb ?? "—"} • RFID: {g.ovelhaPai?.rfid ?? "—"}
                </div>
              </div>

              <div>
                <div className="gest-col-title">Ovelha (Fêmea)</div>
                <div className="gest-col-main">{g.ovelhaMae?.nome ?? "—"}</div>
                <div className="gest-meta">
                  FBB: {g.ovelhaMae?.fbb ?? "—"} • RFID: {g.ovelhaMae?.rfid ?? "—"}
                </div>
              </div>

              <div>
                <div className="gest-col-title">Detalhes</div>
                <div className="gest-meta">
                  <span>
                    <strong>Tipo Reprodução:</strong>{" "}
                    {g.reproducao?.typeReproducao
                      ? formatEnum(g.reproducao.typeReproducao)
                      : "—"}
                  </span>
                  <br />
                  <span>
                    <strong>Data Reprodução:</strong>{" "}
                    {formatISODateTime(g.reproducao?.dataReproducao)}
                  </span>
                  <br />
                  <span>
                    <strong>Data Gestação:</strong> {formatISODateTime(g.dataGestacao)}
                  </span>
                  <br />
                  {g.reproducao?.observacoes && <em>{g.reproducao.observacoes}</em>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!viewAll && totalPages > 1 && (
        <div className="gest-pagination">
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
        <div className="gest-pagination">
          <Button type="button" variant="cardSecondary" onClick={() => setViewAll(false)}>
            Voltar à paginação
          </Button>
        </div>
      )}
    </div>
  );
};

export default GerenciarGestacoes;
