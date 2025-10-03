import React, { useMemo, useState } from "react";
import "./GerenciarMedicamentos.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import MedicamentoCard from "../../common/cards/medicamentoCard/MedicamentoCard";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";

import { useMedicamentos } from "../../../api/hooks/medicamento/UseMedicamentos";

import type { Medicamento } from "../../../api/models/medicamento/MedicamentoModel";

interface GerenciarProps {
  searchQuery: string;
  isVacina: boolean;
}

const GerenciarMedicamentos: React.FC<GerenciarProps> = ({ searchQuery, isVacina }) => {
  const { medicamentos, loading: loadingMedicamentos } = useMedicamentos();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loading = loadingMedicamentos;

  const filteredMedicamentos = useMemo(() => {
    let list = medicamentos;


    list = list.filter((m) => m.isVacina === isVacina);

    if (searchQuery) {
      list = list.filter((m) =>
        [m.id.toString(), m.nome, m.fabricante]
          .filter(Boolean)
          .some((field) =>
            field!.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return list;
  }, [medicamentos, searchQuery, isVacina]);

  const data = filteredMedicamentos;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = viewAll ? data : data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      <h2>
        {isVacina ? "Vacinas" : "Medicamentos"}
      </h2>

      <div className="gerenciar-container-inside">
        {(currentData as Medicamento[]).map((medicamento) => (
          <MedicamentoCard
            key={medicamento.id}
            nome={medicamento.nome}
            fabricante={medicamento.fabricante}
            quantidadeDoses={medicamento.quantidadeDoses}
            intervaloDoses={medicamento.intervaloDoses}
            isVacina={medicamento.isVacina}
            doencas={medicamento.doencas}
          />
        ))}

        <OptionCard
          key="add-medicamento"
          images={[{ src: Add, alt: "add" }]}
          text={`Cadastrar ${isVacina ? "Vacina" : "Medicamento"}`}
          href={`/dashboard/ovinos/${isVacina ? "vacinas" : "medicamentos"}/criar`}
          style={{ width: "250px", height: "420px" }}
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

export default GerenciarMedicamentos;
