import axios from "axios";
import { CreateMessageDto } from "../dto";
import { websocketService } from "./websocket";

const API_DOMAIN = process.env.NEXT_PUBLIC_HTTP_API_DOMAIN;

export const createMessage = async (data: CreateMessageDto, token: string) => {
  try {
    const formData = new FormData();

    // Convert data object to FormData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.post(`${API_DOMAIN}/messages/send`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // We'll handle the WebSocket connection in the component, so just return the data
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const getMessages = async (conversationId: number, token: string) => {
  try {
    const response = await axios.post(
      `${API_DOMAIN}/conversations/messages`,
      {
        conversation_id: conversationId,
        limit: 50,
        offset: 0
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
