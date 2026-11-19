import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchProfileUsers = createAsyncThunk(
  "profileUsers/fetchProfileUsers",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(Endpoints.SEARCHBYNAME(keyword));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const profileUsersSlice = createSlice({
  name: "profileUsers",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchProfileUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileUsersSlice.reducer;
