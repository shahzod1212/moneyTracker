import { ArrowBigRight } from "lucide-react";
import React from "react";
import TransactionCard from "./TransactionCard";
import moment from "moment";

const Transactions = ({ transactions, onMore, type }) => {
  const isIncome = type === "income";

  return (
    <div className="bg-white py-5 px-5 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isIncome
                ? "bg-gradient-to-br from-green-100 to-green-50"
                : "bg-gradient-to-br from-red-100 to-red-50"
            }`}
          >
            <ArrowBigRight
              className={isIncome ? "text-green-600" : "text-red-600"}
              size={16}
              style={{
                transform: isIncome ? "rotate(-45deg)" : "rotate(45deg)",
              }}
            />
          </div>
          <h5 className="text-base font-bold text-gray-800 capitalize">
            Recent {type}
          </h5>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm hover:shadow-md hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200"
          onClick={onMore}
        >
          More <ArrowBigRight size={14} />
        </button>
      </div>

      <div className="mt-5">
        {transactions?.length === 0 || !transactions ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <ArrowBigRight className="text-gray-300" size={18} />
            </div>
            <p className="text-sm text-gray-400">No {type} recorded yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions?.slice(0, 5)?.map((item) => (
              <TransactionCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                date={moment(item.date).format("Do MMM YYYY")}
                amount={item.amount}
                type={type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
