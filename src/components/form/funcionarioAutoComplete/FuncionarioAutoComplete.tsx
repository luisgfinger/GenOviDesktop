import { useState, useRef, useEffect, type ChangeEvent, type FocusEvent } from "react";
import FuncionarioService from "../../../api/services/funcionario/FuncionarioService";
import type { Funcionario } from "../../../api/models/funcionario/FuncionarioModel";

interface FuncionarioAutocompleteProps {
  onSelect: (id: string) => void;
  required?: boolean;
}

export default function FuncionarioAutocomplete({ onSelect, required = false }: FuncionarioAutocompleteProps) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const data = await FuncionarioService.getAll();
        setFuncionarios(data);
        setFilteredFuncionarios(data);
      } catch (error) {
        console.error("Erro ao buscar funcionarios:", error);
      }
    }
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    if (!inputValue) setFilteredFuncionarios(funcionarios);
    else
      setFilteredFuncionarios(
        funcionarios.filter(c =>
          c.nome.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
  }, [inputValue, funcionarios]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedId("");
    setIsOpen(true);
  };

  const handleSelectFuncionario = (funcionario: Funcionario) => {
    setInputValue(funcionario.nome);
    setSelectedId(funcionario.id);
    setIsOpen(false);
    inputRef.current?.focus();
    onSelect(funcionario.id);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <li style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => setIsOpen(true)}
        placeholder="Digite ou selecione um funcionario"
        autoComplete="off"
        style={{ width: "100%", padding: "8px 12px" }}
        required={required}
      />
      {isOpen && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 200, overflowY: "auto", background: "white", border: "1px solid #d1d5db", zIndex: 1000, margin: 0, padding: 0, listStyle: "none" }}>
          {filteredFuncionarios.length === 0 ? (
            <li style={{ padding: 12, fontStyle: "italic", color: "#6b7280" }}>Nenhum funcionario encontrado</li>
          ) : (
            filteredFuncionarios.map(c => (
              <li
                key={c.id}
                onClick={() => handleSelectFuncionario(c)}
                style={{ padding: 12, cursor: "pointer", backgroundColor: selectedId === c.id ? "#f3f4f6" : "white" }}
              >
                {c.nome}
              </li>
            ))
          )}
        </ul>
      )}
      <input type="hidden" name="funcionarioId" value={selectedId || ""} required={required} />
    </li>
  );
}
