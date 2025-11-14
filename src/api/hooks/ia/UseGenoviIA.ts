import { useState } from "react";
import { mapChatResponse } from "../../mappers/ia/ChatMapper";
import { GenoviIAService } from "../../services/ia/GenoviIAService";

export function useGenoviIA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendToIA(prompt: string) {
    setLoading(true);
    setError(null);

    const result = await GenoviIAService.enviarMensagem(prompt);

    const mapped = mapChatResponse(result);

    if (!mapped.success) {
      setError(mapped.text);
    }

    setLoading(false);
    return mapped;
  }

  return { sendToIA, loading, error };
}
