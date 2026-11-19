import React from "react";
import {
  Trash2,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

const addThousandsSeparator = (num) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString();
};

const TransactionCard = ({
  icon,
  type,
  date,
  amount,
  title,
  hideDelete,
  onDelete,
}) => {
  const isIncome = type === "income";

  return (
    <div className="group relative flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
      <div
        className={`w-12 h-12 flex items-center justify-center text-xl rounded-2xl shrink-0 ring-1 ${
          isIncome
            ? "bg-gradient-to-br from-green-50 to-white ring-green-100"
            : "bg-gradient-to-br from-red-50 to-white ring-red-100"
        }`}
      >
        {icon ? (
          <img src={icon} alt="" className="w-6 h-6 object-contain" />
        ) : (
          <UtensilsCrossed
            size={18}
            className={isIncome ? "text-green-600" : "text-red-600"}
          />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="min-w-0">
          <p className="text-sm text-gray-800 font-semibold truncate">
            {title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hideDelete && (
            <button
              onClick={onDelete}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              isIncome ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {isIncome ? "+" : "-"} ${addThousandsSeparator(amount)}
            {isIncome ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
