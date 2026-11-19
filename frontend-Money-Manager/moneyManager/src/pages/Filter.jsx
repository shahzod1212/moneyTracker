import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import { Search, SlidersHorizontal, ListFilter } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import TransactionCard from "../components/TransactionCard";
import moment from "moment";

const Filter = () => {
  useUser();
  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosConfig.post(Endpoints.FILTER, {
        type,
        start: startDate,
        end: endDate,
        name: keyword,
        sortField,
        sortOrder,
      });
      if (response.status === 200) {
        setTransactions(response.data);
        console.log(transactions);
      }
    } catch (error) {
      toast.error("Failed to apply the filters");
    } finally {
      setLoading(false);
    }
  }

  const selectClass =
    "w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all";
  const inputClass =
    "w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div>
      <Dashboard activeMenu="Filter">
        <div className="my-5 mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="text-violet-700" size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Filter Transactions
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Narrow down your income and expenses by date, category, and
                keyword
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-7 mb-6">
            <form className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">
              <div>
                <label className={labelClass} htmlFor="type">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={selectClass}
                  id="type"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="startDate">
                  Start Date
                </label>
                <input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  id="startDate"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="endDate">
                  End Date
                </label>
                <input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  id="endDate"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="sortField">
                  Sort By
                </label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className={selectClass}
                  id="sortField"
                >
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="sortOrder">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={selectClass}
                  id="sortOrder"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className={labelClass} htmlFor="search">
                    Search
                  </label>
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    type="text"
                    id="search"
                    className={inputClass}
                    placeholder="Search..."
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="shrink-0 h-[41px] w-[41px] flex items-center justify-center bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-2xl shadow-md shadow-violet-200/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search size={17} />
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center shrink-0">
                <ListFilter className="text-violet-600" size={16} />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                Transactions
              </h3>
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

            {!loading && transactions.length === 0 && (
              <div className="flex flex-col items-center text-center gap-2.5 py-14">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Search className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-500 text-sm">
                  Select your filters and click search to see transactions
                </p>
              </div>
            )}

            {!loading && transactions.length > 0 && (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
                {transactions.map((item) => (
                  <TransactionCard
                    key={item.id}
                    title={item.name}
                    icon={item.icon}
                    date={moment(item.date).format("Do MMM YYYY")}
                    amount={item.amount}
                    type={type}
                    hideDeleteBtn
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Dashboard>
    </div>
  );
};

export default Filter;
