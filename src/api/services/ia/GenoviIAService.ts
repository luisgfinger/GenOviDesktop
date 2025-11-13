import Api from "../Api";
import type { ChatRequestDTO } from "../../dtos/ia/ChatRequestDTO";
import type { ChatResponseDTO } from "../../dtos/ia/ChatResponseDTO";

export const GenoviIAService = {
  async enviarMensagem(request: ChatRequestDTO): Promise<ChatResponseDTO> {
    try {
      const response = await Api.post<ChatResponseDTO>(
        "/user/ia-agent/genovi/chat",
        request
      );

      return response.data;

    } catch (error: any) {
      console.error("Erro na IA:", error);

      return {
        success: false,
        error:
          error?.response?.data?.error ||
          "Erro inesperado ao comunicar com a IA."
      };
    }
  }
};
