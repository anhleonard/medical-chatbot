export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  role: "doctor" | "patient";
  password: string;
}

export interface CreateMessageDto {
  message: string;
  conversation_id?: number;
  screenshot?: string;
}
