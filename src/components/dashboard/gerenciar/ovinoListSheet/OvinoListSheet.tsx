import React, { useState } from "react";
import type { Ovino } from "../../../../api/models/ovino/Ovino";
import "./OvinoListSheet.css";
import { motion, AnimatePresence } from "framer-motion";
import OvinoCard from "../../../common/cards/ovinoCard/OvinoCard";

interface OvinoListSheetProps {
  ovinos: Ovino[];
}

const OvinoListSheet: React.FC<OvinoListSheetProps> = ({ ovinos }) => {
  const [selectedOvino, setSelectedOvino] = useState<Ovino | null>(null);

  const handleOvinoSelect = (ovino: Ovino) => {
    setSelectedOvino(ovino);
    console.log("Selecionado:", ovino);
  };

  return (
    <div className="ovinoSheet-container flex">
      <AnimatePresence mode="wait">
        {selectedOvino && (
          <motion.div
            key={selectedOvino.id}
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}    
            exit={{ opacity: 0, scale: 0.8 }}   
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "center" }} 
          >
            <OvinoCard
              imagem={selectedOvino.imagem}
              nome={selectedOvino.nome}
              sexo={selectedOvino.sexo}
              fbb={selectedOvino.fbb}
              raca={selectedOvino.raca}
              pai={selectedOvino.pai}
              mae={selectedOvino.mae}
              pureza={selectedOvino.pureza}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="ovinoSheet-container-inside flex-column">
        <li className="ovinoSheet-titles-row flex">
          <span className="flex">ID</span>
          <span className="flex">FBB</span>
          <span className="flex">NOME</span>
          <span className="flex">RAÇA</span>
          <span className="flex">SEXO</span>
          <span className="flex">MÃE</span>
          <span className="flex">PAI</span>
          <span className="flex">PUREZA</span>
        </li>

        {ovinos.map((ovino, index) => (
          <li
            key={ovino.id}
            className={`ovinoSheet-row flex ${
              index % 2 === 0 ? "par" : "impar"
            } ${selectedOvino?.id === ovino.id ? "selecionado" : ""}`}
            onClick={() => handleOvinoSelect(ovino)}
          >
            <span className="flex">{ovino.id}</span>
            <span className="flex">{ovino.fbb}</span>
            <span className="flex">{ovino.nome}</span>
            <span className="flex">{ovino.raca}</span>
            <span className="flex">{ovino.sexo}</span>
            <span className="flex">{ovino.mae}</span>
            <span className="flex">{ovino.pai}</span>
            <span className="flex">{ovino.pureza}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OvinoListSheet;
