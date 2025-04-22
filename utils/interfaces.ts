export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  conversationId?: number;
  createdAt?: string;
  hasFile?: boolean;
}

export interface Chat {
  id: string;
  messages: Message[];
  updated_at: string;
}
