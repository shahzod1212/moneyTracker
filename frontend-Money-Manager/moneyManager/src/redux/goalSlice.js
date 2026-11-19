import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { set } from "idb-keyval";

const initialState = {
  goals: [],
  selectedGoal: null,

  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },

  error: null,
};

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(
        Endpoints.GETGOALSBYPROFILE(userId),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalRequest, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.post(
        Endpoints.CREATEGOAL,
        goalRequest,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const completeGoal = createAsyncThunk(
  "goals/completeGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.patch(Endpoints.COMPLETEGOAL(goalId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const cancelGoal = createAsyncThunk(
  "goals/cancelGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.patch(Endpoints.CANCELGOAL(goalId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const reopenGoal = createAsyncThunk(
  "goals/reopenGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.patch(Endpoints.REOPENGOAL(goalId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      await axiosConfig.delete(Endpoints.DELETEGOAL(goalId));
      return goalId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setInitialStateGoals: (state, action) => {
      state.goals = action.payload;

      set("goals", JSON.parse(JSON.stringify(state.goals)));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.goals = action.payload;

        set("goals", JSON.parse(JSON.stringify(state.goals)));
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createGoal.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading.create = false;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(completeGoal.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(completeGoal.fulfilled, (state, action) => {
        state.loading.update = false;

        const index = state.goals.findIndex(
          (goal) => goal.id === action.payload.id,
        );

        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(completeGoal.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(cancelGoal.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(cancelGoal.fulfilled, (state, action) => {
        state.loading.update = false;

        const index = state.goals.findIndex(
          (goal) => goal.id === action.payload.id,
        );

        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(cancelGoal.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(reopenGoal.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(reopenGoal.fulfilled, (state, action) => {
        state.loading.update = false;

        const index = state.goals.findIndex(
          (goal) => goal.id === action.payload.id,
        );

        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(reopenGoal.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(deleteGoal.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});
export const { setInitialStateGoals } = goalSlice.actions;
export default goalSlice.reducer;
