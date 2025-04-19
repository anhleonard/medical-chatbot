export type MessageContent = { type: "text"; text: string; images: Array<string> }

export type Message = {
    id: string;
    role: string;
    content: string;
    createdAt: string;
};

export type ChatWithMessages = {
    id: string;
    updated_at: Date;
    messages: Message[];
};

