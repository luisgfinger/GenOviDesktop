import React, { useMemo, useState } from "react";
import "./Gerenciar.css";
import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OvinoCard from "../../common/cards/ovinoCard/OvinoCard";
import FuncionarioCard from "../../common/cards/funcionarioCard/FuncionarioCard";
import OvinoListSheet from "./ovinoListSheet/OvinoListSheet";
import FuncionarioListSheet from "./FuncionarioListSheet/FuncionarioListSheet";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useFuncionarios } from "../../../api/hooks/funcionario/UseFuncionarios";

import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { Funcionario } from "../../../api/models/funcionario/FuncinarioModel";

interface GerenciarProps {
  searchQuery: string;
  type: "ovino" | "funcionario";
}

const Gerenciar: React.FC<GerenciarProps> = ({ searchQuery, type }) => {
  const { ovinos, loading: loadingOvinos } = useOvinos();
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loading = type === "ovino" ? loadingOvinos : loadingFuncionarios;

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
    return funcionarios.filter((f) =>
      [f.id.toString(), f.cpfCnpj, f.endereco, f.nome, f.telefone]
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
          {type === "ovino" ? (
            <>
              {(currentData as Ovino[]).map((ovino) => (
                <OvinoCard
                  key={ovino.id}
                  nome={ovino.nome}
                  sexo={ovino.sexo}
                  fbb={ovino.fbb ?? "Não informado"}
                  raca={ovino.raca}
                  pai={ovino.ovinoPai}
                  mae={ovino.ovinoMae}
                  pureza={ovino.typeGrauPureza}
                />
              ))}

              <OptionCard
                key="add-ovino"
                images={[{ src: Add, alt: "add" }]}
                text="Cadastrar"
                href="/dashboard/ovinos/cadastrar"
                style={{ width: "250px", height: "310px" }}
              />
            </>
          ) : (
            <>
              {(currentData as Funcionario[]).map((funcionario) => (
                <FuncionarioCard
                  key={funcionario.id}
                  nome={funcionario.nome}
                  endereco={funcionario.endereco}
                  telefone={funcionario.telefone}
                  cpfCnpj={funcionario.cpfCnpj}
                  dataAdmissao={funcionario.dataAdmissao}
                />
              ))}

              <OptionCard
                key="add-funcionario"
                images={[{ src: Add, alt: "add" }]}
                text="Cadastrar"
                href="/dashboard/funcionarios/cadastrar"
                style={{ width: "250px", height: "310px" }}
              />
            </>
          )}
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
