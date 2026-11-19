import { Layers2, Pencil, Wallet, TrendingUp } from "lucide-react";
import React from "react";

const CategoryList = ({ categories, onEditCategory }) => {
  const incomeCategories = categories.filter((item) => item.type === "income");
  const expenseCategories = categories.filter(
    (item) => item.type === "expense",
  );

  const renderIncomeCategory = (item) => (
    <div
      key={item.id}
      className="group relative flex items-center bg-gradient-to-br from-green-50/60 to-white border border-green-100 gap-4 p-4 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-50 ring-1 ring-green-100 shrink-0">
        {item.icon ? (
          <img src={item.icon} alt="" className="h-5 w-5" />
        ) : (
          <TrendingUp size={19} className="text-green-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-semibold truncate">
          {item.name}
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-100/70 rounded-full px-2 py-0.5 mt-1 capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {item.type}
        </span>
      </div>

      <button
        onClick={() => onEditCategory(item)}
        className="text-gray-400 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shrink-0"
      >
        <Pencil size={17} />
      </button>
    </div>
  );

  const renderExpenseCategory = (item) => {
    const hasBudget = item.budget !== null && item.budget !== undefined;
    const totalSpending = Number(item.totalSpending) || 0;
    const budget = hasBudget ? Number(item.budget) : 0;
    const percentUsed = hasBudget
      ? Math.min((totalSpending / budget) * 100, 100)
      : 0;
    const isOverBudget = hasBudget && totalSpending > budget;

    return (
      <div
        key={item.id}
        className="group relative flex flex-col bg-white border border-gray-100 gap-3 p-4 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-white ring-1 ring-red-100 shrink-0">
            {item.icon ? (
              <img src={item.icon} alt="" className="h-5 w-5" />
            ) : (
              <Layers2 size={20} className="text-red-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 font-semibold truncate">
              {item.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">
              {item.type}
            </p>
          </div>

          <button
            onClick={() => onEditCategory(item)}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shrink-0"
          >
            <Pencil size={17} />
          </button>
        </div>

        {hasBudget ? (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <Wallet size={12} />
                Spent
              </div>
              <p
                className={`text-xs font-bold ${
                  isOverBudget ? "text-red-600" : "text-gray-700"
                }`}
              >
                ${totalSpending.toLocaleString()}{" "}
                <span className="text-gray-300 font-medium">
                  / ${budget.toLocaleString()}
                </span>
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget
                    ? "bg-gradient-to-r from-red-500 to-rose-600"
                    : percentUsed > 75
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-red-400 to-rose-400"
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <p
              className={`text-[11px] mt-1.5 font-medium ${
                isOverBudget ? "text-red-500" : "text-gray-400"
              }`}
            >
              {isOverBudget
                ? `Over budget by $${(totalSpending - budget).toLocaleString()}`
                : `${percentUsed.toFixed(0)}% used · $${(
                    budget - totalSpending
                  ).toLocaleString()} left`}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-100">
            <p className="text-[11px] text-gray-400 pt-2">
              No budget set for this category
            </p>
            <p className="text-xs font-semibold text-gray-500 pt-2">
              ${totalSpending.toLocaleString()} spent
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card p-4 bg-white rounded">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Category Sources</h4>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">
          No categories added yet. Add some to get started.
        </p>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-sm font-semibold text-gray-600">Income</p>
              <span className="text-[11px] font-medium text-gray-300">
                {incomeCategories.length}
              </span>
            </div>
            {incomeCategories.length === 0 ? (
              <p className="text-gray-400 text-sm">No income categories</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {incomeCategories.map(renderIncomeCategory)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <p className="text-sm font-semibold text-gray-600">Expense</p>
              <span className="text-[11px] font-medium text-gray-300">
                {expenseCategories.length}
              </span>
            </div>
            {expenseCategories.length === 0 ? (
              <p className="text-gray-400 text-sm">No expense categories</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {expenseCategories.map(renderExpenseCategory)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
