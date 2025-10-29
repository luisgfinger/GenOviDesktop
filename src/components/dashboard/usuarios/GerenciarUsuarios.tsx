import React, { useMemo, useState } from "react";
import "./GerenciarUsuarios.css";

import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import UsuarioCard from "../../common/cards/usuarioCard/UsuarioCard";
import UsuarioListSheet from "./usuarioListSheet/UsuarioListSheet";
import FilterBar from "../../common/filter-bar/FilterBar";
import Add from "../../../assets/icons/add.png";

import { useUsuarios } from "../../../api/hooks/usuario/UseUsuarios";

const GerenciarUsuarios: React.FC = () => {
  const { usuarios, loading } = useUsuarios();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("TODOS");
  const [ativo, setAtivo] = useState<string>("TODOS");

  const itemsPerPage = 8;

  const clearFilters = () => {
    setQ("");
    setRole("TODOS");
    setAtivo("TODOS");
    setCurrentPage(1);
    setViewAll(false);
  };

  const filteredUsuarios = useMemo(() => {
    let result = usuarios;

    if (q) {
      result = result.filter((u) =>
        [u.id.toString(), u.email, u.funcionario?.nome]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q.toLowerCase()))
      );
    }

    if (role !== "TODOS") {
      result = result.filter((u) =>
        u.roles?.some((r) => r.toLowerCase() === role.toLowerCase())
      );
    }

    if (ativo !== "TODOS") {
      const isActive = ativo === "ATIVO";
      result = result.filter((u) => u.ativo === isActive);
    }

    return result;
  }, [usuarios, q, role, ativo]);

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const currentData = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      <FilterBar
        q={q}
        setQ={setQ}
        tipo={role}
        setTipo={setRole}
        status={ativo}
        setStatus={setAtivo}
        clearFilters={clearFilters}
        setPage={setCurrentPage}
        setViewAll={setViewAll}
        placeholder="Buscar por e-mail ou nome do funcionário..."
        typeOptions={["ROLE_USER", "ROLE_ADMIN"]}
        typeLabel="Função"
        statusOptions={["ATIVO", "INATIVO"]}
        statusLabel="Status"
        allOptionLabel="Todos"
        allOptionValue="TODOS"
      />

      {viewAll ? (
        <UsuarioListSheet usuarios={filteredUsuarios} />
      ) : (
        <div className="gerenciar-container-inside">
          {currentData.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              email={usuario.email}
              ativo={usuario.ativo}
              roles={usuario.roles}
              funcionarioNome={usuario.funcionario?.nome}
              autenticacao2fa={usuario.autenticacao2fa}
            />
          ))}

          <OptionCard
            key="add-usuario"
            images={[{ src: Add, alt: "add" }]}
            text="Cadastrar"
            href="/dashboard/usuarios/cadastrar"
            style={{ width: "250px", height: "310px" }}
          />
        </div>
      )}

      {!viewAll && filteredUsuarios.length > itemsPerPage && (
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

export default GerenciarUsuarios;
