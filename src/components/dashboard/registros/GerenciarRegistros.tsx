import React, { useEffect, useMemo, useState } from "react";
import "./GerenciarRegistros.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";

import { useRegistros } from "../../../api/hooks/registro/UseRegistros";
import { useEditarOcorrenciaDoenca } from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";

import type { RegistroResponseDTO } from "../../../api/dtos/registro/RegistroResponseDTO";
import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";

import { formatDate } from "../../../utils/formatDate";
import { formatEnum } from "../../../utils/formatEnum";
import { getRegistroStatusByEntityId } from "../../../utils/getRegistroStatusById";
import { toast } from "react-toastify";

import AplicacaoCard from "../../common/cards/registrosCard/AplicacaoCard";
import ReproducaoCard from "../../common/cards/registrosCard/ReproducaoCard";
import GestacaoCard from "../../common/cards/registrosCard/GestacaoCard";
import PartoCard from "../../common/cards/registrosCard/PartoCard";
import OcorrenciaDoencaCard from "../../common/cards/registrosCard/OcorrenciaDoencaCard";
import PesagemCard from "../../common/cards/registrosCard/PesagemCard";

import AplicacaoDetalhes from "../aplicacoes/AplicacaoDetalhes";
import ReproducaoDetalhes from "../reproducoes/ReproducoesDetalhes";
import GestacaoDetalhes from "../gestacoes/GestacaoDetalhes";
import PartoDetalhes from "../partos/PartoDetalhes";
import OcorrenciaDoencaDetalhes from "../ocorrenciaDoencas/OcorrenciaDoencaDetalhes";
import PesagemDetalhes from "../pesagens/PesagemDetalhes";

import NovoRegistroMenu from "./NovoRegistroMenu";
import { updateRegistroSugestao } from "../../../utils/updateRegistroSugestao";
import { useLocation } from "react-router-dom";


function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 6;


const GerenciarRegistros: React.FC = () => {
  const { registros, setRegistros, loading, error } = useRegistros();
  const { editarOcorrencia } = useEditarOcorrenciaDoenca();
  const { ovinos } = useOvinos();
  const location = useLocation();

  const [q, setQ] = useState(() =>
    location.state?.search ? String(location.state.search) : ""
  );

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [funcionario, setFuncionario] = useState("TODOS");

  const [status, setStatus] = useState<"TODOS" | "CONFIRMADO" | "NAO_CONFIRMADO">("TODOS");
  const [tipo, setTipo] = useState("TODOS");

  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const [selected, setSelected] = useState<RegistroResponseDTO | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<
    "aplicacao" | "reproducao" | "gestacao" | "parto" | "ocorrenciaDoenca" | "pesagem" | null
  >(null);

  const [menuAberto, setMenuAberto] = useState(false);
  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (location.state?.search) {
      setQ(String(location.state.search));
      window.history.replaceState({}, "", "");
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.funcionario) {
      setFuncionario(location.state.funcionario);
      setPage(1);
      window.history.replaceState({}, "", "");
    }
  }, [location.state]);

  const items = useMemo(() => registros ?? [], [registros]);

  const getTipoRegistro = (r: RegistroResponseDTO) => {
    if (r.aplicacao) return "aplicacao";
    if (r.reproducao) return "reproducao";
    if (r.gestacao) return "gestacao";
    if (r.parto) return "parto";
    if (r.ocorrenciaDoenca) return "ocorrenciaDoenca";
    if (r.pesagem) return "pesagem";
    return "aplicacao";
  };

  useEffect(() => {
    if (!items.length) return;

    const fetchStatuses = async () => {
      const statusMap: Record<number, boolean> = {};

      for (const r of items) {
        const tipo = getTipoRegistro(r);
        const entidade = r[tipo as keyof RegistroResponseDTO] as any;
        if (!entidade?.id) continue;

        const status = await getRegistroStatusByEntityId(entidade.id, tipo);
        statusMap[r.idRegistro] = status === false;
      }

      setRegistroStatus(statusMap);
    };

    fetchStatuses();
  }, [items]);


  const handleConfirm = async (r: RegistroResponseDTO) => {
    const ok = await updateRegistroSugestao(r);
    if (!ok) return;

    toast.success("Registro confirmado!");

    setRegistroStatus((prev) => ({ ...prev, [r.idRegistro]: true }));

    setRegistros((prev) =>
      prev.map((x) =>
        x.idRegistro === r.idRegistro ? { ...x, isSugestao: false } : x
      )
    );
  };

  const funcionarioOptions = useMemo(() => {
    const nomes = registros
      ?.map((r) => r.funcionario?.nome)
      .filter((n) => !!n) as string[];

    const unique = Array.from(new Set(nomes));

    return unique.map((nome) => ({
      value: nome,
      label: nome,
    }));
  }, [registros]);


  const filtered = useMemo(() => {
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

        if (funcionario !== "TODOS") {
          const n1 = normalize(r.funcionario?.nome ?? "");
          const n2 = normalize(funcionario);
          if (n1 !== n2) return false;
        }
        if (status === "CONFIRMADO" && r.isSugestao) return false;
        if (status === "NAO_CONFIRMADO" && !r.isSugestao) return false;

        const tipoRegistro = getTipoRegistro(r);
        if (tipo !== "TODOS" && tipoRegistro !== tipo) return false;

        if (!query) return true;

        const ovinoAssociado =
          r.aplicacao?.ovino ??
          r.reproducao?.ovelha ??
          r.reproducao?.carneiro ??
          r.gestacao?.ovelhaMae ??
          r.gestacao?.ovelhaPai ??
          r.parto?.mae ??
          r.parto?.pai ??
          r.ocorrenciaDoenca?.ovino ??
          r.pesagem?.ovino ??
          null;

        const campos = [
          r.funcionario?.nome ?? "",
          formatDate(r.dataRegistro, true),
          ovinoAssociado?.nome ?? "",
          ovinoAssociado?.raca ?? "",
          ovinoAssociado?.rfid ?? "",
        ].map((x) => normalize(String(x)));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataRegistro ?? "").getTime();
        const db = new Date(b.dataRegistro ?? "").getTime();
        return db - da;
      });
  }, [items, q, dateFrom, dateTo, funcionario, status, tipo]);


  const totalPages = viewAll
    ? 1
    : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const currentPage = viewAll ? 1 : page;

  const pageItems = viewAll
    ? filtered
    : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);


  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setFuncionario("TODOS");
    setStatus("TODOS");
    setTipo("TODOS");
    setPage(1);
    setViewAll(false);
  };

  const handleMarkCurado = async (ocorrencia: OcorrenciaDoencaResponseDTO) => {
    if (!ocorrencia?.id) return;

    if (!window.confirm(`Deseja marcar a ocorrência como curada?`)) return;

    try {
      await editarOcorrencia(ocorrencia.id, {
        ovinoId: ocorrencia.ovino?.id ?? null,
        doencaId: ocorrencia.doenca?.id ?? null,
        dataInicio: ocorrencia.dataInicio ?? "",
        dataFinal: new Date().toISOString(),
        curado: true,
      });

      toast.success("Ocorrência marcada como curada!");
    } catch {
      toast.error("Erro ao atualizar ocorrência.");
    }
  };


  if (loading) return <p>Carregando registros…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="registro-page">

      <div className="registro-header flex">
        <Button
          type="button"
          variant="cardPrimary"
          onClick={() => setMenuAberto(true)}
        >
          Novo Registro
        </Button>
      </div>

      <FilterBar
        q={q}
        setQ={setQ}
        clearFilters={clearFilters}
        setPage={setPage}
        setViewAll={setViewAll}
        placeholder="Buscar por RFID, nome, funcionário, data..."
        status={status}
        setStatus={setStatus}
        funcionario={funcionario}
        setFuncionario={setFuncionario}
        funcionarioOptions={funcionarioOptions}
        tipo={tipo}
        setTipo={setTipo}
        typeLabel="Tipo de Registro"
        typeOptions={[
          { value: "aplicacao", label: "Aplicações" },
          { value: "reproducao", label: "Reproduções" },
          { value: "gestacao", label: "Gestações" },
          { value: "parto", label: "Partos" },
          { value: "ocorrenciaDoenca", label: "Ocorrências de Doença" },
          { value: "pesagem", label: "Pesagens" },
        ]}
        allOptionLabel="Todos"
        allOptionValue="TODOS"
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
            const tipoR = getTipoRegistro(r);
            let entidade = r[tipoR as keyof RegistroResponseDTO] as any;

            if (!entidade) return null;

            if (tipoR === "pesagem") {
              const ov =
                ovinos?.find((o) => o.id === entidade.ovino?.id) ?? entidade.ovino;

              entidade = {
                ...entidade,
                ovinoNome: ov?.nome ?? `#${ov?.id ?? "-"}`,
                racaNome: ov?.raca ? formatEnum(ov.raca) : "—",
              };
            }

            const view = () => {
              setSelected(r);
              setSelectedTipo(tipoR);
            };

            const confirm = () => handleConfirm(r);

            switch (tipoR) {
              case "aplicacao":
                return (
                  <AplicacaoCard
                    key={r.idRegistro}
                    aplicacao={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onConfirm={confirm}
                  />
                );

              case "reproducao":
                return (
                  <ReproducaoCard
                    key={r.idRegistro}
                    reproducao={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onConfirm={confirm}
                  />
                );

              case "gestacao":
                return (
                  <GestacaoCard
                    key={r.idRegistro}
                    gestacao={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onConfirm={confirm}
                  />
                );

              case "parto":
                return (
                  <PartoCard
                    key={r.idRegistro}
                    parto={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onConfirm={confirm}
                  />
                );

              case "ocorrenciaDoenca":
                return (
                  <OcorrenciaDoencaCard
                    key={r.idRegistro}
                    ocorrencia={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onMarkCurado={() => handleMarkCurado(entidade)}
                    onConfirm={confirm}
                  />
                );

              case "pesagem":
                return (
                  <PesagemCard
                    key={r.idRegistro}
                    pesagem={entidade}
                    confirmado={registroStatus[r.idRegistro] ?? !r.isSugestao}
                    onView={view}
                    onConfirm={confirm}
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

          case "pesagem":
            return (
              <PesagemDetalhes
                pesagem={entidade}
                onClose={() => setSelected(null)}
              />
            );

          default:
            return null;
        }
      })()}

      {menuAberto && <NovoRegistroMenu onClose={() => setMenuAberto(false)} />}
    </div>
  );
};

export default GerenciarRegistros;
