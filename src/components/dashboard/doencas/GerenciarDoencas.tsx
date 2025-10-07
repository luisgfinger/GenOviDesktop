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

interface GerenciarDoencasProps {
  searchQuery: string;
}

const GerenciarDoencas: React.FC<GerenciarDoencasProps> = ({ searchQuery }) => {
  const { doencas, loading: loadingDoencas } = useDoencas();
  const { removerDoenca } = useRemoverDoenca();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoenca, setSelectedDoenca] =
    useState<DoencaResponseDTO | null>(null);

  const itemsPerPage = 6;

  const filteredDoencas = useMemo(() => {
    let list = doencas;

    if (searchQuery) {
      list = list.filter((d) =>
        [d.id.toString(), d.nome, d.descricao]
          .filter(Boolean)
          .some((field) =>
            field!.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return list;
  }, [doencas, searchQuery]);

  const totalPages = Math.ceil(filteredDoencas.length / itemsPerPage);
  const currentData = viewAll
    ? filteredDoencas
    : filteredDoencas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handleEdit = (id: number) => {
    const d = doencas.find((doenca) => doenca.id === id);
    if (d) setSelectedDoenca(d);
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover esta doença?")) return;

    try {
      await removerDoenca(id);
      toast.success("🗑️ Doença removida com sucesso!");
      window.location.reload();
    } catch {
      toast.error("❌ Erro ao remover a doença.");
    }
  };

  if (loadingDoencas) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      <h2>Doenças</h2>

      <div className="gerenciar-container-inside">
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
          style={{ width: "250px", height: "250px" }}
        />
      </div>

      {!viewAll && filteredDoencas.length > itemsPerPage && (
        <PaginationMenu
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showViewAll
          onViewAll={() => setViewAll(!viewAll)}
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
