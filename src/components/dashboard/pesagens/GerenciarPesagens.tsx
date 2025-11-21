import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarPesagens.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import FilterBar from "../../common/filter-bar/FilterBar";

import { usePesagens } from "../../../api/hooks/pesagem/UsePesagens";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useRegistros } from "../../../api/hooks/registro/UseRegistros";

import PesagemDetalhes from "./PesagemDetalhes";
import PesagemCard from "../../common/cards/registrosCard/PesagemCard";

import type { PesagemResponseDTO } from "../../../api/dtos/pesagem/PesagemResponseDTO";

import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";
import { updateRegistroSugestao } from "../../../utils/updateRegistroSugestao";
import { toast } from "react-toastify";

function normalize(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const PAGE_SIZE = 5;

type PesagemUI = PesagemResponseDTO & {
  ovinoNome?: string;
  racaNome?: string;
};

const GerenciarPesagens: React.FC = () => {
  const { pesagens, loading, error } = usePesagens();
  const { ovinos } = useOvinos();
  const { registros, setRegistros } = useRegistros();

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<PesagemUI | null>(null);

  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>({});

  const hydrated: PesagemUI[] = useMemo(() => {
    if (!pesagens || !ovinos) return [];

    return pesagens.map((p) => {
      const ov = ovinos.find((o) => o.id === p.ovino?.id) ?? p.ovino;

      return {
        ...p,
        ovinoNome: ov?.nome ?? `#${ov?.id ?? "-"}`,
        racaNome: ov?.raca ? formatEnum(ov.raca) : "—",
      };
    });
  }, [pesagens, ovinos]);

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
    if (!hydrated.length || !registros) return;

    const map: Record<number, boolean> = {};

    for (const p of hydrated) {
      const reg = registros.find((r) => r.pesagem?.id === p.id);
      if (!reg) continue;

      map[reg.idRegistro] = !reg.isSugestao;
    }

    setRegistroStatus(map);
  }, [hydrated, registros]);


  const handleConfirm = async (pesagem: PesagemResponseDTO) => {
    if (!registros) return;

    const reg = registros.find((r) => r.pesagem?.id === pesagem.id);
    if (!reg) {
      toast.error("Registro não encontrado para esta pesagem.");
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

    return hydrated
      .filter((p) => {
        if (df || dt) {
          const d = new Date(p.dataPesagem ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          String(p.id ?? ""),
          p.ovinoNome ?? "",
          p.racaNome ?? "",
          String(p.peso ?? ""),
          formatDate(p.dataPesagem, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataPesagem ?? "").getTime();
        const db = new Date(b.dataPesagem ?? "").getTime();
        return (db || 0) - (da || 0);
      });
  }, [hydrated, q, dateFrom, dateTo]);

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
        placeholder="Buscar por ID, ovino, raça, peso…"
      />

      <div className="pesagens-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="pesagens-empty">Nenhuma pesagem encontrada.</div>
      ) : (
        <div className="pesagens-list">
          {pageItems.map((p) => {
            const reg = registros?.find((r) => r.pesagem?.id === p.id);

            const confirmado = reg
              ? (registroStatus[reg.idRegistro] ?? !reg.isSugestao)
              : false;

            return (
              <PesagemCard
                key={p.id}
                pesagem={p}
                confirmado={confirmado}
                onView={() => setSelected(p)}
                onConfirm={() => handleConfirm(p)}
              />
            );
          })}
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

      {selected && (
        <PesagemDetalhes pesagem={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default GerenciarPesagens;
