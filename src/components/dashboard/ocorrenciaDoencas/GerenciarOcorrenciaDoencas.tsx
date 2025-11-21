
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarOcorrenciaDoencas.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";
import OcorrenciaDoencaDetalhes from "./OcorrenciaDoencaDetalhes";
import OcorrenciaDoencaCard from "../../common/cards/registrosCard/OcorrenciaDoencaCard";

import { useOcorrenciasDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import { useEditarOcorrenciaDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import { useRegistros } from "../../../api/hooks/registro/UseRegistros";

import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";
import { formatDate } from "../../../utils/formatDate";
import { toast } from "react-toastify";

import { updateRegistroSugestao } from "../../../utils/updateRegistroSugestao";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

const GerenciarOcorrenciasDoenca: React.FC = () => {
  const { ocorrencias, loading, error } = useOcorrenciasDoenca();
  const { editarOcorrencia } = useEditarOcorrenciaDoenca();

  const { registros, setRegistros } = useRegistros();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusCurado, setStatusCurado] = useState("TODOS");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const [selected, setSelected] = useState<OcorrenciaDoencaResponseDTO | null>(null);

  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>({});

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

  const items = useMemo(
    () => ocorrencias ?? [],
    [ocorrencias]
  );

  useEffect(() => {
    if (!items.length || !registros) return;

    const map: Record<number, boolean> = {};

    for (const o of items) {
      const reg = registros.find((r) => r.ocorrenciaDoenca?.id === o.id);
      if (!reg) continue;

      map[reg.idRegistro] = !reg.isSugestao;
    }

    setRegistroStatus(map);
  }, [items, registros]);

  const handleConfirm = async (ocorrencia: OcorrenciaDoencaResponseDTO) => {
    if (!registros) return;

    const reg = registros.find((r) => r.ocorrenciaDoenca?.id === ocorrencia.id);
    if (!reg) {
      toast.error("Registro não encontrado para esta ocorrência.");
      return;
    }

    const ok = await updateRegistroSugestao(reg);
    if (!ok) return;

    toast.success("Registro confirmado!");

    setRegistroStatus((prev) => ({
      ...prev,
      [reg.idRegistro]: true,
    }));

    setRegistros((prev) =>
      prev.map((x) =>
        x.idRegistro === reg.idRegistro ? { ...x, isSugestao: false } : x
      )
    );
  };

  const filtered = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return items
      .filter((o) => {
        if (df || dt) {
          const d = new Date(o.dataInicio ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (statusCurado === "CURADOS" && !o.curado) return false;
        if (statusCurado === "NAO_CURADOS" && o.curado) return false;

        if (!query) return true;

        const campos = [
          o.id ? String(o.id) : "",
          o.ovino?.nome ?? "",
          o.doenca?.nome ?? "",
          o.doenca?.descricao ?? "",
          String(o.ovino?.rfid ?? ""),
          formatDate(o.dataInicio, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataInicio ?? "").getTime();
        const db = new Date(b.dataInicio ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [items, q, dateFrom, dateTo, statusCurado]);

  const totalPages = viewAll ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = viewAll ? filtered : filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setStatusCurado("TODOS");
    setPage(1);
    setViewAll(false);
  };

  const handleMarkCurado = async (ocorrencia: OcorrenciaDoencaResponseDTO) => {
    if (!ocorrencia.id) return;

    if (!window.confirm(`Deseja marcar a ocorrência do ovino "${ocorrencia.ovino?.nome}" como curada?`))
      return;

    try {
      const dataFinalAtual = new Date().toISOString();

      await editarOcorrencia(ocorrencia.id, {
        ovinoId: ocorrencia.ovino?.id ?? null,
        doencaId: ocorrencia.doenca?.id ?? null,
        dataInicio: ocorrencia.dataInicio ?? "",
        dataFinal: dataFinalAtual,
        curado: true,
      });

      toast.success("Ocorrência marcada como curada!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao marcar ocorrência como curada.");
    }
  };

  if (loading) return <p>Carregando ocorrências de doenças…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ocorrencia-page">
      <div className="ocorrencia-header flex">
        <Link to="/dashboard/ovinos/doencas/adoecimento">
          <Button type="button" variant="cardPrimary">
            Nova Ocorrência
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
        placeholder="Buscar por id, ovino, doença, descrição ou RFID..."
        status={statusCurado}
        setStatus={setStatusCurado}
        statusLabel="Status"
        statusOptions={["CURADOS", "NAO_CURADOS"]}
        allOptionLabel="Todos"
        allOptionValue="TODOS"
      />

      <div className="ocorrencia-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="ocorrencia-empty">Nenhuma ocorrência de doença encontrada.</div>
      ) : (
        <div className="ocorrencia-list">
          {pageItems.map((o) => {
            const reg = registros?.find((r) => r.ocorrenciaDoenca?.id === o.id);

            const confirmado = reg
              ? (registroStatus[reg.idRegistro] ?? !reg.isSugestao)
              : false;

            return (
              <OcorrenciaDoencaCard
                key={o.id}
                ocorrencia={o}
                confirmado={confirmado}
                onView={() => setSelected(o)}
                onMarkCurado={() => handleMarkCurado(o)}
                onConfirm={() => handleConfirm(o)}
              />
            );
          })}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="ocorrencia-pagination">
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
        <div className="ocorrencia-pagination">
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
        <OcorrenciaDoencaDetalhes
          ocorrencia={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default GerenciarOcorrenciasDoenca;
