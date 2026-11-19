import { useEffect } from "react";
import { get } from "idb-keyval";
import { useDispatch } from "react-redux";
import { setDashboard, setProfile } from "../redux/profileSlice";
import { setExpenses } from "../redux/expenseSlice";
import { setIncomes } from "../redux/incomesSlice";
import { setCategories } from "../redux/categoriesSlice";
import {
  setDashboardData,
  setTeam,
  setTeamExpenses,
  setTeamIncomes,
  setTeamProfile,
} from "../redux/teamSlice";
import { setInitialState } from "../redux/aiSlice";
import { setInitialStateGoals } from "../redux/goalSlice";

const useHydrateRedux = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        const profile = await get("profile");
        const expenses = await get("expenses");
        const incomes = await get("incomes");
        const categories = await get("categories");
        const team = await get("teamMember");
        const teamIncomes = await get("teamIncomes");
        const teamExpenses = await get("teamExpenses");
        const teamDashboardData = await get("teamDashboardData");
        const teamProfile = await get("teamProfile");
        const dashboard = await get("dashboard");
        const summary = await get("summary");
        const recommendations = await get("recommendations");
        const goals = await get("goals");

        if (!isMounted) return;

        if (profile) {
          dispatch(setProfile(profile));
        }
        if (expenses) {
          dispatch(setExpenses(expenses));
        }
        if (incomes) {
          dispatch(setIncomes(incomes));
        }
        if (categories) {
          dispatch(setCategories(categories));
        }
        if (team) {
          dispatch(setTeam(team));
        }
        if (teamProfile) {
          dispatch(setTeamProfile(teamProfile));
        }
        if (teamDashboardData) {
          dispatch(setDashboardData(teamDashboardData));
        }
        if (teamExpenses) {
          dispatch(setTeamExpenses(teamExpenses));
        }
        if (teamIncomes) {
          dispatch(setTeamIncomes(teamIncomes));
        }

        if (dashboard) {
          dispatch(setDashboard(dashboard));
        }

        if (summary && recommendations) {
          dispatch(
            setInitialState({
              summary: summary,
              recommendations: recommendations,
            }),
          );
        }

        if (goals) {
          dispatch(setInitialStateGoals(goals));
        }
      } catch (error) {
        console.error("Error hydrating Redux state:", error);
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useHydrateRedux;
