import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_LANGUAGE } from "../contents/constants";

interface LanguageState {
  languages: Array<string>;
}

const initialState: LanguageState = {
  languages: [DEFAULT_LANGUAGE],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (_, action: PayloadAction<Array<string>>) => ({
      languages: action.payload,
    }),
    resetLanguages: () => initialState,
  },
});
export const { setLanguages, resetLanguages } = languageSlice.actions;

export default languageSlice.reducer;
