import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Notification {
  type: "error" | "info";
  msg: string;
  title?: string;
  millis?: number;
}

interface NotificationsState {
  item: Notification | null;
}

const initialState: NotificationsState = {
  item: null,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    ADD_NOTIFICATION: (_, action: PayloadAction<Notification>) => ({
      item: action.payload,
    }),
    RESET_NOTIFICATIONS: () => initialState,
  },
});
export const { ADD_NOTIFICATION, RESET_NOTIFICATIONS } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
