import React, { useMemo, useState } from "react";
import "./GerenciarMedicamentos.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import MedicamentoCard from "../../common/cards/medicamentoCard/MedicamentoCard";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";
import { toast } from "react-toastify";

import {
  useMedicamentos,
  useRemoverMedicamento,
} from "../../../api/hooks/medicamento/UseMedicamentos";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";
import MedicamentoDetalhes from "./MedicamentoDetalhes";

interface GerenciarProps {
  searchQuery: string;
  isVacina: boolean;
}

const GerenciarMedicamentos: React.FC<GerenciarProps> = ({
  searchQuery,
  isVacina,
}) => {
  const { medicamentos, loading: loadingMedicamentos } = useMedicamentos();
  const { removerMedicamento } = useRemoverMedicamento();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedicamento, setSelectedMedicamento] =
    useState<MedicamentoResponseDTO | null>(null);

  const itemsPerPage = 6;

  const filteredMedicamentos = useMemo(() => {
    let list = medicamentos.filter((m) => m.isVacina === isVacina);

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

  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const currentData = viewAll
    ? filteredMedicamentos
    : filteredMedicamentos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handleEdit = (id: number) => {
    const med = medicamentos.find((m) => m.id === id);
    if (med) setSelectedMedicamento(med);
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover este item?")) return;

    try {
      await removerMedicamento(id);
      toast.success("🗑️ Removido com sucesso!");
      window.location.reload();
    } catch {
      toast.error("❌ Erro ao remover o item.");
    }
  };

  if (loadingMedicamentos) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      <h2>{isVacina ? "Vacinas" : "Medicamentos"}</h2>

      <div className="gerenciar-container-inside">
        {currentData.map((m) => (
          <MedicamentoCard
            key={m.id}
            id={m.id}
            nome={m.nome}
            fabricante={m.fabricante}
            quantidadeDoses={m.quantidadeDoses}
            intervaloDoses={m.intervaloDoses}
            isVacina={m.isVacina}
            doencas={m.doencas}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}

        <OptionCard
          key="add-medicamento"
          images={[{ src: Add, alt: "add" }]}
          text={`Cadastrar ${isVacina ? "Vacina" : "Medicamento"}`}
          href={`/dashboard/ovinos/${
            isVacina ? "vacinas" : "medicamentos"
          }/criar`}
          style={{ width: "250px", height: "380px" }}
        />
      </div>

      {!viewAll && filteredMedicamentos.length > itemsPerPage && (
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

      {selectedMedicamento && (
        <MedicamentoDetalhes
          medicamento={selectedMedicamento}
          onClose={() => setSelectedMedicamento(null)}
        />
      )}
    </div>
  );
};

export default GerenciarMedicamentos;
