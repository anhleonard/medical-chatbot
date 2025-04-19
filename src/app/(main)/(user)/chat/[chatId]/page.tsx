"use client";
import Chat, { FilesId } from "@/components/chat";
import { Message } from "../../../../../../utils/interfaces";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessages } from "@/api/services/message";
import { getAccessToken } from "@/storage/storage";

export default function ChatHistoryPage() {
  const params = useParams();
  const chatId = Number(params.chatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = getAccessToken();
        if (chatId && token) {
          const response = await getMessages(chatId, token);
          console.log(response, "response ... ");

          // Map the API response to Message interface format
          const mappedMessages = response.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
            conversationId: msg.conversation_id,
            createdAt: msg.created_at,
          }));

          setMessages(mappedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Chat savedMessages={messages} savedFilesId={[]} savedChatId={chatId.toString()} />;
}
