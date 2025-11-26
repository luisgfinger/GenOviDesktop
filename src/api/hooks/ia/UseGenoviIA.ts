import { useState } from "react";
import { mapChatResponse } from "../../mappers/ia/ChatMapper";
import { GenoviIAService } from "../../services/ia/GenoviIAService";

interface IAHistoryItem {
  role: string;
  text: string;
}

export function useGenoviIA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendToIA(history: IAHistoryItem[]) {
    setLoading(true);
    setError(null);

    const result = await GenoviIAService.enviarMensagem(history);

    const mapped = mapChatResponse(result);

    if (!mapped.success) {
      setError(mapped.text);
    }

    setLoading(false);
    return mapped;
  }

  return { sendToIA, loading, error };
}
