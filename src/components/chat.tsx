"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatForm from "./chat/chat-form";
import ChatContainer from "./chat/chat-container";
import { Message } from "../../utils/interfaces";
import { getAccessToken } from "@/storage/storage";
import { createMessage } from "@/api/services/message";
import { websocketService } from "@/api/services/websocket";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Context } from "@/context/context";
import { getConversations } from "@/api/services/conversation";
import { openAlert } from "@/redux/slices/alert";
import { useDispatch, useSelector } from "react-redux";
import { chatSlice } from "@/redux/slices/chat";
import { RootState } from "@/redux/store";

export type FilesId = {
  imageUrl: string;
  id: string;
  messageId?: number;
  type?: string;
  name?: string;
};

type props = {
  savedMessages?: Message[];
  savedFilesId?: FilesId[];
  savedChatId?: string;
};

export default function Chat({ savedMessages, savedFilesId, savedChatId }: props) {
  const dispatch = useDispatch();
  const { chatId: globalChatId, messages: globalMessages } = useSelector((state: RootState) => state.chat);
  const { setChats } = useContext(Context);
  const [files, setFiles] = useState<File[]>([]);
  const [filesId, setFilesId] = useState<FilesId[]>([]);
  const [fileUploaded, setFileUploaded] = useState<Record<string, string>>({});
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const [chatFormHeight, setChatFormHeight] = useState<number>(0);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Sync local chatId with global chatId
  useEffect(() => {
    if (globalChatId !== null) {
      setChatId(globalChatId.toString());
    } else {
      setChatId(null);
    }
  }, [globalChatId]);

  // Sync local messages with global messages
  useEffect(() => {
    if (savedMessages) {
      dispatch(chatSlice.actions.setMessages(savedMessages));
    }
  }, [savedMessages, dispatch]);

  // Function to refresh chat history
  const refreshChatHistory = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await getConversations(token);
      const mappedChats = response.map((chat: any) => ({
        id: chat?.id,
        title: chat?.title,
        updated_at: chat?.updated_at,
        created_at: chat?.created_at,
      }));

      setChats(mappedChats);
    } catch (error) {
      console.error("Error refreshing chat history:", error);
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    (message: Message) => {
      console.log("Received WebSocket message:", message);

      if (message.content) {
        // Check if message already exists to prevent duplicates
        const messageExists = globalMessages.some((msg) => msg.id === message.id);
        if (!messageExists) {
          dispatch(chatSlice.actions.setMessages([...globalMessages, message]));
        }
        setIsProcessing(false); // Hide loading when message is received
      }
    },
    [dispatch, globalMessages],
  );

  // Subscribe to WebSocket when requestId changes
  useEffect(() => {
    if (currentRequestId) {
      websocketService.subscribeToRequest(currentRequestId, handleWebSocketMessage);

      return () => {
        websocketService.unsubscribeFromRequest(currentRequestId);
      };
    }
  }, [currentRequestId, handleWebSocketMessage]);

  useEffect(() => {
    if (savedMessages) {
      setFilesId(savedFilesId || []);
    }
    if (savedChatId) {
      setChatId(savedChatId);
    }

    // Cleanup WebSocket subscription on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [savedMessages, savedFilesId, savedChatId]);

  const handleChatFormHeightChange = (height: number) => {
    setChatFormHeight(height);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    const userMessage: Message = {
      id: Math.random(),
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    dispatch(chatSlice.actions.setMessages([...globalMessages, userMessage]));
    setInput("");
    setFiles([]);
    setIsProcessing(true);

    try {
      setTimeout(() => {
        if (scrollableChatContainerRef.current) {
          scrollableChatContainerRef.current.scrollTo({
            top: scrollableChatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });

      const accessToken = getAccessToken();
      if (!accessToken) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Vui lòng đăng nhập để tiếp tục",
            type: "error",
          }),
        );
        setIsProcessing(false);
        return;
      }

      let messageData;

      if (files.length > 0) {
        console.log(files, "files");
        // Separate images and documents
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));
        const documentFiles = files.filter(
          (file) =>
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );

        console.log(documentFiles, "documentFiles");

        // Process images to base64
        const base64Images = await Promise.all(
          imageFiles.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(`data:image/png;base64,${base64String.split(",")[1]}`);
              };
              reader.readAsDataURL(file);
            });
          }),
        );

        // Create unique file IDs for each image and associate with the user message
        const newFilesId = [...base64Images].map((base64, index) => ({
          id: `file-${Date.now()}-${index}`,
          imageUrl: base64,
          messageId: userMessage.id,
          type: imageFiles[index].type,
          name: imageFiles[index].name,
        }));

        // Add document files to filesId
        if (documentFiles.length > 0) {
          const documentFile = documentFiles[0];
          const documentFileId = {
            id: `file-${Date.now()}-doc`,
            imageUrl: URL.createObjectURL(documentFile),
            messageId: userMessage.id,
            type: documentFile.type,
            name: documentFile.name,
          };
          newFilesId.push(documentFileId);
        }

        // Update filesId state with new files
        setFilesId((prev) => [...prev, ...newFilesId]);

        messageData = {
          message: input,
          ...(base64Images.length > 0 && { screenshot: base64Images[0] }),
          ...(documentFiles.length > 0 && { file: documentFiles[0] }),
          ...(chatId && { conversation_id: parseInt(chatId) }),
        };
      } else {
        // Only text message
        messageData = {
          message: input,
          ...(chatId && { conversation_id: parseInt(chatId) }),
        };
      }

      const result = await createMessage(messageData, accessToken);
      if (result?.request_id) {
        if (!chatId) {
          const newChatId = result.conversation_id;
          dispatch(chatSlice.actions.setChatId(newChatId)); // Use action creator from slice
          const newUrl = `/chat/${newChatId}`;
          window.history.pushState({}, "", newUrl);

          // Refresh chat history when a new chat is created
          await refreshChatHistory();
        }

        // Connect to WebSocket if not already connected
        if (!websocketService.isConnected()) {
          websocketService.connect(result.request_id);
        }

        // Update current request ID to trigger subscription
        setCurrentRequestId(result.request_id);
      } else {
        setIsProcessing(false); // Hide loading if no request_id
      }

      // Clear files after sending
      setFiles([]);
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Không thể gửi tin nhắn. Vui lòng thử lại.",
          type: "error",
        }),
      );
      setIsProcessing(false); // Hide loading on error
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <div className="bg-white flex h-screen flex-col items-center justify-center w-full">
        {/* Phần hiển thị tin nhắn */}
        <div className="flex-1 w-full flex justify-center overflow-auto">
          <ChatContainer
            messages={globalMessages}
            filesId={filesId}
            ref={scrollableChatContainerRef}
            height={scrollableChatContainerRef.current?.scrollHeight}
            loading={loading}
            chatFormHeight={chatFormHeight}
            isProcessing={isProcessing}
          />
        </div>

        {/* Phần nhập tin nhắn (ChatForm) */}
        <div className="bg-primary-c900 w-full min-w-[300px] flex justify-center px-2 md:px-0 pb-3 mt-5 bg-transparent sm:pb-8 sm:w-[600px] md:w-[700px] xl:w-3/4 2xl:w-3/5">
          <ChatForm
            handleSubmit={handleSubmit}
            isLoading={isProcessing}
            input={input}
            handleInputChange={handleInputChange}
            filesId={filesId}
            setFilesId={setFilesId}
            files={files}
            setFiles={setFiles}
            fileUploaded={fileUploaded}
            setFileUploaded={setFileUploaded}
            chatId={chatId}
            setChatId={setChatId}
            messages={globalMessages}
            onHeightChange={handleChatFormHeightChange}
          />
        </div>
      </div>
    </>
  );
}
