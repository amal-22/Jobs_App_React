import { configureStore, Action } from "@reduxjs/toolkit";
import thunk, { ThunkAction } from "redux-thunk";

import rootReducer, { RootState } from "./rootReducer";

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof appStore.dispatch;
