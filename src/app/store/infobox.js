import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: null,
  description: null,
  visible: false,
};

export const infoboxSlice = createSlice({
  name: "infobox",
  initialState,
  reducers: {
    SHOW_INFO: (state, action) => {
      console.log(action);
      return {
        ...state,
        title: action.payload.title,
        description: action.payload.description,
        visible: true,
      };
    },
    // eslint-disable-next-line no-unused-vars
    HIDE_INFO: (state, action) => initialState,
  },
});
export const { SHOW_INFO, HIDE_INFO } = infoboxSlice.actions;

export default infoboxSlice.reducer;
