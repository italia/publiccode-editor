import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FALLBACK_LANGUAGE } from "../contents/constants";

interface PubliccodeYmlLanguages {
  languages: Array<string>;
}

const initialState: PubliccodeYmlLanguages = {
  // Fallback to the UI language as last resort
  languages: [FALLBACK_LANGUAGE],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setPubliccodeYmlLanguages: (_, action: PayloadAction<Array<string>>) => ({
      languages: action.payload,
    }),
    resetPubliccodeYmlLanguages: () => initialState,
  },
});

export const getPubliccodeYmlLanguages = (state: {
  language: { languages: unknown };
}) => state.language.languages;

export const { setPubliccodeYmlLanguages, resetPubliccodeYmlLanguages } =
  languageSlice.actions;

export default languageSlice.reducer;
