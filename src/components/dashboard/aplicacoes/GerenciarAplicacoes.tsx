import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarAplicacoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";
import ActionButtons from "../../common/buttons/ActionButtons";
import AplicacaoDetalhes from "./AplicacaoDetalhes";

import { useAplicacoes } from "../../../api/hooks/aplicacao/UseAplicacoes";
import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";
import { formatDate } from "../../../utils/formatDate";

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

const GerenciarAplicacoes: React.FC<GerenciarAplicacoesProps> = ({
  isVacina,
}) => {
  const { aplicacoes, loading, error } = useAplicacoes();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<AplicacaoResponseDTO | null>(null);

  const items = useMemo<AplicacaoResponseDTO[]>(
    () => aplicacoes ?? [],
    [aplicacoes]
  );

  const filteredByType = useMemo(
    () => items.filter((a) => a.medicamento?.isVacina === isVacina),
    [items, isVacina]
  );

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
        <h2>{isVacina ? "Vacinas" : "Medicamentos"}</h2>
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
        placeholder={`Buscar por ovino, ${
          isVacina ? "vacina" : "medicamento"
        }, fabricante ou RFID...`}
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
            <div key={a.id} className="aplicacao-card">
              <div>
                <div className="aplicacao-col-title">Ovino</div>
                <div className="aplicacao-col-main">{a.ovino?.nome ?? "—"}</div>
                <div className="aplicacao-meta">
                  FBB: {a.ovino?.fbb ?? "—"} • RFID: {a.ovino?.rfid ?? "—"}
                </div>
              </div>
              <div>
                <div className="aplicacao-col-title">
                  {isVacina ? "Vacinação" : "Aplicação"}
                </div>
                <div className="aplicacao-meta">
                  <span>
                    <strong>Data:</strong> {formatDate(a.dataAplicacao, true)}
                  </span>
                  <br />
                  <span>
                    <strong>{isVacina ? "Vacina" : "Medicamento"}:</strong>{" "}
                    {a.medicamento?.nome ?? "—"}
                  </span>
                  <br />
                  <span>
                    <strong>Fabricante:</strong>{" "}
                    {a.medicamento?.fabricante ?? "—"}
                  </span>
                </div>
              </div>
              <div className="aplicacao-actions">
                <Button variant="cardSecondary" onClick={() => setSelected(a)}>
                  Ver mais
                </Button>
                <ActionButtons
                  onEdit={() => setSelected(a)}
                  showRemove={false}
                />
              </div>
            </div>
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
