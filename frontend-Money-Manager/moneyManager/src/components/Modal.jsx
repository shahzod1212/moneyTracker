import { X } from "lucide-react";
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-gray-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative p-4 w-full max-w-2xl max-h-[90vh]">
        <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-900/20 border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

          <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 rounded-xl text-sm w-9 h-9 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <X className="w-4 h-4" size={15} />
            </button>
          </div>
          <div className="p-5 md:p-6 text-gray-700 overflow-y-auto max-h-[calc(90vh-88px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
