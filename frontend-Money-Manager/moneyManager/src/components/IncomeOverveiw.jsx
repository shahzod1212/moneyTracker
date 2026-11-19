import React, { useEffect, useState } from "react";
import { prepareIncomeLineChartData } from "../util/methods";
import CustomLineChart from "./CustomLineChart";

const IncomeOverveiw = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const result = prepareIncomeLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);
  return (
    <div className="bg-white py-2 px-3 rounded mt-2">
      <div className="flex items-center justify-between ">
        <div>
          <h5 className="text-lg font-semibold ">Income Overveiw</h5>
          <p className="text-xs text-gray-400 mt-0 5">
            Track your earnings over time.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverveiw;
