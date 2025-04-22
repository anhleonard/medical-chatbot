import axios from "axios";
import { websocketService } from "./websocket";

const API_DOMAIN = process.env.NEXT_PUBLIC_HTTP_API_DOMAIN;

export const getConversations = async (token: string) => {
  try {
    const response = await axios.post(
      `${API_DOMAIN}/conversations/list`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const updateConversationTitle = async (conversationId: number, title: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_DOMAIN}/conversations/rename`,
      {
        conversation_id: conversationId,
        title: title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const deleteConversation = async (conversationId: number, token: string) => {
  try {
    const response = await axios.delete(`${API_DOMAIN}/conversations/delete/${conversationId}`, {
      data: {
        conversation_id: conversationId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};
