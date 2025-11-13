import { useState } from "react";
import IAChatWidget from "./IAWidget";
import "./IA.css"

interface IAButtonProps {
  promptPreDefinido?: string;
  permitirInputUsuario?: boolean;
  promptOptions?: string[]; 
}

export default function IAButton({
  promptPreDefinido,
  permitirInputUsuario = true,
  promptOptions = [],
}: IAButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="ia-button" onClick={() => setOpen(!open)}>💬</div>

      {open && (
        <IAChatWidget
          promptPreDefinido={promptPreDefinido}
          permitirInputUsuario={permitirInputUsuario}
          promptOptions={promptOptions} 
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
