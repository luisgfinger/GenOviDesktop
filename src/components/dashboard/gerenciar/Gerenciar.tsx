import React, { useEffect, useMemo, useState } from "react";
import "./Gerenciar.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OvinoCard from "../../common/cards/ovinoCard/OvinoCard";
import FuncionarioCard from "../../common/cards/funcionarioCard/FuncionarioCard";
import OvinoListSheet from "./ovinoListSheet/OvinoListSheet";
import FuncionarioListSheet from "./FuncionarioListSheet/FuncionarioListSheet";

import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { Funcionario } from "../../../api/models/funcionario/FuncinarioModel";
import { mockOvinos } from "../../../mockData/MockOvinos";
import { mockFuncionarios } from "../../../mockData/mockFuncionarios";
import OptionCard from "../../common/cards/optionCard/OptionCard";

import Add from "../../../assets/icons/add.png";

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

  /*
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

  */

  useEffect(() => {
    if (type === "ovino") {
      setOvinos(mockOvinos);
    } else {
      setFuncionarios(mockFuncionarios);
    }
    setLoading(false);
  }, [type]);

  const filteredOvinos = useMemo(() => {
    if (!searchQuery) return ovinos;
    return ovinos.filter((o) =>
      [o.id.toString(), o.fbb, o.nome, o.raca, o.sexo]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [ovinos, searchQuery]);

  const filteredFuncionarios = useMemo(() => {
    if (!searchQuery) return funcionarios;
    return funcionarios.filter((c) =>
      [c.id.toString(), c.cpfCnpj, c.endereco, c.nome, c.telefone]
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
    ? (currentData as Ovino[]).map((ovino, index) => {
  
        if (index === currentData.length - 1) {
          return (
            <OptionCard
              key="add-card"
              images={[{ src: Add, alt: "add" }]}
              text="Cadastrar"
              href="#"
              style={{ width: "250px", height: "310px" }} 
            />
          );
        }

        return (
          <OvinoCard
            key={ovino.id}
            nome={ovino.nome}
            sexo={ovino.sexo}
            fbb={ovino.fbb ?? "Não informado"}
            raca={ovino.raca}
            pai={ovino.rfidPai ?? "Não informado"}
            mae={ovino.rfidMae ?? "Não informado"}
            pureza={ovino.grauPureza}
          />
        );
      })
    : (currentData as Funcionario[]).map((funcionario, index) => {
        if (index === currentData.length - 1) {
          return (
            <OptionCard
              key="add-card"
              images={[{ src: Add, alt: "add" }]}
              text="Cadastrar"
              href="/dashboard/funcionarios/cadastrar"
             style={{ width: "250px", height: "310px" }}
            />
          );
        }

        return (
          <FuncionarioCard
            key={funcionario.id}
            nome={funcionario.nome}
            endereco={funcionario.endereco}
            telefone={funcionario.telefone}
            cpfCnpj={funcionario.cpfCnpj}
            dataAdmissao={funcionario.dataAdmissao}
          />
        );
      })}
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
