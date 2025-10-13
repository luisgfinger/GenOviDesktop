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
import FilterBar from "../../common/filter-bar/FilterBar";

interface GerenciarMedicamentosProps {
  isVacina: boolean;
}

const GerenciarMedicamentos: React.FC<GerenciarMedicamentosProps> = ({
  isVacina,
}) => {
  const { medicamentos, loading: loadingMedicamentos } = useMedicamentos();
  const { removerMedicamento } = useRemoverMedicamento();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] =
    useState<MedicamentoResponseDTO | null>(null);

  const itemsPerPage = 6;

  const normalize = (s?: string) =>
    (s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredMedicamentos = useMemo(() => {
    const query = normalize(q.trim());

    let list = medicamentos.filter((m) => m.isVacina === isVacina);

    if (query) {
      list = list.filter((m) => {
        const campos = [
          m.id?.toString() ?? "",
          m.nome ?? "",
          m.fabricante ?? "",
        ].map((x) => normalize(x));

        return campos.some((c) => c.includes(query));
      });
    }

    return list.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [medicamentos, q, isVacina]);

  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const currentPage = viewAll ? 1 : Math.min(page, totalPages);
  const currentData = viewAll
    ? filteredMedicamentos
    : filteredMedicamentos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const clearFilters = () => {
    setQ("");
    setPage(1);
    setViewAll(false);
  };

  const handleEdit = (id: number) => {
    const med = medicamentos.find((m) => m.id === id);
    if (med) setSelectedMedicamento(med);
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover este item?")) return;

    try {
      await removerMedicamento(id);
      toast.success("Removido com sucesso!");
    } catch {
      toast.error("Erro ao remover o item.");
    }
  };

  if (loadingMedicamentos) return <p>Carregando...</p>;

  return (
    <div className="gerenciarMedicamentos-container flex-column">
      <h2>{isVacina ? "Vacinas" : "Medicamentos"}</h2>

      <FilterBar
        q={q}
        setQ={setQ}
        clearFilters={clearFilters}
        setPage={setPage}
        setViewAll={setViewAll}
        placeholder={`Buscar por nome, fabricante ou ID...`}
      />

      <div className="gerenciarMedicamentos-container-inside">
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
