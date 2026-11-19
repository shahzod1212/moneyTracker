import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, set } from "idb-keyval";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";

const initialState = {
  team: null,
  teamProfile: [],
  dashboardData: null,
  incomes: [],
  expenses: [],
  status: "idle",
  error: null,
  hydrated: false,
};

export const fetchProfileMembers = createAsyncThunk(
  "team/fetchProfileMembers",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(Endpoints.GETTEAMMEMBERS(teamId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTeamDashboardData = createAsyncThunk(
  "team/fetchTeamDashboardData",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(
        Endpoints.TEAMDASHBOARDDATA(teamId),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTeamIncomes = createAsyncThunk(
  "team/fetchTeamIncomes",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(Endpoints.GETTEAMINCOMES(teamId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTeamExpenses = createAsyncThunk(
  "team/fetchTeamExpenses",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(Endpoints.GETTEAMEXPENSES(teamId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const teamSlice = createSlice({
  name: "team",
  initialState: initialState,
  reducers: {
    setTeamProfile: (state, action) => {
      state.teamProfile = action.payload;

      set("teamProfile", JSON.parse(JSON.stringify(state.teamProfile)));
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;

      set("teamDashboardData", JSON.parse(JSON.stringify(state.dashboardData)));
    },
    setTeamIncomes: (state, action) => {
      state.incomes = action.payload;

      set("teamIncomes", JSON.parse(JSON.stringify(state.incomes)));
    },
    setTeamExpenses: (state, action) => {
      state.expenses = action.payload;

      set("teamExpenses", JSON.parse(JSON.stringify(state.expenses)));
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTeam: (state, action) => {
      state.team = action.payload;

      set("teamMember", JSON.parse(JSON.stringify(state.team)));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamProfile = action.payload;
        set("teamProfile", JSON.parse(JSON.stringify(state.teamProfile)));
      })
      .addCase(fetchProfileMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTeamDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeamDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
        set(
          "teamDashboardData",
          JSON.parse(JSON.stringify(state.dashboardData)),
        );
      })
      .addCase(fetchTeamDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTeamIncomes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeamIncomes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.incomes = action.payload;
        set("teamIncomes", JSON.parse(JSON.stringify(state.incomes)));
      })
      .addCase(fetchTeamIncomes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTeamExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeamExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
        set("teamExpenses", JSON.parse(JSON.stringify(state.expenses)));
      })
      .addCase(fetchTeamExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setTeamProfile,
  setDashboardData,
  setTeamIncomes,
  setTeamExpenses,
  setStatus,
  setError,
  setTeam,
} = teamSlice.actions;
export default teamSlice.reducer;
