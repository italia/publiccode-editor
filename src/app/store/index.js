import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./notifications";
import infoboxReducer from "./infobox";
import languageReducer from "./language";

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    infobox: infoboxReducer,
    language: languageReducer,
  },
});
