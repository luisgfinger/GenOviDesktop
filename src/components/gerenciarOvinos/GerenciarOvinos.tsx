import React, { useEffect, useMemo, useState } from "react";
import OvinoCard from "../ovinoCard/OvinoCard";
import "./GerenciarOvinos.css";
import OvinoService, { type Ovino } from "../../services/ovinoService";
import PaginationMenu from "../paginationMenu/PaginationMenu";
import OvinoListSheet from "../ovinoListSheet/OvinoListSheet";

interface GerenciarOvinosProps {
  searchQuery: string;
}

const GerenciarOvinos: React.FC<GerenciarOvinosProps> = ({ searchQuery }) => {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOvinos = async () => {
      try {
        const data = await OvinoService.getAll();
        setOvinos(data);
      } catch (error) {
        console.error("Erro ao carregar ovinos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOvinos();
  }, []);

  const filteredOvinos = useMemo(() => {
    if (!searchQuery) return ovinos;
    return ovinos.filter((o) =>
      [o.id?.toString(), o.fbb, o.nome, o.raca, o.sexo]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [ovinos, searchQuery]);

  const totalPages = Math.ceil(filteredOvinos.length / itemsPerPage);
  const currentOvinos = filteredOvinos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciarOvinos-container flex-column">
      {viewAll ? (
        <OvinoListSheet ovinos={filteredOvinos} />
      ) : (
        <div className="gerenciarOvinos-container-inside">
          {currentOvinos.map((ovino, index) => (
            <OvinoCard
              key={ovino.id || `${index}-${ovino.nome}`}
              imagem={ovino.imagem}
              nome={ovino.nome}
              sexo={ovino.sexo}
              fbb={ovino.fbb}
              raca={ovino.raca}
              pai={ovino.pai}
              mae={ovino.mae}
              pureza={ovino.pureza}
            />
          ))}
        </div>
      )}
      {!viewAll && filteredOvinos.length > itemsPerPage && (
        <PaginationMenu
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showViewAll
          onViewAll={() => setViewAll(!viewAll)}
        />
      )}
      {viewAll && (
        <button className="paginationMenu-button" onClick={() => setViewAll(false)}>
          Ver menos
        </button>
      )}
    </div>
  );
};

export default GerenciarOvinos;
