import { Message } from "../../../utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chatId: number | null;
  messages: Message[];
}

const initialState: ChatState = {
  chatId: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<number | null>) => {
      state.chatId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    resetChat: (state) => {
      state.chatId = null;
      state.messages = [];
    },
  },
});

export const { setChatId, setMessages, resetChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
