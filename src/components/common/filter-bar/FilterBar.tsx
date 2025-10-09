import React from "react";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";
import Button from "../buttons/Button";
import "./FilterBar.css";

type TypeOption = { value: string; label: string };

interface FilterBarProps<TStatus extends string = string> {
  q: string;
  setQ: (value: string) => void;

  tipo?: string;
  setTipo?: (value: string) => void;

  status?: TStatus;
  setStatus?: React.Dispatch<React.SetStateAction<TStatus>>;

  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;

  clearFilters: () => void;
  setPage: (page: number) => void;
  setViewAll: (value: boolean) => void;

  placeholder?: string;

  typeOptions?: Array<TypeOption | string>;
  statusOptions?: Array<TypeOption | string>;

  typeLabel?: string;
  statusLabel?: string;

  allOptionLabel?: string;
  allOptionValue?: string;
}

const FilterBar = <TStatus extends string = string>({
  q,
  setQ,
  tipo,
  setTipo,
  status,
  setStatus,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clearFilters,
  setPage,
  setViewAll,
  placeholder = "Buscar...",
  typeOptions,
  statusOptions = [],
  typeLabel = "Tipo",
  statusLabel = "Status",
  allOptionLabel = "Todos",
  allOptionValue = "TODOS",
}: FilterBarProps<TStatus>) => {
  const normalizedTypeOptions: TypeOption[] =
    typeOptions && typeOptions.length > 0
      ? typeOptions.map((opt) =>
          typeof opt === "string" ? { value: opt, label: formatEnum(opt) } : opt
        )
      : Object.values(TypeReproducao).map((t) => ({
          value: t,
          label: formatEnum(t),
        }));

  const normalizedStatusOptions: TypeOption[] =
    statusOptions && statusOptions.length > 0
      ? statusOptions.map((opt) =>
          typeof opt === "string" ? { value: opt, label: formatEnum(opt) } : opt
        )
      : [];

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

      {setTipo && (
        <div className="filter-group flex-column">
          <label htmlFor="tipo">{typeLabel}</label>
          <select
            id="tipo"
            className="filter-select"
            value={tipo ?? allOptionValue}
            onChange={(e) => {
              setTipo(e.target.value);
              setPage(1);
              setViewAll(false);
            }}
          >
            <option value={allOptionValue}>{allOptionLabel}</option>
            {normalizedTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {setStatus && (
        <div className="filter-group flex-column">
          <label htmlFor="status">{statusLabel}</label>
          <select
            id="status"
            className="filter-select"
            value={status ?? allOptionValue}
            onChange={(e) => {
              setStatus(e.target.value as TStatus);
              setPage(1);
              setViewAll(false);
            }}
          >
            <option value={allOptionValue}>{allOptionLabel}</option>
            {normalizedStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

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
