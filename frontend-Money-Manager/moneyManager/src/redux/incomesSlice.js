import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { set } from "idb-keyval";

const initialState = {
  incomes: [],
  status: "idle",
  error: null,
};

export const fetchIncomes = createAsyncThunk(
  "incomes/fetchIncomes",
  async () => {
    const response = await axiosConfig.get(Endpoints.GETINCOMES);
    return response.data;
  },
);

const incomesSlice = createSlice({
  name: "incomes",
  initialState: initialState,
  reducers: {
    setIncomes: (state, action) => {
      state.incomes = action.payload;
      state.status = "succeeded";
    },
    addIncome: (state, action) => {
      state.incomes.push(action.payload);
      set("incomes", JSON.parse(JSON.stringify(state.incomes)));
    },
    removeIncome: (state, action) => {
      state.incomes = state.incomes.filter(
        (income) => income.id !== action.payload,
      );
      set("incomes", JSON.parse(JSON.stringify(state.incomes)));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.incomes = action.payload;
        set("incomes", JSON.parse(JSON.stringify(state.incomes)));
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setIncomes, addIncome, removeIncome } = incomesSlice.actions;
export default incomesSlice.reducer;
