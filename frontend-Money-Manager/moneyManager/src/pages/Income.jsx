import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import toast from "react-hot-toast";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus, AlertCircle, RefreshCw, Wallet } from "lucide-react";
import AddIncomeFrom from "../components/addIncomeFrom";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverveiw from "../components/IncomeOverveiw";
import { useDispatch, useSelector } from "react-redux";
import { addIncome, fetchIncomes, removeIncome } from "../redux/incomesSlice";

const Income = () => {
  useUser();
  const dispatch = useDispatch();
  const {
    incomes: incomeData,
    status,
    error,
  } = useSelector((state) => state.incomes);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModel, setOpenIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  async function fetchAddCategoryByType() {
    try {
      const response = await axiosConfig.get(
        Endpoints.CATEGORIESBYTYPE("income"),
      );
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    }
  }

  async function handleAddIncome(income) {
    const { name, amount, date, icon, categoryId } = income;
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
      toast.error("Date must be in the past");
      return;
    }

    if (!categoryId) {
      toast.error("Category is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosConfig.post(Endpoints.ADDINCOME, {
        name,
        date,
        amount: Number(amount),
        categoryId: Number(categoryId),
        icon,
      });
      if (response.status === 200) {
        setOpenIncomeModal(false);
        toast.success("Income added successfully");
        dispatch(addIncome(response.data));
        dispatch(fetchIncomes());
        fetchAddCategoryByType();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  }

  async function deleteIncome(id) {
    try {
      await axiosConfig.delete(Endpoints.DELETEINCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Successfully deleted");
      dispatch(removeIncome(id));
      dispatch(fetchIncomes());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete the income",
      );
    }
  }

  useEffect(() => {
    dispatch(fetchIncomes());
    fetchAddCategoryByType();
  }, [dispatch]);

  function handleDownloadIncomeDetails() {
    try {
      const fileName = "income_details.xlsx";
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(incomeData)]),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Successfully downloaded");
    } catch (error) {
      toast.error("Download failed");
    }
  }

  function handleEmailIncomeDetails() {
    toast.success("Email sent successfully");
  }

  const isLoading = status === "loading";
  const isFailed = status === "failed";
  const isEmpty =
    status === "succeeded" && (!incomeData || incomeData.length === 0);

  return (
    <div>
      <Dashboard activeMenu={"Income"}>
        <div className="my-5 mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shrink-0">
              <Wallet className="text-green-700" size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Income</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Keep track of every source of income
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <IncomeOverveiw transactions={incomeData} />

              <button
                onClick={() => setOpenIncomeModal(true)}
                disabled={loading}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-xl text-sm font-semibold shadow-sm hover:from-green-200 hover:to-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                Add Income
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
                    Couldn't load your income
                  </p>
                  <p className="text-red-400 text-sm mt-1">
                    {error || "Something went wrong. Please try again."}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(fetchIncomes())}
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
                  <Wallet className="text-gray-300" size={26} />
                </div>
                <p className="text-gray-700 font-semibold">No income yet</p>
                <p className="text-gray-400 text-sm">
                  Add your first income source to start tracking
                </p>
              </div>
            )}

            {status === "succeeded" && incomeData && incomeData.length > 0 && (
              <IncomeList
                transactions={incomeData}
                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                onDownload={handleDownloadIncomeDetails}
                onEmail={handleEmailIncomeDetails}
                text="Income Source"
                color="green"
                type="income"
              />
            )}

            <Modal
              isOpen={openAddIncomeModel}
              onClose={() => setOpenIncomeModal(false)}
              title="Add income"
            >
              <AddIncomeFrom
                onAddIncome={handleAddIncome}
                categories={categories}
              />
            </Modal>
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({ show: false, data: null })}
              title="Delete Income"
            >
              <DeleteAlert
                content="Are you sure you want to delete this income?"
                onDelete={() => deleteIncome(openDeleteAlert.data)}
              />
            </Modal>
          </div>
        </div>
      </Dashboard>
    </div>
  );
};

export default Income;
