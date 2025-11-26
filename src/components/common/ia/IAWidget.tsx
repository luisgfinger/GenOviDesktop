import { useEffect, useState } from "react";
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

  const [messages, setMessages] = useState<
    { role: string; text: string; hidden?: boolean }[]
  >([]);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (promptPreDefinido) {
      setMessages([
        {
          role: "model",
          text: promptPreDefinido,
          hidden: true
        }
      ]);
    }
  }, [promptPreDefinido]);

  async function enviarPrompt(text: string) {
    const newHistory = [...messages, { role: "user", text }];
    setMessages(newHistory);

    const result = await sendToIA(newHistory);

    const iaReply = {
      role: "model",
      text: result.text
    };

    setMessages(prev => [...prev, iaReply]);
  }

  return (
    <div className="ia-widget">

      <div className="ia-header">
        <span>Assistente Genovi 🐑</span>
        <button
          className="ia-close-btn"
          onClick={() => {
            setMessages([]);
            onClose();
          }}
        >
          ×
        </button>
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
        {messages
          .filter(m => !m.hidden) 
          .map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
              {m.text}
            </div>
          ))
        }

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
