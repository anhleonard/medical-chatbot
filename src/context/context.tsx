"use client";

import { ChatHistory } from "@/types/chat";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { getConversations } from "@/api/services/conversation";
import { getAccessToken } from "@/storage/storage";

interface Context {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  chats: ChatHistory[];
  setChats: Dispatch<SetStateAction<ChatHistory[]>>;
  isLoadingChats: boolean;
  setIsLoadingChats: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<Context>({
  isVisible: true,
  setIsVisible: () => {},
  chats: [],
  setChats: () => {},
  isLoadingChats: true,
  setIsLoadingChats: () => {},
});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }
        
        const response = await getConversations(token);

        const mappedChats = response.map((chat: any) => ({
          id: chat?.id,
          title: chat?.title,
          updated_at: chat?.updated_at,
          created_at: chat?.created_at,
        }));
        
        setChats(mappedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setIsLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Context.Provider
      value={{
        isVisible,
        setIsVisible,
        chats,
        setChats,
        isLoadingChats,
        setIsLoadingChats,
      }}
    >
      {children}
    </Context.Provider>
  );
};
