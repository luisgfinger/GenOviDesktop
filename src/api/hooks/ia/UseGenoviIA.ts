import { useState } from "react";
import { GenoviIAService } from "../../services/ia/GenoviIAService";
import { mapChatResponse } from "../../mappers/ia/ChatMapper";

export function useGenoviIA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendToIA(message: string) {
    setLoading(true);
    setError(null);

    const result = await GenoviIAService.enviarMensagem({ message });

    const mapped = mapChatResponse(result);

    if (!mapped.success) {
      setError(mapped.text);
    }

    setLoading(false);
    return mapped;
  }

  return {
    sendToIA,
    loading,
    error
  };
}
