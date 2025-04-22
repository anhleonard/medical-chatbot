"use client";
import Chat, { FilesId } from "@/components/chat";
import { Message } from "../../../../../../utils/interfaces";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessages } from "@/api/services/message";
import { getAccessToken } from "@/storage/storage";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { useDispatch, useSelector } from "react-redux";
import { openAlert } from "@/redux/slices/alert";
import { RootState } from "@/redux/store";

export default function ChatHistoryPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const chatId = Number(params.chatId);
  const [messages, setMessages] = useState<Message[]>([]);

  const { isLoading } = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(openLoading());
        const token = getAccessToken();
        if (chatId && token) {
          const response = await getMessages(chatId, token);

          // Map the API response to Message interface format
          const mappedMessages = response.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
            conversationId: msg.conversation_id,
            createdAt: msg.created_at,
            hasFile: Boolean(msg?.has_ocr) || Boolean(msg?.has_images),
          }));

          setMessages(mappedMessages);
        }
      } catch (error) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Có lỗi xảy ra khi lấy thông tin đoạn chat",
            type: "error",
          }),
        );
      } finally {
        dispatch(closeLoading());
      }
    };

    fetchMessages();
  }, [chatId]);

  if (isLoading) {
    return null;
  }

  return <Chat savedMessages={messages} savedFilesId={[]} savedChatId={chatId.toString()} />;
}
