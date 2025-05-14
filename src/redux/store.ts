import { configureStore } from "@reduxjs/toolkit";
import { loadingReducer } from "./slices/loading";
import { alertReducer } from "./slices/alert";
import { confirmModalReducer } from "./slices/confirm";
import { chatReducer } from "./slices/chat";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    alert: alertReducer,
    confirmModal: confirmModalReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
