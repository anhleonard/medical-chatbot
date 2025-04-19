import { configureStore } from "@reduxjs/toolkit";
import { loadingReducer } from "./slices/loading";
import { alertReducer } from "./slices/alert";
export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;