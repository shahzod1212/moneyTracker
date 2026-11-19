import { Trash, LoaderCircle } from "lucide-react";
import React, { useState } from "react";

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          disabled={loading}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold shadow-sm hover:bg-red-100 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Trash size={16} />
          )}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
