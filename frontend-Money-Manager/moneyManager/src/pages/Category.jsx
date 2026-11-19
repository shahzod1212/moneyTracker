import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import AddForm from "../components/AddForm";
import useUser from "../hooks/useUser";
import { Plus, AlertCircle, RefreshCw, FolderOpen, Tag } from "lucide-react";
import CategoryList from "../components/CategoryList";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categoriesSlice";
import Modal from "../components/Modal";

const Category = () => {
  useUser();
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state) => state.categories,
  );

  const [openAddCategoryModal, setAddOpenCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  async function handleAddCategory(category) {
    const { name, icon, type, budget } = category;

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!icon) {
      toast.error("Selecting the emoji is required");
      return;
    }

    try {
      const response = await axiosConfig.post(Endpoints.ADDCATEGORY, {
        name,
        type,
        icon,
        budget: budget === "" || budget === undefined ? null : Number(budget),
      });

      if (response.status === 201) {
        toast.success("Category added successfully");
        setAddOpenCategoryModal(false);
        dispatch(fetchCategories());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  }

  function handleEditCategory(category) {
    setSelectedCategory(category);
    setOpenEditCategoryModal(true);
  }

  async function handleUpdateCategory(category) {
    if (!category.id) {
      toast.error("Id is missing");
      return;
    }

    try {
      const response = await axiosConfig.put(
        Endpoints.UPDATECATEGORY(category.id),
        {
          name: category.name,
          type: category.type,
          icon: category.icon,
          budget:
            category.budget === "" || category.budget === undefined
              ? null
              : Number(category.budget),
        },
      );

      if (response.status === 202) {
        toast.success("Updated");
        setOpenEditCategoryModal(false);
        setSelectedCategory(null);
        dispatch(fetchCategories());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update the category. try again",
      );
    }
  }

  const isLoading = status === "loading";
  const isFailed = status === "failed";
  const isEmpty =
    status === "succeeded" && (!categories || categories.length === 0);

  return (
    <div>
      <Dashboard activeMenu={"Category"}>
        <div className="my-5 mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shrink-0">
                <Tag className="text-purple-700" size={18} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  All Categories
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Organize your income and expenses into categories
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddOpenCategoryModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all text-sm text-white font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-green-200/60"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-3xl bg-gray-100 animate-pulse"
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
                  Couldn't load your categories
                </p>
                <p className="text-red-400 text-sm mt-1">
                  {error || "Something went wrong. Please try again."}
                </p>
              </div>
              <button
                onClick={() => dispatch(fetchCategories())}
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
                <FolderOpen className="text-gray-300" size={26} />
              </div>
              <p className="text-gray-700 font-semibold">No categories yet</p>
              <p className="text-gray-400 text-sm">
                Create your first category to start organizing transactions
              </p>
            </div>
          )}

          {status === "succeeded" && categories && categories.length > 0 && (
            <CategoryList
              categories={categories}
              onEditCategory={handleEditCategory}
            />
          )}

          <Modal
            title={"Add Category"}
            isOpen={openAddCategoryModal}
            onClose={() => setAddOpenCategoryModal(false)}
          >
            <AddForm handleAddCategory={handleAddCategory} />
          </Modal>

          <Modal
            onClose={() => {
              setOpenEditCategoryModal(false);
              setSelectedCategory(null);
            }}
            isOpen={openEditCategoryModal}
            title="Update Category"
          >
            <AddForm
              initialCategory={selectedCategory}
              handleAddCategory={handleUpdateCategory}
              isEditing={true}
            />
          </Modal>
        </div>
      </Dashboard>
    </div>
  );
};

export default Category;
