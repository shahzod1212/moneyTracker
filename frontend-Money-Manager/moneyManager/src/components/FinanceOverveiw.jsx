import React from "react";
import CustomPieChart from "./CustomPieChart";
import { addThousandSeparators } from "../util/methods";

const FinanceOverveiw = ({ totalBalance, totalIncome, totalExpense }) => {
  const COLORS = ["#016630", "#a0090e"];

  const balanceData = [
    { name: "Total Income", amount: Math.max(totalIncome, 0) },
    { name: "Total Expenses", amount: Math.max(totalExpense, 0) },
  ];

  return (
    <div className="bg-white py-2 px-2 rounded">
      <div className="flex items-center justify-between">
        <h5 className="text-lg"> Finance Overveiw</h5>
      </div>
      <CustomPieChart
        data={balanceData}
        label="Total balance"
        totalAmount={addThousandSeparators(totalBalance)}
        colors={COLORS}
      />
    </div>
  );
};

export default FinanceOverveiw;
