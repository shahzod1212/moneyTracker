import React, { useEffect, useState } from "react";
import EmojiPickerInput from "./EmojiPicker";
import Input from "./Input";
import { Sparkles, Send } from "lucide-react";

const AddIncomeFrom = ({ categories, onAddIncome }) => {
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  function handleChange(key, value) {
    setIncome({ ...income, [key]: value });
  }

  useEffect(() => {
    if (categories.length > 0) {
      setIncome((prev) =>
        prev.categoryId ? prev : { ...prev, categoryId: categories[0].id },
      );
    }
  }, [categories]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div className="p-1">
      <div className="rounded-3xl bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 border border-green-100 p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shrink-0">
            <Sparkles className="text-green-600" size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              New Income Entry
            </p>
            <p className="text-xs text-gray-400">
              Fill in the details below to log a new income
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <EmojiPickerInput
            icon={income.icon}
            onSelected={(selected) => handleChange("icon", selected)}
          />
        </div>

        <div className="space-y-1">
          <Input
            value={income.name}
            onChange={({ target }) => handleChange("name", target.value)}
            label="Income Source"
            placeholder="e.g Salary, Bonus"
            type="text"
          />

          <Input
            value={income.categoryId}
            onChange={({ target }) =>
              handleChange("categoryId", Number(target.value))
            }
            label="Category"
            isSelect={true}
            options={categoryOptions}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={income.amount}
              onChange={({ target }) => handleChange("amount", target.value)}
              label="Amount"
              placeholder="e.g 500, 1500"
              type="number"
            />

            <Input
              value={income.date}
              onChange={({ target }) => handleChange("date", target.value)}
              label="Date"
              type="date"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => onAddIncome(income)}
            className="flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl text-white font-semibold text-sm shadow-lg shadow-green-200/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Add Income
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIncomeFrom;
