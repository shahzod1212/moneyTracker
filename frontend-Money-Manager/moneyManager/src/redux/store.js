import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categoriesSlice";
import expensesReducer from "./expenseSlice";
import incomesReducer from "./incomesSlice";
import profileReducer from "./profileSlice";
import teamReducer from "./teamSlice";
import profileUsersReducer from "./profileUsersSlice";
import aiReducer from "./aiSlice";
import goalReducer from "./goalSlice";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    expenses: expensesReducer,
    incomes: incomesReducer,
    profiles: profileReducer,
    team: teamReducer,
    users: profileUsersReducer,
    ai: aiReducer,
    goals: goalReducer,
  },
});

export default store;
