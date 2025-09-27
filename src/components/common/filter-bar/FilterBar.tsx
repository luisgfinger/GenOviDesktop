import React from "react";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";
import Button from "../buttons/Button";
import "./FilterBar.css";

type TypeOption = { value: string; label: string };

interface FilterBarProps {
  q: string;
  setQ: (value: string) => void;

  tipo: string;
  setTipo: (value: string) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;

  clearFilters: () => void;
  setPage: (page: number) => void;
  setViewAll: (value: boolean) => void;

  placeholder?: string;

  typeOptions?: Array<TypeOption | string>;

  typeLabel?: string;

  allOptionLabel?: string;
  allOptionValue?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  q,
  setQ,
  tipo,
  setTipo,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clearFilters,
  setPage,
  setViewAll,
  placeholder = "Buscar...",
  typeOptions,
  typeLabel = "Tipo",
  allOptionLabel = "Todos",
  allOptionValue = "TODOS",
}) => {
  const normalizedOptions: TypeOption[] =
    typeOptions && typeOptions.length > 0
      ? typeOptions.map((opt) =>
          typeof opt === "string" ? { value: opt, label: formatEnum(opt) } : opt
        )
      : Object.values(TypeReproducao).map((t) => ({
          value: t,
          label: formatEnum(t),
        }));

  return (
    <div className="filters flex">
      <div className="filter-group flex-column">
        <label htmlFor="busca">Buscar</label>
        <input
          id="busca"
          className="filter-input"
          type="text"
          placeholder={placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
            setViewAll(false);
          }}
        />
      </div>

      <div className="filter-group flex-column">
        <label htmlFor="tipo">{typeLabel}</label>
        <select
          id="tipo"
          className="filter-select"
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setPage(1);
            setViewAll(false);
          }}
        >
          <option value={allOptionValue}>{allOptionLabel}</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group flex-column">
        <label htmlFor="de">De</label>
        <input
          id="de"
          className="filter-date"
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
            setViewAll(false);
          }}
        />
      </div>

      <div className="filter-group flex-column">
        <label htmlFor="ate">Até</label>
        <input
          id="ate"
          className="filter-date"
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
            setViewAll(false);
          }}
        />
      </div>

      <Button type="button" variant="cardSecondary" onClick={clearFilters}>
        Limpar filtros
      </Button>
    </div>
  );
};

export default FilterBar;
