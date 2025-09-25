import React from "react";
import { useLocation, useParams } from "react-router-dom";
import OvinoCardFull from "../../../common/cards/ovinoCard/OvinoCardFull";
import type { Ovino } from "../../../../api/models/ovino/OvinoModel";
import "./OvinoFullInfo.css"

const OvinoFullInfo: React.FC = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const ovino = state?.ovino as Ovino | undefined;

  if (!ovino) {
    return <p>Carregando dados do ovino {id}...</p>;
  }

  return (
    <div className="ovinoFullInfo flex">
      <OvinoCardFull ovino={ovino} />
    </div>
  );
};

export default OvinoFullInfo;
