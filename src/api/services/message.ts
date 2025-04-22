import axios from "axios";
import { CreateMessageDto, FeedbackDto } from "../dto";

const API_DOMAIN = process.env.NEXT_PUBLIC_HTTP_API_DOMAIN;

export const createMessage = async (data: CreateMessageDto, token: string) => {
  try {
    const formData = new FormData();

    // Convert data object to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios.post(`${API_DOMAIN}/messages/send`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
        offset: 0,
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

export const feedbackMessage = async (data: FeedbackDto, token: string) => {
  try {
    const response = await axios.post(
      `${API_DOMAIN}/feedback/feedback`,
      {
        message_id: data.message_id,
        feedback: data.feedback,
        comment: data.comment,
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
