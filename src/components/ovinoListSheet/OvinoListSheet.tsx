import React from "react";
import type { Ovino } from "../../services/ovinoService";
import "./ovinoListSheet.css";

interface OvinoListSheetProps {
  ovinos: Ovino[];
}

const OvinoListSheet: React.FC<OvinoListSheetProps> = ({ ovinos }) => {
  return (
    <ul className="ovinoSheet-container flex-column">
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
          className={`ovinoSheet-row flex ${index % 2 === 0 ? "par" : "impar"}`}
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
  );
};

export default OvinoListSheet;
