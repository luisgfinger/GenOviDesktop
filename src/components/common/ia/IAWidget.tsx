import { useState } from "react";
import { useGenoviIA } from "../../../api/hooks/ia/UseGenoviIA";
import "./IA.css";
import { gerarContextoIA } from "../../../utils/ia/gerarContextoIA";

interface IAChatWidgetProps {
  promptPreDefinido?: string;
  permitirInputUsuario?: boolean;
  promptOptions?: string[];
  contextoIA?: any;
  onClose: () => void;
}

export default function IAChatWidget({
  promptPreDefinido,
  permitirInputUsuario = true,
  promptOptions = [],
  contextoIA,
  onClose,
}: IAChatWidgetProps) {
  const { sendToIA, loading } = useGenoviIA();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  function construirPrompt(finalPergunta: string) {
    let header = "";

    if (contextoIA) {
      header += gerarContextoIA(contextoIA) + "\n\n";
    }

    if (promptPreDefinido) {
      header += promptPreDefinido + "\n";
    }

    return header ? `${header}${finalPergunta}` : finalPergunta;
  }

  async function enviarPrompt(text: string) {
    const userMsg = { text, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    const finalPrompt = construirPrompt(text);
    const result = await sendToIA(finalPrompt);

    console.log("PROMPT FINAL ENVIADO PARA IA:");
    console.log(finalPrompt);

    const iaMsg = {
      text: result.text,
      sender: result.success ? "bot" : "error",
      timestamp: result.timestamp,
    };

    setMessages((prev) => [...prev, iaMsg]);
  }

  return (
    <div className="ia-widget">
      <div className="ia-header">
        <span>Assistente Genovi 🐑</span>
        <button className="ia-close-btn" onClick={onClose}>×</button>
      </div>

      {promptOptions.length > 0 && (
        <div className="ia-quick-prompts">
          {promptOptions.slice(0, 5).map((opt, i) => (
            <button key={i} className="ia-prompt-btn" onClick={() => enviarPrompt(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}

      <div className="ia-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender}`}>
            {m.text}
          </div>
        ))}

        {loading && <div className="msg bot">Digitando...</div>}
      </div>

      {permitirInputUsuario && (
        <div className="ia-input-area">
          <input
            type="text"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (input.trim()) enviarPrompt(input);
              setInput("");
            }}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
