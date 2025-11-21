import { useState } from "react";
import IAChatWidget from "./IAWidget";

import WhiteBrain from "../../../assets/icons/whiteBrain.png"

interface IAButtonProps {
  promptPreDefinido?: string;
  permitirInputUsuario?: boolean;
  promptOptions?: string[];
  contextoIA?: any;
}

export default function IAButton(props: IAButtonProps) {
  const { contextoIA } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="ia-button flex">
        <img src={WhiteBrain} alt="IA" onClick={() => setOpen(!open)} />
      </div>
      
      {open && (
        <IAChatWidget
          promptPreDefinido={props.promptPreDefinido}
          permitirInputUsuario={props.permitirInputUsuario}
          promptOptions={props.promptOptions}
          contextoIA={contextoIA}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}


