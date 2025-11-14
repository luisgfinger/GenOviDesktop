import Api from "../Api";
import type { ChatRequestDTO} from "../../dtos/ia/ChatRequestDTO";
import type { ChatResponseDTO } from "../../dtos/ia/ChatResponseDTO";

export const GenoviIAService = {
  async enviarMensagem(message: string): Promise<ChatResponseDTO> {
    console.log("Enviado: ", message);
    const requestBody: ChatRequestDTO = {
      contents: [
        {
          role: "user",
          text: message
        }
      ]
    };

    try {
      const response = await Api.post<ChatResponseDTO>(
        "/user/ia-agent/genovi/chat",
        requestBody
      );

      return response.data;

    } catch (error: any) {
      console.error("Erro IA:", error);

      return {
        success: false,
        error:
          error?.response?.data?.error ||
          "Erro inesperado ao comunicar com a IA."
      };
    }
  }
};
