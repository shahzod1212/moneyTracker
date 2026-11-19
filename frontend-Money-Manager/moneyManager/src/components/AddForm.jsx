import React, { useEffect, useState } from "react";
import Input from "./Input";
import EmojiPicker from "./EmojiPicker";
import { LoaderCircle, Tag, PlusCircle, Wallet } from "lucide-react";

const AddForm = ({ handleAddCategory, initialCategory, isEditing }) => {
  const [category, setCategory] = useState({
    id: null,
    name: "",
    type: "income",
    icon: "",
    budget: "",
  });

  const categoryTypeOption = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  useEffect(() => {
    if (isEditing && initialCategory) {
      setCategory({
        id: initialCategory.id || null,
        name: initialCategory.name || "",
        type: initialCategory.type || "income",
        icon: initialCategory.icon || "",
        budget: initialCategory.budget ?? "",
      });
    } else {
      setCategory({
        id: null,
        name: "",
        type: "income",
        icon: "",
        budget: "",
      });
    }
  }, [isEditing, initialCategory]);

  function handleChange(key, value) {
    setCategory((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit() {
    handleAddCategory(category);

    setCategory({
      id: null,
      name: "",
      type: "income",
      icon: "",
      budget: "",
    });
  }

  const isIncomeType = category.type === "income";
  const isExpenseType = category.type === "expense";

  return (
    <div className="p-1">
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition-colors duration-300 ${
          isIncomeType
            ? "bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 border-green-100"
            : "bg-gradient-to-br from-red-50/80 via-white to-rose-50/60 border-red-100"
        }`}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isIncomeType
                ? "bg-gradient-to-br from-green-100 to-green-50"
                : "bg-gradient-to-br from-red-100 to-red-50"
            }`}
          >
            <Tag
              className={isIncomeType ? "text-green-600" : "text-red-600"}
              size={16}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {isEditing ? "Update Category" : "New Category"}
            </p>
            <p className="text-xs text-gray-400">
              Give it a name, type, and icon
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <EmojiPicker
            icon={category.icon}
            onSelected={(selectedIcon) => handleChange("icon", selectedIcon)}
          />
        </div>

        <div className="space-y-1">
          <Input
            value={category.name}
            onChange={({ target }) => handleChange("name", target.value)}
            label="Category Name"
            placeholder="e.g Freelance, Salary"
            type="text"
          />

          <Input
            label="Category Type"
            value={category.type}
            onChange={({ target }) => handleChange("type", target.value)}
            isSelect={true}
            options={categoryTypeOption}
          />

          {isExpenseType && (
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-gray-500 block mb-1.5 tracking-wide uppercase">
                Monthly Budget
              </label>
              <div className="relative rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
                    <Wallet className="text-white" size={17} />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-[15px]">
                      $
                    </span>
                    <input
                      type="number"
                      value={category.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent outline-none border-none pl-4 text-lg font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2.5 pl-[52px]">
                  Set a spending limit for this category. Leave empty for no
                  limit.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-2xl text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${
              isIncomeType
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-200/60"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-200/60"
            }`}
          >
            {isEditing ? (
              <>
                <LoaderCircle className="animate-spin" size={15} />
                Update Category
              </>
            ) : (
              <>
                <PlusCircle size={15} />
                Add Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddForm;
