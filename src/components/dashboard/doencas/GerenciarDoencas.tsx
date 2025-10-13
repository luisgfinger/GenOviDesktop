import React, { useMemo, useState } from "react";
import "./GerenciarDoencas.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import DoencaCard from "../../common/cards/doencaCard/DoencaCard";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";
import { toast } from "react-toastify";

import {
  useDoencas,
  useRemoverDoenca,
} from "../../../api/hooks/doenca/UseDoencas";
import type { DoencaResponseDTO } from "../../../api/dtos/doenca/DoencaResponseDTO";
import DoencaDetalhes from "./DoencaDetalhes";
import FilterBar from "../../common/filter-bar/FilterBar";

const GerenciarDoencas: React.FC = () => {
  const { doencas, loading: loadingDoencas } = useDoencas();
  const { removerDoenca } = useRemoverDoenca();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedDoenca, setSelectedDoenca] =
    useState<DoencaResponseDTO | null>(null);

  const itemsPerPage = 6;

  const normalize = (s?: string) =>
    (s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredDoencas = useMemo(() => {
    const query = normalize(q.trim());
    if (!query) return doencas;

    return doencas.filter((d) => {
      const campos = [
        d.id.toString(),
        d.nome ?? "",
        d.descricao ?? "",
      ].map((x) => normalize(x));

      return campos.some((c) => c.includes(query));
    });
  }, [doencas, q]);

  const totalPages = Math.ceil(filteredDoencas.length / itemsPerPage);
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const currentData = viewAll
    ? filteredDoencas
    : filteredDoencas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const clearFilters = () => {
    setQ("");
    setPage(1);
    setViewAll(false);
  };

  const handleEdit = (id: number) => {
    const d = doencas.find((doenca) => doenca.id === id);
    if (d) setSelectedDoenca(d);
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover esta doença?")) return;

    try {
      await removerDoenca(id);
      toast.success("Doença removida com sucesso!");
    } catch {
      toast.error("Erro ao remover a doença.");
    }
  };

  if (loadingDoencas) return <p>Carregando...</p>;

  return (
    <div className="gerenciarDoencas-container flex-column">
      <h2>Doenças</h2>
      <FilterBar
        q={q}
        setQ={setQ}
        clearFilters={clearFilters}
        setPage={setPage}
        setViewAll={setViewAll}
        placeholder="Buscar por nome, descrição ou ID..."
      />

      <div className="gerenciarDoencas-container-inside">
        {currentData.map((d) => (
          <DoencaCard
            key={d.id}
            id={d.id}
            nome={d.nome}
            descricao={d.descricao}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}

        <OptionCard
          key="add-doenca"
          images={[{ src: Add, alt: "add" }]}
          text="Cadastrar Doença"
          href="/dashboard/ovinos/doencas/criar"
          style={{ width: "300px", height: "250px" }}
        />
      </div>

      {!viewAll && filteredDoencas.length > itemsPerPage && (
        <PaginationMenu
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          showViewAll
          onViewAll={() => setViewAll(true)}
        />
      )}

      {viewAll && (
        <button
          className="paginationMenu-button"
          onClick={() => setViewAll(false)}
        >
          Ver menos
        </button>
      )}

      {selectedDoenca && (
        <DoencaDetalhes
          doenca={selectedDoenca}
          onClose={() => setSelectedDoenca(null)}
        />
      )}
    </div>
  );
};

export default GerenciarDoencas;
