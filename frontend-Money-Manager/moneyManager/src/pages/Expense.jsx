import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import toast from "react-hot-toast";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus, AlertCircle, RefreshCw, ReceiptText } from "lucide-react";
import AddIncomeFrom from "../components/addIncomeFrom";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverveiw from "../components/IncomeOverveiw";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  fetchExpenses,
  removeExpense,
} from "../redux/expenseSlice";
import { fetchCategories } from "../redux/categoriesSlice";

const Expense = () => {
  useUser();
  const dispatch = useDispatch();
  const { expenses, status, error } = useSelector((state) => state.expenses);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModel, setOpenExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  async function fetchAddCategoryByType() {
    try {
      const response = await axiosConfig.get(
        Endpoints.CATEGORIESBYTYPE("expense"),
      );

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function handleAddExpense(expense) {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount is required");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      toast.error("Date must be in past");
      return;
    }

    if (!categoryId) {
      toast.error("Category is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosConfig.post(Endpoints.ADDEXPENSE, {
        name,
        date,
        amount: Number(amount),
        categoryId: Number(categoryId),
        icon,
      });

      if (response.status === 200) {
        toast.success("Expense added successfully");
        setOpenExpenseModal(false);
        dispatch(addExpense(response.data));
        dispatch(fetchExpenses());
        dispatch(fetchCategories());
        fetchAddCategoryByType();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteExpense(id) {
    try {
      await axiosConfig.delete(Endpoints.DELETEEXPENSE(id));
      toast.success("Deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      dispatch(removeExpense(id));
      dispatch(fetchExpenses());
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    dispatch(fetchExpenses());
    fetchAddCategoryByType();
  }, [dispatch]);

  function handleDownloadExpenseDetails() {
    try {
      const fileName = "expense_details.xlsx";
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(expenses)]),
      );
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Downloaded successfully");
    } catch (error) {
      toast.error("Download failed");
    }
  }

  function handleEmailExpenseDetails() {
    toast.success("Email sent successfully");
  }

  const isLoading = status === "loading";
  const isFailed = status === "failed";
  const isEmpty =
    status === "succeeded" && (!expenses || expenses.length === 0);

  return (
    <div>
      <Dashboard activeMenu={"Expense"}>
        <div className="my-5 mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shrink-0">
              <ReceiptText className="text-red-600" size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Track and manage where your money goes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <IncomeOverveiw transactions={expenses} />

              <button
                onClick={() => setOpenExpenseModal(true)}
                disabled={loading}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-xl text-sm font-semibold shadow-sm hover:from-red-200 hover:to-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                Add Expense
              </button>
            </div>

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-3xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            )}

            {isFailed && (
              <div className="flex flex-col items-center text-center gap-3 py-14 px-6 rounded-3xl border border-red-100 bg-red-50/60">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={22} />
                </div>
                <div>
                  <p className="text-red-700 font-semibold">
                    Couldn't load your expenses
                  </p>
                  <p className="text-red-400 text-sm mt-1">
                    {error || "Something went wrong. Please try again."}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(fetchExpenses())}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 bg-white hover:bg-red-100 transition-colors py-1.5 px-4 rounded-xl"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            )}

            {isEmpty && (
              <div className="flex flex-col items-center text-center gap-2.5 py-16 px-6 rounded-3xl border border-dashed border-gray-200 bg-gray-50/60">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                  <ReceiptText className="text-gray-300" size={26} />
                </div>
                <p className="text-gray-700 font-semibold">No expenses yet</p>
                <p className="text-gray-400 text-sm">
                  Add your first expense to start tracking your spending
                </p>
              </div>
            )}

            {status === "succeeded" && expenses && expenses.length > 0 && (
              <IncomeList
                transactions={expenses}
                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                onDownload={handleDownloadExpenseDetails}
                onEmail={handleEmailExpenseDetails}
                text="Expense Source"
                color="red"
                type="expense"
              />
            )}

            <Modal
              isOpen={openAddExpenseModel}
              onClose={() => setOpenExpenseModal(false)}
              title="Add expense"
            >
              <AddIncomeFrom
                onAddIncome={handleAddExpense}
                categories={categories}
              />
            </Modal>

            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({ show: false, data: null })}
              title="Delete expense"
            >
              <DeleteAlert
                content="Are you sure you want to delete this expense?"
                onDelete={() => deleteExpense(openDeleteAlert.data)}
              />
            </Modal>
          </div>
        </div>
      </Dashboard>
    </div>
  );
};

export default Expense;
