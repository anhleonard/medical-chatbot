export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  conversationId?: number;
  createdAt?: string;
}

export interface Chat {
  id: string;
  messages: Message[];
  updated_at: string;
}
