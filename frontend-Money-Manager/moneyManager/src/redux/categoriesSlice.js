import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { set } from "idb-keyval";

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axiosConfig.get(Endpoints.GETALLCATEGORIES);
    return response.data;
  },
);
const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.status = "succeeded";
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      set("categories", JSON.parse(JSON.stringify(state.categories)));
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
      set("categories", JSON.parse(JSON.stringify(state.categories)));
    },
    clearCategories: (state) => {
      state.categories = [];
      set("categories", []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
        set("categories", JSON.parse(JSON.stringify(state.categories)));
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCategories, addCategory, removeCategory, clearCategories } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
