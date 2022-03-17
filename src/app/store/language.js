import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_LANGUAGE } from "../contents/constants";

const initialState = {
  languages: [DEFAULT_LANGUAGE],
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
    resetLanguages: (state, action) => {
      console.log("resetting langs to:", initialState);
      return {
        ...initialState,
      };
    },
  },
});
export const { setLanguages, resetLanguages } = languageSlice.actions;

export default languageSlice.reducer;
