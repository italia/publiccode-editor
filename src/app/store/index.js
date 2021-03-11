import { combineReducers } from "redux";
import notifications from "./notifications";
import infobox from "./infobox";
import { configureStore } from "@reduxjs/toolkit";

const reducer = combineReducers({
  notifications: notifications,
  infobox: infobox,
  // cache: cache,
  // data: data
});

export default configureStore({
  reducer: {
    reducer,
  },
});
