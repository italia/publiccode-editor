import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languages: ["it"],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, action) => {
      console.log("setting langs to:", action.payload);
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
