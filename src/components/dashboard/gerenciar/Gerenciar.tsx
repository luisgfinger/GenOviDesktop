import React, { useEffect, useMemo, useState } from "react";
import "./Gerenciar.css";

import PaginationMenu from "../../common/paginationMenu/PaginationMenu";
import OvinoCard from "../../common/cards/ovinoCard/OvinoCard";
import FuncionarioCard from "../../common/cards/funcionarioCard/FuncionarioCard";
import OvinoListSheet from "./ovinoListSheet/OvinoListSheet";
import FuncionarioListSheet from "./FuncionarioListSheet/FuncionarioListSheet";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import FilterBar from "../../common/filter-bar/FilterBar";
import Add from "../../../assets/icons/add.png";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useFuncionarios } from "../../../api/hooks/funcionario/UseFuncionarios";
import { TypeStatus } from "../../../api/enums/typeStatus/TypeStatus";

import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { Funcionario } from "../../../api/models/funcionario/FuncinarioModel";

interface GerenciarProps {
  type: "ovino" | "funcionario";
}

const Gerenciar: React.FC<GerenciarProps> = ({ type }) => {
  const { ovinos, loading: loadingOvinos } = useOvinos();
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();

  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("TODOS");
  const [status, setStatus] = useState<string>("ATIVO");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const itemsPerPage = 7;
  const loading = type === "ovino" ? loadingOvinos : loadingFuncionarios;

  const clearFilters = () => {
    setQ("");
    setTipo("TODOS");
    setStatus("TODOS");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const filteredOvinos = useMemo(() => {
    let result = ovinos;

    if (q) {
      result = result.filter((o) =>
        [o.id.toString(), o.fbb, o.nome, o.raca, o.sexo]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q.toLowerCase()))
      );
    }

    if (tipo && tipo !== "TODOS") {
      result = result.filter(
        (o) => o.sexo?.toLowerCase() === tipo.toLowerCase()
      );
    }

    if (status && status !== "TODOS") {
      result = result.filter(
        (o) => o.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (dateFrom) {
      result = result.filter(
        (o) =>
          o.dataNascimento && new Date(o.dataNascimento) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      result = result.filter(
        (o) =>
          o.dataNascimento && new Date(o.dataNascimento) <= new Date(dateTo)
      );
    }

    return result;
  }, [ovinos, q, tipo, status, dateFrom, dateTo]);

  const filteredFuncionarios = useMemo(() => {
    let result = funcionarios;

    if (q) {
      result = result.filter((f) =>
        [f.id.toString(), f.cpfCnpj, f.endereco, f.nome, f.telefone]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q.toLowerCase()))
      );
    }

    if (dateFrom) {
      result = result.filter(
        (f) => f.dataAdmissao && new Date(f.dataAdmissao) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      result = result.filter(
        (f) => f.dataAdmissao && new Date(f.dataAdmissao) <= new Date(dateTo)
      );
    }

    return result;
  }, [funcionarios, q, dateFrom, dateTo]);

  const data = type === "ovino" ? filteredOvinos : filteredFuncionarios;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-container flex-column">
      <FilterBar
        q={q}
        setQ={setQ}
        tipo={tipo}
        setTipo={type === "ovino" ? setTipo : undefined}
        status={status}
        setStatus={type === "ovino" ? setStatus : undefined}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        clearFilters={clearFilters}
        setPage={setCurrentPage}
        placeholder={
          type === "ovino"
            ? "Buscar por nome, raça, sexo..."
            : "Buscar por nome, CPF/CNPJ..."
        }
        typeOptions={type === "ovino" ? ["Macho", "Fêmea"] : undefined}
        typeLabel={type === "ovino" ? "Sexo" : undefined}
        statusOptions={type === "ovino" ? Object.values(TypeStatus) : undefined}
        statusLabel="Status"
        allOptionLabel="Todos"
        allOptionValue="TODOS"
      />
      <div className="gerenciar-counter">
        Mostrando <strong>{viewAll ? data.length : currentData.length}</strong>{" "}
        de <strong>{data.length}</strong> resultado(s).
      </div>

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
                <OvinoCard key={ovino.id} ovino={ovino} />
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
