import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ovinoService from "../../../api/services/ovino/OvinoService";
import type { Ovino } from "../../../api/models/ovino/Ovino";

interface OvinoAutocompleteProps {
  type: "femea" | "macho" | "todos";
  onSelect: (id: string) => void;
  required?: boolean;
}

export default function OvinoAutocomplete({ type, onSelect, required = false }: OvinoAutocompleteProps) {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filteredOvinos, setFilteredOvinos] = useState<Ovino[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchOvinos() {
      try {
        const data = await ovinoService.getAll();
        setOvinos(data);
        setFilteredOvinos(data);
      } catch (error) {
        console.error("Erro ao buscar ovinos:", error);
      }
    }
    fetchOvinos();
  }, []);

  useEffect(() => {
    let filtered = ovinos;
    if (inputValue.length > 0)
      filtered = filtered.filter(o => o.nome.toLowerCase().includes(inputValue.toLowerCase()));

    if (type === "femea") filtered = filtered.filter(o => o.sexo?.toLowerCase() === "femea");
    else if (type === "macho") filtered = filtered.filter(o => o.sexo?.toLowerCase() === "macho");

    setFilteredOvinos(filtered);
  }, [inputValue, ovinos, type]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedId(null);
    setIsOpen(true);
  };

  const handleSelectOvino = (ovino: Ovino) => {
    setInputValue(ovino.nome);
    setSelectedId(ovino.id);
    setIsOpen(false);
    inputRef.current?.focus();
    onSelect(ovino.id);
  };

  return (
    <li style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Digite ou selecione um ovino"
        autoComplete="off"
        required={required}
        style={{ width: "100%", padding: "8px 12px" }}
      />
      {isOpen && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 200, overflowY: "auto", background: "white", border: "1px solid #d1d5db", zIndex: 1000, margin: 0, padding: 0, listStyle: "none" }}>
          {filteredOvinos.length === 0 ? (
            <li style={{ padding: 12, fontStyle: "italic", color: "#6b7280" }}>Nenhum ovino encontrado</li>
          ) : (
            filteredOvinos.map(o => (
              <li
                key={o.id}
                onClick={() => handleSelectOvino(o)}
                style={{ padding: 12, cursor: "pointer", backgroundColor: selectedId === o.id ? "#f3f4f6" : "white" }}
              >
                {o.nome}
              </li>
            ))
          )}
        </ul>
      )}
      <input type="hidden" name="ovinoId" value={selectedId || ""} required={required} />
    </li>
  );
}
