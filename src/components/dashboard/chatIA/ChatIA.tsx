import { useState } from "react";
import { useGenoviIA } from "../../../api/hooks/ia/UseGenoviIA";
import "./ChatIA.css";

export default function ChatIA() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string; timestamp: Date }[]>([]);
  const { sendToIA, loading } = useGenoviIA();

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input,
      timestamp: new Date()
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);

    setInput("");

    const iaResponse = await sendToIA(updatedHistory);

    const iaMsg = {
      role: "model",
      text: iaResponse.text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, iaMsg]);
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Assistente Genovi 🐑</div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.role === "user" ? "me" : "bot"}`}
          >
            <p>{m.text}</p>
            <span className="timestamp">
              {new Date(m.timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bot loader">
            <div className="dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Digite sua pergunta sobre ovinos..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSend} className="chat-button" disabled={loading}>
          Enviar
        </button>
      </div>
    </div>
  );
}
