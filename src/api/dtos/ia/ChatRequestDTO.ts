export interface ChatMessageDTO {
  role: "user" | "model";
  text: string;
}

export interface ChatRequestDTO {
  contents: ChatMessageDTO[];
}
