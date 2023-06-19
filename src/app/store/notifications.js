import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    ADD_NOTIFICATION: (state, action) => {
      return {
        ...state,
        item: action.payload,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    RESET_NOTIFICATIONS: (state, action) => initialState,
  },
});
export const { ADD_NOTIFICATION, RESET_NOTIFICATIONS } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
