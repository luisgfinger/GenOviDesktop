import { useState, useRef, useEffect, type ChangeEvent, type FocusEvent } from "react";
import CriadorService from "../../../api/services/criador/CriadorService";
import type { Criador } from "../../../api/models/criador/CriadorModel";

interface CriadorAutocompleteProps {
  onSelect: (id: string) => void;
  required?: boolean;
}

export default function CriadorAutocomplete({ onSelect, required = false }: CriadorAutocompleteProps) {
  const [criadores, setCriadores] = useState<Criador[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [filteredCriadores, setFilteredCriadores] = useState<Criador[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCriadores() {
      try {
        const data = await CriadorService.getAll();
        setCriadores(data);
        setFilteredCriadores(data);
      } catch (error) {
        console.error("Erro ao buscar criadores:", error);
      }
    }
    fetchCriadores();
  }, []);

  useEffect(() => {
    if (!inputValue) setFilteredCriadores(criadores);
    else
      setFilteredCriadores(
        criadores.filter(c =>
          c.nome.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
  }, [inputValue, criadores]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedId("");
    setIsOpen(true);
  };

  const handleSelectCriador = (criador: Criador) => {
    setInputValue(criador.nome);
    setSelectedId(criador.id);
    setIsOpen(false);
    inputRef.current?.focus();
    onSelect(criador.id);
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
        placeholder="Digite ou selecione um criador"
        autoComplete="off"
        style={{ width: "100%", padding: "8px 12px" }}
        required={required}
      />
      {isOpen && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 200, overflowY: "auto", background: "white", border: "1px solid #d1d5db", zIndex: 1000, margin: 0, padding: 0, listStyle: "none" }}>
          {filteredCriadores.length === 0 ? (
            <li style={{ padding: 12, fontStyle: "italic", color: "#6b7280" }}>Nenhum criador encontrado</li>
          ) : (
            filteredCriadores.map(c => (
              <li
                key={c.id}
                onClick={() => handleSelectCriador(c)}
                style={{ padding: 12, cursor: "pointer", backgroundColor: selectedId === c.id ? "#f3f4f6" : "white" }}
              >
                {c.nome}
              </li>
            ))
          )}
        </ul>
      )}
      <input type="hidden" name="criadorId" value={selectedId || ""} required={required} />
    </li>
  );
}
