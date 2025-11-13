import type { ChatResponseDTO } from "../../dtos/ia/ChatResponseDTO";

export function mapChatResponse(response: ChatResponseDTO) {
  return {
    success: response.success,
    text: response.response ?? response.error ?? "",
    timestamp: response.timestamp ? new Date(response.timestamp) : new Date(),
  };
}
