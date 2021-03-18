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
    show: (state, action) => {
      return {
        ...state,
        title: action.payload.title,
        description: action.payload.description,
        visible: true,
      };
    },
    // eslint-disable-next-line no-unused-vars
    hide: (state, action) => initialState,
  },
});
export const { show, hide } = infoboxSlice.actions;

export default infoboxSlice.reducer;
