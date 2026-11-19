import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

const CustomLineChart = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {/* IMPORTANT: gradient must exist */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} />

          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          {/* 🔥 THIS MUST COME BEFORE LINE */}
          <Area
            type="monotone"
            dataKey="totalAmount"
            stroke="none"
            fill="url(#incomeGradient)"
          />

          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#8b5cf6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
