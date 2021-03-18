import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languages: ["it"],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, action) => {
      return {
        ...state,
        languages: action.payload,
      };
    },
  },
});
export const { setLanguages } = languageSlice.actions;

export default languageSlice.reducer;
