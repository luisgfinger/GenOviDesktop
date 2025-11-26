import Api from "../Api";
import type { ChatResponseDTO } from "../../dtos/ia/ChatResponseDTO";

interface IAHistoryItem {
  role: string;
  text: string;
}

export const GenoviIAService = {
  async enviarMensagem(history: IAHistoryItem[]): Promise<ChatResponseDTO> {
    const requestBody = {
      contents: history
    };

    console.log("📤 ENVIANDO PARA IA:");
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      const response = await Api.post<ChatResponseDTO>(
        "/user/ia-agent/genovi/chat",
        requestBody
      );

      console.log("📥 RESPOSTA DA IA:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;

    } catch (error: any) {
      console.error("❌ ERRO AO ENVIAR PARA IA:", error);

      return {
        success: false,
        error:
          error?.response?.data?.error ||
          "Erro inesperado ao comunicar com a IA."
      };
    }
  }
};
