"use client";
import Chat from "@/components/chat";
import { Message } from "../../../../../../utils/interfaces";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getMessages } from "@/api/services/message";
import { getAccessToken } from "@/storage/storage";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { useDispatch, useSelector } from "react-redux";
import { openAlert } from "@/redux/slices/alert";
import { RootState } from "@/redux/store";
import { setChatId } from "@/redux/slices/chat";

export default function ChatHistoryPage() {
  console.log("ChatHistoryPage render");
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { chatId: globalChatId } = useSelector((state: RootState) => state.chat);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render in development due to Strict Mode
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    console.log("Effect running with params.chatId:", params.chatId);
    const currentChatId = Number(params.chatId);
    console.log("Setting chatId in Redux:", currentChatId);
    dispatch(setChatId(currentChatId));

    const fetchMessages = async () => {
      console.log("fetchMessages called with chatId:", currentChatId);
      try {
        dispatch(openLoading());
        const token = getAccessToken();
        if (currentChatId && token) {
          const response = await getMessages(currentChatId, token);

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
        } else if (!currentChatId) {
          setMessages([]);
          router.push("/chat");
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
  }, [params.chatId, dispatch, router]);

  if (isLoading) {
    return null;
  }

  return <Chat savedMessages={messages} savedFilesId={[]} savedChatId={globalChatId?.toString() || ""} />;
}
