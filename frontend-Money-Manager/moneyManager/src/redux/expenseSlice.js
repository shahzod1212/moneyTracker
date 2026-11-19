import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { set } from "idb-keyval";

const initialState = {
  expenses: [],
  status: "idle",
  error: null,
};
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await axiosConfig.get(Endpoints.GETEXPENSES);
    return response.data;
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.status = "succeeded";
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
      set("expenses", JSON.parse(JSON.stringify(state.expenses)));
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload,
      );
      set("expenses", JSON.parse(JSON.stringify(state.expenses)));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
        set("expenses", JSON.parse(JSON.stringify(state.expenses)));
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setExpenses, addExpense, removeExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
