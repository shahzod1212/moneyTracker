import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { del, set } from "idb-keyval";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";

const initialState = {
  username: "",
  email: "",
  id: 0,
  profileImageUrl: "",
  type: "",
  dashboard: null,
  status: "idle",
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "profile/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(Endpoints.DASHBOARDDATA);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setProfile: (state, action) => {
      const { username, email, profileImageUrl, id, status } = action.payload;
      state.username = username;
      state.email = email;
      state.profileImageUrl = profileImageUrl;
      state.id = id;
      state.type = status;
      state.status = "succeeded";
    },
    updateProfile: (state, action) => {
      const { fullName, email, profileImageUrl, id, status } = action.payload;
      state.username = fullName;
      state.email = email;
      state.profileImageUrl = profileImageUrl;
      state.id = id;
      state.type = status;
      set("profile", JSON.parse(JSON.stringify(state)));
    },
    removeProfile: (state) => {
      state.username = "";
      state.email = "";
      state.profileImageUrl = "";
      state.id = 0;
      state.type = "";
      del("profile");
    },
    setUploadImageUrl: (state, action) => {
      state.profileImageUrl = action.payload;
      set("profile", JSON.parse(JSON.stringify(state)));
    },
    setDashboard: (state, action) => {
      state.dashboard = action.payload;

      set("dashboard", JSON.parse(JSON.stringify(state.dashboard)));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboard = action.payload;

        set("dashboard", JSON.parse(JSON.stringify(state.dashboard)));
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setProfile,
  updateProfile,
  removeProfile,
  setUploadImageUrl,
  setDashboard,
} = profileSlice.actions;
export default profileSlice.reducer;
