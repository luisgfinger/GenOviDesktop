import React from "react";
import OvinoListSheet from "../ovinoListSheet/ovinoListSheet";
import type { Ovino } from "../../services/ovinoService"; 

interface OvinosViewAllProps {
  ovinos: Ovino[];
}

const OvinosViewAll: React.FC<OvinosViewAllProps> = ({ ovinos }) => {
  return (
    <OvinoListSheet ovinos={ovinos} />
  );
}

export default OvinosViewAll;
