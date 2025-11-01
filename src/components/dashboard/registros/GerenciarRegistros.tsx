import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarRegistros.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";

import { useRegistros } from "../../../api/hooks/registro/UseRegistros";
import { useEditarOcorrenciaDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";

import type { RegistroResponseDTO } from "../../../api/dtos/registro/RegistroResponseDTO";
import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";
import { formatDate } from "../../../utils/formatDate";
import { toast } from "react-toastify";

import AplicacaoCard from "../../common/cards/registrosCard/AplicacaoCard";
import ReproducaoCard from "../../common/cards/registrosCard/ReproducaoCard";
import GestacaoCard from "../../common/cards/registrosCard/GestacaoCard";
import PartoCard from "../../common/cards/registrosCard/PartoCard";
import OcorrenciaDoencaCard from "../../common/cards/registrosCard/OcorrenciaDoencaCard";

import AplicacaoDetalhes from "../aplicacoes/AplicacaoDetalhes";
import ReproducaoDetalhes from "../reproducoes/ReproducoesDetalhes";
import GestacaoDetalhes from "../gestacoes/GestacaoDetalhes";
import PartoDetalhes from "../partos/PartoDetalhes";
import OcorrenciaDoencaDetalhes from "../ocorrenciaDoencas/OcorrenciaDoencaDetalhes";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 6;

const GerenciarRegistros: React.FC = () => {
  const { registros, loading, error } = useRegistros();
  const { editarOcorrencia } = useEditarOcorrenciaDoenca();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<RegistroResponseDTO | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<
    "aplicacao" | "reproducao" | "gestacao" | "parto" | "ocorrenciaDoenca" | null
  >(null);

  const items = useMemo(() => registros ?? [], [registros]);

  const getTipoRegistro = (r: RegistroResponseDTO):
    | "aplicacao"
    | "reproducao"
    | "gestacao"
    | "parto"
    | "ocorrenciaDoenca" => {
    if (r.aplicacao) return "aplicacao";
    if (r.reproducao) return "reproducao";
    if (r.gestacao) return "gestacao";
    if (r.parto) return "parto";
    if (r.ocorrenciaDoenca) return "ocorrenciaDoenca";
    return "aplicacao";
  };

  const filtered: RegistroResponseDTO[] = useMemo(() => {
    const query = normalize(q.trim());
    const df = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const dt = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return items
      .filter((r) => {
        if (df || dt) {
          const d = new Date(r.dataRegistro ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          r.funcionario?.nome ?? "",
          formatDate(r.dataRegistro, true),
          r.aplicacao?.id ?? "",
          r.reproducao?.id ?? "",
          r.gestacao?.id ?? "",
          r.parto?.id ?? "",
          r.ocorrenciaDoenca?.id ?? "",
        ].map((x) => normalize(String(x)));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataRegistro ?? "").getTime();
        const db = new Date(b.dataRegistro ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [items, q, dateFrom, dateTo]);

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

  const handleMarkCurado = async (ocorrencia: OcorrenciaDoencaResponseDTO) => {
    if (!ocorrencia?.id) return;
    if (
      !window.confirm(
        `Deseja marcar a ocorrência do ovino "${ocorrencia.ovino?.nome}" como curada?`
      )
    )
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

  if (loading) return <p>Carregando registros…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="registro-page">
      <div className="registro-header flex">
        <h2>Registros</h2>
        <Link to={`/dashboard/registros/cadastrar`}>
          <Button type="button" variant="cardPrimary">
            Novo Registro
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
        placeholder={`Buscar por funcionário, data ou ID...`}
      />

      <div className="registro-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="registro-empty">Nenhum registro encontrado.</div>
      ) : (
        <div className="registro-list">
          {pageItems.map((r) => {
            const tipo = getTipoRegistro(r);
            const entidade = r[tipo as keyof RegistroResponseDTO] as any;
            if (!entidade) return null;

            const handleView = () => {
              setSelected(r);
              setSelectedTipo(tipo);
            };

            switch (tipo) {
              case "aplicacao":
                return (
                  <AplicacaoCard
                    key={r.id}
                    aplicacao={entidade}
                    onView={handleView}
                  />
                );
              case "reproducao":
                return (
                  <ReproducaoCard
                    key={r.id}
                    reproducao={entidade}
                    onView={handleView}
                  />
                );
              case "gestacao":
                return (
                  <GestacaoCard
                    key={r.id}
                    gestacao={entidade}
                    onView={handleView}
                  />
                );
              case "parto":
                return (
                  <PartoCard key={r.id} parto={entidade} onView={handleView} />
                );
              case "ocorrenciaDoenca":
                return (
                  <OcorrenciaDoencaCard
                    key={r.id}
                    ocorrencia={entidade}
                    onView={handleView}
                    onMarkCurado={() => handleMarkCurado(entidade)}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="registro-pagination">
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
        <div className="registro-pagination">
          <Button
            type="button"
            variant="cardSecondary"
            onClick={() => setViewAll(false)}
          >
            Voltar à paginação
          </Button>
        </div>
      )}

      {selected && selectedTipo && (() => {
        const entidade = selected[selectedTipo as keyof RegistroResponseDTO] as any;
        switch (selectedTipo) {
          case "aplicacao":
            return (
              <AplicacaoDetalhes
                aplicacao={entidade}
                isVacina={!!entidade.medicamento?.isVacina}
                onClose={() => setSelected(null)}
              />
            );
          case "reproducao":
            return (
              <ReproducaoDetalhes
                reproducao={entidade}
                onClose={() => setSelected(null)}
              />
            );
          case "gestacao":
            return (
              <GestacaoDetalhes
                gestacao={entidade}
                onClose={() => setSelected(null)}
              />
            );
          case "parto":
            return (
              <PartoDetalhes
                parto={entidade}
                onClose={() => setSelected(null)}
              />
            );
          case "ocorrenciaDoenca":
            return (
              <OcorrenciaDoencaDetalhes
                ocorrencia={entidade}
                onClose={() => setSelected(null)}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default GerenciarRegistros;
