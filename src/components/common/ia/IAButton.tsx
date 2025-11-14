import { useState } from "react";
import IAChatWidget from "./IAWidget";

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
      <div className="ia-button" onClick={() => setOpen(!open)}>
        💬
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


