import React, { useState } from "react";
import type { Criador } from "../../../../services/criador/criadorService";
import "./CriadorListSheet.css";
import { motion, AnimatePresence } from "framer-motion";
import CriadorCard from "../../../common/cards/criadorCard/CriadorCard";

interface CriadorListSheetProps {
  criadores: Criador[];
}

const CriadorListSheet: React.FC<CriadorListSheetProps> = ({ criadores }) => {
  const [selectedCriador, setSelectedCriador] = useState<Criador | null>(null);

  const handleCriadorSelect = (criador: Criador) => {
    setSelectedCriador(criador);
    console.log("Selecionado:", criador);
  };

  return (
    <div className="criadorSheet-container flex">
      <AnimatePresence mode="wait">
        {selectedCriador && (
          <motion.div
            key={selectedCriador.id}
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}    
            exit={{ opacity: 0, scale: 0.8 }}   
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "center" }} 
          >
            <CriadorCard
              imagem={selectedCriador.imagem}
              cpfCnpj={selectedCriador.cpfCnpj}
              endereco={selectedCriador.endereco}
              nome={selectedCriador.nome}
              telefone={selectedCriador.telefone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="criadorSheet-container-inside flex-column">
        <li className="criadorSheet-titles-row flex">
          <span className="flex">ID</span>
          <span className="flex">NOME</span>
          <span className="flex">CPF/CNPJ</span>
          <span className="flex">ENDEREÇO</span>
          <span className="flex">TELEFONE</span>
        </li>

        {criadores.map((criador, index) => (
          <li
            key={criador.id}
            className={`criadorSheet-row flex ${
              index % 2 === 0 ? "par" : "impar"
            } ${selectedCriador?.id === criador.id ? "selecionado" : ""}`}
            onClick={() => handleCriadorSelect(criador)}
          >
            <span className="flex">{criador.id}</span>
            <span className="flex">{criador.nome}</span>
            <span className="flex">{criador.cpfCnpj}</span>
            <span className="flex">{criador.endereco}</span>
            <span className="flex">{criador.telefone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriadorListSheet;