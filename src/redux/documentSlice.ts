import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DocumentState {
  lastUpdated: string | null;
  updatedBy: string;
  content: string;
}

const initialState: DocumentState = {
  lastUpdated: null,
  updatedBy: "User123",
  content: "",
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    updateDocumentStatus: (state, action: PayloadAction<DocumentState>) => {
      state.content = action.payload.content;
      state.lastUpdated = new Date().toISOString();
      state.updatedBy = action.payload.updatedBy;
    },
  },
});

export const { updateDocumentStatus } = documentSlice.actions;
export default documentSlice.reducer;
