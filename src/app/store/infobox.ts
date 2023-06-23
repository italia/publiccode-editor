import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InfoBoxState {
  title: string | null;
  description: string | null;
  visible: boolean;
}

const initialState: InfoBoxState = {
  title: null,
  description: null,
  visible: false,
};

export const infoboxSlice = createSlice({
  name: "infobox",
  initialState,
  reducers: {
    show: (
      _,
      action: PayloadAction<{ title: string; description: string }>
    ) => ({
      title: action.payload.title,
      description: action.payload.description,
      visible: true,
    }),
    hide: () => initialState,
  },
});
export const { show, hide } = infoboxSlice.actions;

export default infoboxSlice.reducer;
