import React, { useEffect, useState } from "react";
import OvinoCard from "../ovinoCard/OvinoCard";
import "./GerenciarOvinos.css";
import OvinoService, { type Ovino } from "../../services/ovinoService";
import PaginationMenu from "../paginationMenu/PaginationMenu";
import OvinosViewAll from "../ovinosViewAll/OvinosViewAll";

const GerenciarOvinos: React.FC = () => {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(ovinos.length / itemsPerPage);

  const currentOvinos = ovinos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewAll = () => {
    setViewAll(!viewAll);
  };

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

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciarOvinos-container flex-column">
      {viewAll ? (
        <OvinosViewAll ovinos={ovinos} />
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
      {viewAll ? (
        <button
          className="paginationMenu-button"
          onClick={() => setViewAll(false)}
        >
          Ver menos
        </button>
      ) : (
        ovinos.length > itemsPerPage && (
          <PaginationMenu
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showViewAll
            onViewAll={handleViewAll}
          />
        )
      )}
    </div>
  );
};

export default GerenciarOvinos;
