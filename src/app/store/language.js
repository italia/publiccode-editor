import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLanguage: "it",
  languages: ["it"],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setCurrentLanguage: (state, action) => {
      console.log(action);
      return {
        ...state,
        currentLanguage: action.payload,
      };
    },
    setLanguages: (state, action) => {
      return {
        ...state,
        languages: action.payload,
      };
    },
  },
});
export const { setCurrentLanguage, setLanguages } = languageSlice.actions;

export default languageSlice.reducer;
