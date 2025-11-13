import { useState } from "react";
import { useGenoviIA } from "../../../api/hooks/ia/UseGenoviIA";
import "./IA.css";

interface IAChatWidgetProps {
  promptPreDefinido?: string;
  permitirInputUsuario?: boolean;
  promptOptions?: string[];
  onClose: () => void;
}

export default function IAChatWidget({
  promptPreDefinido,
  permitirInputUsuario = true,
  promptOptions = [],
  onClose,
}: IAChatWidgetProps) {
  const { sendToIA, loading } = useGenoviIA();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function enviarPrompt(text: string) {
    const finalPrompt =
      promptPreDefinido && promptPreDefinido.trim().length > 0
        ? `${promptPreDefinido} ${text}`
        : text;

    const user = { text, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, user]);

    const result = await sendToIA(finalPrompt);

    const bot = {
      text: result.text,
      sender: result.success ? "bot" : "error",
      timestamp: result.timestamp,
    };

    setMessages((prev) => [...prev, bot]);
  }

  return (
    <div className="ia-widget">
      <div className="ia-header">
        <span>Assistente Genovi 🐑</span>
        <button className="ia-close-btn" onClick={onClose}>×</button>
      </div>

      {promptOptions.length > 0 && (
        <div className="ia-quick-prompts">
          {promptOptions.slice(0, 5).map((opt, idx) => (
            <button
              key={idx}
              className="ia-prompt-btn"
              onClick={() => enviarPrompt(opt)}
            >
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
