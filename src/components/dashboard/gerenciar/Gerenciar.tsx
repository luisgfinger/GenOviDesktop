import React, { useEffect, useMemo, useState } from "react";
import "./Gerenciar.css";
import OvinoService from "../../../api/services/ovino/OvinoService";
import type { Ovino } from "../../../api/models/ovino/Ovino";
import type { Funcionario } from "../../../api/models/funcionario/FuncionarioModel";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OvinoCard from "../../common/cards/ovinoCard/OvinoCard";
import FuncionarioCard from "../../common/cards/funcionarioCard/FuncionarioCard";
import OvinoListSheet from "./ovinoListSheet/OvinoListSheet";
import FuncionarioListSheet from "./FuncionarioListSheet/FuncionarioListSheet";
import FuncionarioService from "../../../api/services/funcionario/FuncionarioService";

interface GerenciarProps {
  searchQuery: string;
  type: "ovino" | "funcionario";
}

const Gerenciar: React.FC<GerenciarProps> = ({ searchQuery, type }) => {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
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
        } else if (type === "funcionario") {
          const data = await FuncionarioService.getAll();
          setFuncionarios(data);
        }
      } catch (error) {
        console.error(`Erro ao carregar ${type}`, error);
        console.log(localStorage.getItem("token"));
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

  const filteredFuncionarios = useMemo(() => {
    if (!searchQuery) return funcionarios;
    return funcionarios.filter((c) =>
      [c.id?.toString(), c.cpfCnpj, c.endereco, c.nome, c.telefone]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [funcionarios, searchQuery]);

  const data = type === "ovino" ? filteredOvinos : filteredFuncionarios;
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
          <FuncionarioListSheet funcionarios={filteredFuncionarios} />
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
            : (currentData as Funcionario[]).map((funcionario) => (
                <FuncionarioCard
                  key={funcionario.id}
                  id={funcionario.id}
                  cpfCnpj={funcionario.cpfCnpj}
                  endereco={funcionario.endereco}
                  nome={funcionario.nome}
                  telefone={funcionario.telefone}
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
