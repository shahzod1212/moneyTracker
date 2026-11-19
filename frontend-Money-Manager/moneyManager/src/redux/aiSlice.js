import { createSlice } from "@reduxjs/toolkit";
import { set } from "idb-keyval";

const initialState = {
  summary: "",
  recommendations: [],
  question: "",
};

const aiSlice = createSlice({
  name: "ai",
  initialState: initialState,
  reducers: {
    setInitialState: (state, action) => {
      state.summary = action.payload.summary;
      state.recommendations = action.payload.recommendations;
    },
    setAnswer: (state, action) => {
      state.summary = action.payload.summary;
      state.recommendations = action.payload.recommendations;

      set("summary", JSON.parse(JSON.stringify(state.summary)));
      set("recommendations", JSON.parse(JSON.stringify(state.recommendations)));
    },
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
  },
});

export const { setInitialState, setAnswer, setQuestion } = aiSlice.actions;
export default aiSlice.reducer;
