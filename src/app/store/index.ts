import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import notificationsReducer from "./notifications";
import infoboxReducer from "./infobox";
import languageReducer from "./language";

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    infobox: infoboxReducer,
    language: languageReducer,
  },
});

export default store;

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
