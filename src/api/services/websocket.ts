import { Message } from "../../../utils/interfaces";

interface WebSocketMessage {
  status: string;
  data: {
    response: string;
    message_id: string;
    conversation_id: string;
  };
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private currentRequestId: string | null = null;
  private requestIdHandlers: Map<string, (message: Message) => void> = new Map();

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  connect(requestId: string) {
    console.log(requestId, "requestId test");
    // If already connected to the same requestId, do nothing
    if (this.isConnected() && this.currentRequestId === requestId) {
      return;
    }

    // If connected to a different requestId, close the connection
    if (this.ws) {
      this.ws.close();
    }

    this.currentRequestId = requestId;
    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_API_DOMAIN}/ws/${requestId}`);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.ws.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
      const data: WebSocketMessage = JSON.parse(event.data);

      console.log("Parsed WebSocket data:", data);

      if (data.status === "success") {
        // Ensure message_id is a number
        const messageId =
          typeof data.data.message_id === "string" ? parseInt(data.data.message_id, 10) : data.data.message_id;

        // Ensure conversation_id is a number
        const conversationId =
          typeof data.data.conversation_id === "string"
            ? parseInt(data.data.conversation_id, 10)
            : data.data.conversation_id;

        const message: Message = {
          id: messageId,
          content: data.data.response,
          role: "assistant",
          conversationId: conversationId,
          createdAt: new Date().toISOString(),
        };

        console.log("Created message object:", message);

        // Use request_id handler
        if (this.currentRequestId) {
          const requestIdHandler = this.requestIdHandlers.get(this.currentRequestId);
          if (requestIdHandler) {
            requestIdHandler(message);
          }
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      this.ws = null;
      this.currentRequestId = null;
    };
  }

  subscribeToRequest(requestId: string, handler: (message: Message) => void) {
    console.log("Subscribing to request:", requestId);
    this.requestIdHandlers.set(requestId, handler);
  }

  unsubscribeFromRequest(requestId: string) {
    this.requestIdHandlers.delete(requestId);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.currentRequestId = null;
    }
    this.requestIdHandlers.clear();
  }
}

export const websocketService = new WebSocketService();
