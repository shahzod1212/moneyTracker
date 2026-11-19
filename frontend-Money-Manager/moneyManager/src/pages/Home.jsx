import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import InfoCard from "../components/InfoCard";
import {
  Coins,
  Wallet,
  WalletCards,
  User,
  Users,
  Sparkles,
  Trophy,
  ChevronRight,
  Target,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import RecentTransactions from "../components/RecentTransactions";
import FinanceOverveiw from "../components/FinanceOverveiw";
import Transactions from "../components/Transactions";
import SpendingCalendar from "../components/SpendingCalendar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileMembers,
  fetchTeamDashboardData,
  fetchTeamIncomes,
  fetchTeamExpenses,
} from "../redux/teamSlice";
import { fetchDashboardData, updateProfile } from "../redux/profileSlice";
import { fetchIncomes } from "../redux/incomesSlice";
import { fetchExpenses } from "../redux/expenseSlice";
import { fetchGoals } from "../redux/goalSlice";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarGradients = [
  "from-violet-400 to-emerald-400",
  "from-amber-400 to-rose-400",
  "from-sky-400 to-indigo-400",
];

const priorityDot = {
  HIGH: "bg-rose-400",
  MEDIUM: "bg-amber-400",
  LOW: "bg-sky-400",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDeadline = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const GoalsOverview = ({ goals, loading, onNavigate }) => {
  const activeGoals = (goals || []).filter(
    (goal) => goal.status === "IN_PROGRESS",
  );

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center shrink-0">
          <Trophy className="text-violet-600" size={16} />
        </div>
        <h3 className="text-base font-bold text-gray-800">Your Goals</h3>
        <button
          onClick={onNavigate}
          className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 ml-auto shrink-0"
        >
          View all
          <ChevronRight size={13} />
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && activeGoals.length === 0 && (
        <button
          onClick={onNavigate}
          className="w-full flex flex-col items-center justify-center text-center gap-2 py-10 rounded-2xl border border-dashed border-gray-200 hover:border-violet-200 hover:bg-violet-50/40 transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Target className="text-violet-400" size={20} />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            No active goals yet
          </p>
          <p className="text-xs text-gray-400">Tap to set your first one</p>
        </button>
      )}

      {!loading && activeGoals.length > 0 && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activeGoals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
            );

            return (
              <button
                key={goal.id}
                onClick={onNavigate}
                className="group w-full text-left flex items-center gap-3 border border-gray-100 hover:border-violet-200 hover:shadow-sm rounded-2xl px-3.5 py-3 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {goal.icon ? (
                    <img
                      src={goal.icon}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <Target className="text-violet-400" size={16} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {goal.name}
                    </p>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[goal.priority]}`}
                    />
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-gray-400">
                      {formatCurrency(goal.currentAmount)} /{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar size={10} />
                      {formatDeadline(goal.deadline)}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className="text-gray-300 group-hover:text-violet-400 transition-colors shrink-0"
                  size={16}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profiles);
  const teamDashboardData = useSelector((state) => state.team?.dashboardData);
  const teamProfile = useSelector((state) => state.team?.teamProfile) || [];
  const teamId = useSelector((state) => state.team?.team?.id);
  const personalData = useSelector((state) => state.profiles?.dashboard);
  const teamIncomes = useSelector((state) => state.team.incomes);
  const teamExpenses = useSelector((state) => state.team.expenses);
  const allIncomes = useSelector((state) => state.incomes?.incomes) || [];
  const allExpenses = useSelector((state) => state.expenses?.expenses) || [];
  const goals = useSelector((state) => state.goals?.goals) || [];
  const goalsLoading = useSelector((state) => state.goals?.loading?.fetch);

  async function fetchProfile() {
    try {
      const response = await axiosConfig.get(Endpoints.GETPROFILE);

      if (response.status === 200) {
        dispatch(updateProfile(response.data));
      }
    } catch (error) {
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    fetchProfile();
    dispatch(fetchDashboardData());
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
    dispatch(fetchGoals(profile.id));
    if (teamId) {
      dispatch(fetchTeamDashboardData(teamId));
      dispatch(fetchProfileMembers(teamId));
      dispatch(fetchTeamIncomes(teamId));
      dispatch(fetchTeamExpenses(teamId));
    }
  }, []);

  const isTeam = profile.type === "TEAM";
  const data = isTeam ? teamDashboardData : personalData;
  const calendarIncomes = isTeam ? teamIncomes : allIncomes;
  const calendarExpenses = isTeam ? teamExpenses : allExpenses;
  const totalFundedToGoals = goals
    .filter((goal) => goal.status !== "CANCELLED")
    .reduce((sum, goal) => sum + Number(goal.currentAmount || 0), 0);

  return (
    <div>
      <Dashboard activeMenu="Dashboard">
        <div className="my-5 mx-auto space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-violet-500" size={18} />
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome back{profile?.username ? `, ${profile.username}` : ""}
                </h1>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {isTeam
                  ? "Here's how your team is doing today"
                  : "Here's your financial snapshot for today"}
              </p>
            </div>
            {isTeam && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-3.5 py-1.5">
                <Users size={13} />
                Team Account
              </span>
            )}
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<WalletCards />}
                label={isTeam ? "Team Total Balance" : "Total Balance"}
                value={
                  <>
                    {formatCurrency(
                      (data?.totalBalance || 0) - totalFundedToGoals,
                    )}
                    {!isTeam && totalFundedToGoals > 0 && (
                      <span className="text-xs font-normal text-gray-400 ml-1.5">
                        (+{formatCurrency(totalFundedToGoals)})
                      </span>
                    )}
                  </>
                }
                color="bg-purple-800"
              />

              <InfoCard
                icon={<Wallet />}
                label={isTeam ? "Team Total Income" : "Total Income"}
                value={formatCurrency(data?.totalIncome || 0)}
                color="bg-green-800"
              />

              <InfoCard
                icon={<Coins />}
                label={isTeam ? "Team Total Expense" : "Total Expense"}
                value={formatCurrency(data?.totalExpense || 0)}
                color="bg-red-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <RecentTransactions
                transactions={data?.recentTransactions || []}
                onMore={() => navigate("/expense")}
              />
              <FinanceOverveiw
                totalBalance={data?.totalBalance || 0}
                totalIncome={data?.totalIncome || 0}
                totalExpense={data?.totalExpense || 0}
              />
              <Transactions
                transactions={data?.recentIncome}
                onMore={() => navigate("/income")}
                type="income"
              />
              <Transactions
                transactions={data?.recentExpense}
                onMore={() => navigate("/expense")}
                type="expense"
              />
            </div>
          </div>

          {isTeam && teamProfile.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                  <Users className="text-violet-600" size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-800">
                  Team Members
                </h3>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5 ml-auto">
                  {teamProfile.length} / 3
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {teamProfile.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all duration-200 rounded-2xl pl-1.5 pr-4 py-1.5"
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-tr ${
                        avatarGradients[index % avatarGradients.length]
                      } p-0.5 shrink-0`}
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {member.profileImageUrl ? (
                          <img
                            src={member.profileImageUrl}
                            alt={member.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-700">
                            {getInitials(member.fullName)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {member.fullName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isTeam && (
            <div className="bg-gradient-to-br from-violet-50/60 via-white to-emerald-50/40 rounded-3xl border border-violet-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                  <User className="text-violet-600" size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-800">
                  Your Personal Overview
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur border border-purple-100 rounded-2xl px-4 py-3.5 hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-200">
                    <WalletCards size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium">
                      Your Balance
                    </p>
                    <p className="text-base font-bold text-gray-800 truncate">
                      {formatCurrency(
                        (personalData?.totalBalance || 0) - totalFundedToGoals,
                      )}
                      {totalFundedToGoals > 0 && (
                        <span className="text-[11px] font-normal text-gray-400 ml-1.5">
                          (+{formatCurrency(totalFundedToGoals)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/80 backdrop-blur border border-green-100 rounded-2xl px-4 py-3.5 hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white shrink-0 shadow-sm shadow-green-200">
                    <Wallet size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium">
                      Your Income
                    </p>
                    <p className="text-base font-bold text-gray-800 truncate">
                      {formatCurrency(personalData?.totalIncome || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/80 backdrop-blur border border-red-100 rounded-2xl px-4 py-3.5 hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white shrink-0 shadow-sm shadow-red-200">
                    <Coins size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium">
                      Your Expense
                    </p>
                    <p className="text-base font-bold text-gray-800 truncate">
                      {formatCurrency(personalData?.totalExpense || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <SpendingCalendar
            incomes={calendarIncomes}
            expenses={calendarExpenses}
          />

          <GoalsOverview
            goals={goals}
            loading={goalsLoading}
            onNavigate={() => navigate("/goals")}
          />
        </div>
      </Dashboard>
    </div>
  );
};

export default Home;
