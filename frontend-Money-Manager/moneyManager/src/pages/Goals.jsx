import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import {
  Target,
  Plus,
  Flag,
  Calendar,
  Trophy,
  Sparkles,
  X,
  ChevronDown,
  Trash2,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import EmojiPickerInput from "../components/EmojiPicker";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGoals,
  createGoal,
  deleteGoal,
  reopenGoal,
  completeGoal,
} from "../redux/goalSlice";
import { fetchDashboardData } from "../redux/profileSlice";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { fetchCategories } from "../redux/categoriesSlice";
import { fetchExpenses } from "../redux/expenseSlice";
import { fetchTeamDashboardData } from "../redux/teamSlice";

const priorityStyles = {
  HIGH: "bg-rose-100 text-rose-600",
  MEDIUM: "bg-amber-100 text-amber-600",
  LOW: "bg-sky-100 text-sky-600",
};

const statusStyles = {
  IN_PROGRESS: "bg-violet-100 text-violet-600",
  COMPLETED: "bg-emerald-100 text-emerald-600",
  CANCELLED: "bg-gray-200 text-gray-500",
};

const statusLabels = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const priorityLabels = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const Goals = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFundModal, setOpenFundModal] = useState(false);
  const [fundingGoal, setFundingGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState(0);
  const [completingGoalId, setCompletingGoalId] = useState(null);

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profiles);
  const { goals, loading, error } = useSelector((state) => state.goals);
  const totalBalance =
    useSelector((state) => state.profiles?.dashboard?.totalBalance) || 0;

  const [form, setForm] = useState({
    userId: profile.id,
    name: "",
    icon: "",
    targetAmount: 0,
    deadline: "",
    priority: "",
  });

  useEffect(() => {
    dispatch(fetchGoals(profile.id));
  }, [dispatch]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDeadline = (value) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  function handleWrite(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function handleIconSelected(icon) {
    setForm({ ...form, icon });
  }

  function resetForm() {
    setForm({
      userId: profile.id,
      name: "",
      icon: "",
      targetAmount: 0,
      deadline: "",
      priority: "",
    });
  }

  function openFundGoalModal(goal) {
    setFundingGoal(goal);
    setFundAmount(goal.currentAmount);
    setOpenFundModal(true);
  }

  function closeFundGoalModal() {
    setOpenFundModal(false);
    setFundingGoal(null);
    setFundAmount(0);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (
      !form.targetAmount ||
      isNaN(form.targetAmount) ||
      Number(form.targetAmount) <= 0
    ) {
      toast.error("Target amount is required");
      return;
    }

    if (!form.deadline) {
      toast.error("Deadline is required");
      return;
    }

    if (!form.priority) {
      toast.error("Priority is required");
      return;
    }

    try {
      await dispatch(
        createGoal({
          userId: profile.id,
          name: form.name,
          icon: form.icon,
          targetAmount: Number(form.targetAmount),
          deadline: form.deadline,
          priority: form.priority,
        }),
      ).unwrap();

      toast.success("Goal created successfully");
      setOpenCreateModal(false);
      resetForm();
    } catch (submitError) {
      toast.error(submitError || "Something went wrong");
    }
  }

  async function handleDeleteGoal(goalId) {
    try {
      await dispatch(deleteGoal(goalId)).unwrap();
      toast.success("Goal deleted successfully");
    } catch (deleteError) {
      toast.error(deleteError || "Something went wrong");
    }
  }

  async function handleReopenGoal(goalId) {
    try {
      await dispatch(reopenGoal(goalId)).unwrap();
      toast.success("Goal reopened successfully");
    } catch (reopenError) {
      toast.error(reopenError || "Something went wrong");
    }
  }

  async function handleCompleteGoal(goalId) {
    setCompletingGoalId(goalId);
    try {
      await dispatch(completeGoal(goalId)).unwrap();

      // Completing a goal can create a new category/expense on the backend,
      // so refresh everything that could be affected.
      dispatch(fetchDashboardData());
      dispatch(fetchCategories());
      dispatch(fetchExpenses());
      dispatch(fetchTeamDashboardData());

      toast.success("Goal completed successfully");
    } catch (completeError) {
      toast.error(completeError || "Something went wrong");
    } finally {
      setCompletingGoalId(null);
    }
  }

  async function handleFundGoal() {
    if (!fundingGoal) return;

    const amount = Number(fundAmount) - Number(fundingGoal.currentAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than the current funded amount");
      return;
    }

    if (amount > totalBalance) {
      toast.error("Please select an amount based on your balance");
      return;
    }

    try {
      const response = await axiosConfig.patch(
        Endpoints.UPDATEGOALCURRENTAMOUNT,
        {
          goalId: fundingGoal.id,
          amount,
        },
      );
      if (response.status === 200) {
        dispatch(fetchGoals(profile.id));
        dispatch(fetchDashboardData());
        dispatch(fetchCategories());
        dispatch(fetchExpenses());
        dispatch(fetchTeamDashboardData());
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    closeFundGoalModal();
  }

  const isLoading = loading.fetch;
  const isEmpty = !isLoading && (!goals || goals.length === 0);
  const fundProgress = fundingGoal
    ? Math.min(100, Math.round((fundAmount / fundingGoal.targetAmount) * 100))
    : 0;
  const fundMax = fundingGoal
    ? Math.min(
        fundingGoal.targetAmount,
        fundingGoal.currentAmount + totalBalance,
      )
    : 0;

  return (
    <div>
      <Dashboard activeMenu={"Goals"}>
        <div className="my-5 mx-auto max-w-5xl">
          <div className="relative flex items-center justify-between gap-4 mb-8 pt-4 pb-2 overflow-hidden">
            <div className="absolute top-0 left-10 w-56 h-56 bg-violet-300/20 rounded-full blur-3xl -z-10" />
            <div className="absolute top-0 right-10 w-56 h-56 bg-fuchsia-300/20 rounded-full blur-3xl -z-10" />

            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rotate-6 opacity-20 blur-sm" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center ring-4 ring-white shadow-md">
                  <Trophy className="text-violet-600" size={20} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Goals</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Track progress toward the things that matter to you
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:brightness-110 transition-all text-white font-semibold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-violet-300/50 shrink-0"
            >
              <Plus size={16} />
              New Goal
            </button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-3xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center text-center gap-3 py-14 px-6 rounded-3xl border border-red-100 bg-red-50/60 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-500" size={22} />
              </div>
              <div>
                <p className="text-red-700 font-semibold">
                  Couldn't load your goals
                </p>
                <p className="text-red-400 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => dispatch(fetchGoals(profile.id))}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 bg-white hover:bg-red-100 transition-colors py-1.5 px-4 rounded-xl"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {isEmpty && !error && (
            <div className="flex flex-col items-center text-center gap-2.5 py-16 px-6 rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                <Trophy className="text-gray-300" size={26} />
              </div>
              <p className="text-gray-700 font-semibold">No goals yet</p>
              <p className="text-gray-400 text-sm">
                Create your first goal to start tracking progress
              </p>
            </div>
          )}

          {!isLoading && !error && goals && goals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-10">
              {goals.map((goal) => {
                const progress = Math.min(
                  100,
                  Math.round((goal.currentAmount / goal.targetAmount) * 100),
                );

                return (
                  <div
                    key={goal.id}
                    className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-violet-100 transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                          {goal.icon ? (
                            <img
                              src={goal.icon}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <Target className="text-violet-400" size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-800">
                            {goal.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                            <Calendar size={12} />
                            {formatDeadline(goal.deadline)}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[goal.status]}`}
                      >
                        {statusLabels[goal.status]}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-end justify-between mb-1.5">
                        <p className="text-lg font-bold text-gray-800">
                          {formatCurrency(goal.currentAmount)}
                          <span className="text-sm font-medium text-gray-400">
                            {" "}
                            / {formatCurrency(goal.targetAmount)}
                          </span>
                        </p>
                        <p className="text-xs font-semibold text-violet-500">
                          {progress}%
                        </p>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Flag size={13} className="text-gray-300" />
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${priorityStyles[goal.priority]}`}
                        >
                          {priorityLabels[goal.priority]} priority
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
                        left
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {goal.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleCompleteGoal(goal.id)}
                            disabled={completingGoalId === goal.id}
                            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 py-1.5 px-3 rounded-xl hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {completingGoalId === goal.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            Complete
                          </button>
                        )}
                        {goal.status !== "IN_PROGRESS" && (
                          <button
                            onClick={() => handleReopenGoal(goal.id)}
                            disabled={loading.update}
                            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 py-1.5 px-3 rounded-xl hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RotateCcw size={13} />
                            Reopen
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openFundGoalModal(goal)}
                          className="flex items-center gap-1.5 text-xs font-medium text-green-500 hover:text-green-600 py-1.5 px-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trophy size={13} />
                          Fund Goal
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          disabled={loading.delete}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Modal
          isOpen={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false);
            resetForm();
          }}
          title="Create goal"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-violet-500 bg-violet-50 rounded-xl px-3 py-2">
              <Sparkles size={13} />
              Set a target and we'll track your progress toward it
            </div>

            <EmojiPickerInput
              icon={form.icon}
              onSelected={handleIconSelected}
            />

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Goal name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={handleWrite}
                placeholder="e.g. Emergency Fund"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Target amount
              </label>
              <input
                type="number"
                id="targetAmount"
                value={form.targetAmount}
                onChange={handleWrite}
                placeholder="5000"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={form.deadline}
                  onChange={handleWrite}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    value={form.priority}
                    onChange={handleWrite}
                    className="w-full appearance-none text-sm border border-gray-200 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="">Select priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpenCreateModal(false);
                  resetForm();
                }}
                disabled={loading.create}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 py-2.5 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading.create}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:brightness-110 transition-all text-white font-semibold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-violet-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.create ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Target size={15} />
                )}
                {loading.create ? "Creating..." : "Create Goal"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={openFundModal}
          onClose={closeFundGoalModal}
          title="Fund goal"
        >
          {fundingGoal && (
            <div className="space-y-6">
              <style>{`
                .vertical-fund-slider {
                  -webkit-appearance: none;
                  appearance: none;
                  background: transparent;
                }
                .vertical-fund-slider::-webkit-slider-runnable-track {
                  background: transparent;
                }
                .vertical-fund-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 22px;
                  height: 22px;
                  border-radius: 9999px;
                  background: #7c3aed;
                  border: 3px solid white;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                  cursor: pointer;
                }
                .vertical-fund-slider::-moz-range-track {
                  background: transparent;
                }
                .vertical-fund-slider::-moz-range-thumb {
                  width: 22px;
                  height: 22px;
                  border-radius: 9999px;
                  background: #7c3aed;
                  border: 3px solid white;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                  cursor: pointer;
                }
              `}</style>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {fundingGoal.icon ? (
                    <img
                      src={fundingGoal.icon}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Target className="text-violet-400" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-800">
                    {fundingGoal.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Target {formatCurrency(fundingGoal.targetAmount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-violet-500 bg-violet-50 rounded-xl px-3 py-2">
                <Sparkles size={13} />
                Available balance: {formatCurrency(totalBalance)}
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(fundAmount)}
                </p>
                <p className="text-xs font-semibold text-violet-500">
                  {fundProgress}% of goal
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full" style={{ height: 24 }}>
                  <div
                    className="absolute top-1/2 left-0 right-0 h-3 rounded-full bg-gray-100"
                    style={{ transform: "translateY(-50%)" }}
                  />
                  <div
                    className="absolute top-1/2 left-0 h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-150"
                    style={{
                      transform: "translateY(-50%)",
                      width: `${fundProgress}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={fundMax}
                    step={1}
                    value={fundAmount}
                    onChange={(e) => setFundAmount(Number(e.target.value))}
                    className="vertical-fund-slider absolute top-1/2 left-0 w-full cursor-pointer"
                    style={{
                      height: 24,
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between w-full text-[11px] text-gray-400">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(fundMax)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeFundGoalModal}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 py-2.5 px-4 transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFundGoal}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:brightness-110 transition-all text-white font-semibold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-violet-300/50"
                >
                  <Trophy size={15} />
                  Fund Goal
                </button>
              </div>
            </div>
          )}
        </Modal>
      </Dashboard>
    </div>
  );
};

export default Goals;
