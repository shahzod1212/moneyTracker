import { Mail, Download } from "lucide-react";
import React from "react";
import TransactionCard from "./TransactionCard";
import moment from "moment";

const IncomeList = ({
  transactions,
  onDelete,
  onDownload,
  onEmail,
  text,
  color,
  type,
}) => {
  return (
    <div className="bg-white py-4 px-2">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-bold ">
          {text === "Income Source" ? <>Income Source</> : <>Expense Source</>}
        </h5>
        <div className="flex  items-center justify-end gap-1">
          <button
            onClick={onEmail}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 backdrop-blur-md border scale-90 border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
          >
            <Mail size={16} />
            <span className="text-sm font-medium">Email</span>
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 backdrop-blur-md border scale-90 border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions.map((item) => (
          <TransactionCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={type}
            onDelete={() => onDelete(item.id)}
            color={color}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
