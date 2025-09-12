import React, { useEffect, useMemo, useState } from "react";
import "./Gerenciar.css";
import OvinoService from "../../../api/services/ovino/OvinoService";
import type {Ovino} from "../../../api/models/ovino/Ovino";
import type { Criador } from "../../../api/models/criador/CriadorModel";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OvinoCard from "../../common/cards/ovinoCard/OvinoCard";
import CriadorCard from "../../common/cards/criadorCard/CriadorCard";
import OvinoListSheet from "./ovinoListSheet/OvinoListSheet";
import CriadorListSheet from "./criadorListSheet/CriadorListSheet";
import CriadorService from "../../../api/services/criador/CriadorService";

interface GerenciarProps {
  searchQuery: string;
  type: "ovino" | "criador";
}

const Gerenciar: React.FC<GerenciarProps> = ({ searchQuery, type }) => {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [criadores, setCriadores] = useState<Criador[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "ovino") {
          const data = await OvinoService.getAll();
          setOvinos(data);
        } else if (type === "criador") {
          const data = await CriadorService.getAll();
          setCriadores(data);
        }
      } catch (error) {
        console.error(`Erro ao carregar ${type}`, error);
        console.log(localStorage.getItem("token"))
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const filteredOvinos = useMemo(() => {
    if (!searchQuery) return ovinos;
    return ovinos.filter((o) =>
      [o.id?.toString(), o.fbb, o.nome, o.raca, o.sexo]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [ovinos, searchQuery]);

  const filteredCriadores = useMemo(() => {
    if (!searchQuery) return criadores;
    return criadores.filter((c) =>
      [c.id?.toString(), c.cpfCnpj, c.endereco, c.nome, c.telefone]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [criadores, searchQuery]);

  const data = type === "ovino" ? filteredOvinos : filteredCriadores;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      {viewAll ? (
        type === "ovino" ? (
          <OvinoListSheet ovinos={filteredOvinos} />
        ) : (
          <CriadorListSheet criadores={filteredCriadores}/>
        )
      ) : (
        <div className="gerenciar-container-inside">
          {type === "ovino"
            ? (currentData as Ovino[]).map((ovino, index) => (
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
              ))
            : (currentData as Criador[]).map((criador) => (
                <CriadorCard
                  key={criador.id}
                  id={criador.id}
                  cpfCnpj={criador.cpfCnpj}
                  endereco={criador.endereco}
                  nome={criador.nome}
                  telefone={criador.telefone}
                />
              ))}
        </div>
      )}

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
