import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GerenciarReproducoes.css";

import Button from "../../common/buttons/Button";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import { useReproducoes } from "../../../api/hooks/reproducao/UseReproducoes";
import { useRegistros } from "../../../api/hooks/registro/UseRegistros";

import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";

import FilterBar from "../../common/filter-bar/FilterBar";
import ReproducaoDetalhes from "./ReproducoesDetalhes";
import ReproducaoCard from "../../common/cards/registrosCard/ReproducaoCard";

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

type ReproducaoUI = ReproducaoResponseDTO & {
  carneiroNome: string;
  carneiroFbb: string;
  carneiroRfid: string | number;
  ovelhaNome: string;
  ovelhaFbb: string;
  ovelhaRfid: string | number;
};

const GerenciarReproducoes: React.FC = () => {
  const { reproducoes, loading, error } = useReproducoes();
  const { registros, setRegistros } = useRegistros();

  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("TODOS");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedRepro, setSelectedRepro] = useState<ReproducaoUI | null>(null);

  const [registroStatus, setRegistroStatus] = useState<Record<number, boolean>>(
    {}
  );

  const reprosHydrated: ReproducaoUI[] = useMemo(() => {
    if (!reproducoes) return [];

    return reproducoes.map((r) => ({
      ...r,
      carneiroNome: r.carneiro?.nome ?? "—",
      carneiroFbb: r.carneiro?.fbb ?? "—",
      carneiroRfid: r.carneiro?.rfid ?? "—",
      ovelhaNome: r.ovelha?.nome ?? "—",
      ovelhaFbb: r.ovelha?.fbb ?? "—",
      ovelhaRfid: r.ovelha?.rfid ?? "—",
    }));
  }, [reproducoes]);

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
    if (!reprosHydrated.length || !registros) return;

    const map: Record<number, boolean> = {};

    for (const r of reprosHydrated) {
      const reg = registros.find((x) => x.reproducao?.id === r.id);
      if (!reg) continue;

      map[reg.idRegistro] = !reg.isSugestao;
    }

    setRegistroStatus(map);
  }, [reprosHydrated, registros]);

  const handleConfirm = async (reproducao: ReproducaoUI) => {
    if (!registros) return;

    const reg = registros.find((r) => r.reproducao?.id === reproducao.id);
    if (!reg) {
      toast.error("Registro não encontrado para esta reprodução.");
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

    return reprosHydrated
      .filter((r) => {
        if (tipo !== "TODOS" && r.enumReproducao !== (tipo as TypeReproducao))
          return false;

        if (df || dt) {
          const d = new Date(r.dataReproducao ?? "");
          if (Number.isNaN(d.getTime())) return false;
          if (df && d < df) return false;
          if (dt && d > dt) return false;
        }

        if (!query) return true;

        const campos = [
          String(r.id),
          r.enumReproducao,
          r.carneiroNome,
          r.carneiroFbb,
          String(r.carneiroRfid),
          r.ovelhaNome,
          r.ovelhaFbb,
          String(r.ovelhaRfid),
          formatDate(r.dataReproducao, true),
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      })
      .sort((a, b) => {
        const da = new Date(a.dataReproducao ?? "").getTime();
        const db = new Date(b.dataReproducao ?? "").getTime();
        return db - da;
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
        placeholder="Buscar por id, pai/mãe, FBB, RFID, observações…"
      />

      <div className="repros-counter">
        Mostrando <strong>{pageItems.length}</strong> de{" "}
        <strong>{filtered.length}</strong> resultado(s).
      </div>

      {pageItems.length === 0 ? (
        <div className="repros-empty">Nenhuma reprodução encontrada.</div>
      ) : (
        <div className="repros-list">
          {pageItems.map((r) => {
            const reg = registros?.find((x) => x.reproducao?.id === r.id);

            const confirmado = reg
              ? registroStatus[reg.idRegistro] ?? !reg.isSugestao
              : false;

            return (
              <ReproducaoCard
                key={r.id}
                reproducao={r}
                confirmado={confirmado}
                onView={() => setSelectedRepro(r)}
                onConfirm={() => handleConfirm(r)}
              />
            );
          })}
        </div>
      )}

      {!viewAll && totalPages > 1 && (
        <div className="repros-pagination">
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
