import React, { useMemo, useState } from "react";
import "./GerenciarDoencas.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import DoencaCard from "../../common/cards/doencaCard/DoencaCard";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";

import { useDoencas } from "../../../api/hooks/doenca/UseDoencas";

import type { Doenca } from "../../../api/models/doenca/DoencaModel";

interface GerenciarProps {
  searchQuery: string;
}

const Gerenciar: React.FC<GerenciarProps> = ({ searchQuery}) => {

  const { doencas, loading: loadingDoencas } = useDoencas();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loading = loadingDoencas;

  const filteredDoencas = useMemo(() => {
    if (!searchQuery) return doencas;
    return doencas.filter((d) =>
      [d.id.toString(), d.nome, d.descricao]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [doencas, searchQuery]);

  const data = filteredDoencas;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
        <div className="gerenciar-container-inside"> 
              {(currentData as Doenca[]).map((doenca) => (
                <DoencaCard
                  key={doenca.id}
                  nome={doenca.nome}
                  descricao={doenca.descricao}
                />
              ))}
              <OptionCard
                key="add-doenca"
                images={[{ src: Add, alt: "add" }]}
                text="Cadastrar"
                href="/dashboard/ovinos/doencas/criar"
                style={{ width: "250px", height: "390px" }}
              />
        </div>
      {!viewAll && data.length > itemsPerPage && (
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
    </div>
  );
};

export default Gerenciar;
