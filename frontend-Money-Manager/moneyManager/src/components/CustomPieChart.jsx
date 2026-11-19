import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";

const addPercent = (value, total) =>
  total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={8}
        style={{
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.18))",
          transition: "all 0.25s ease",
        }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.35}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-xl bg-gray-900/95 backdrop-blur px-4 py-3 shadow-xl border border-white/10">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="text-xs font-medium text-gray-200">{item.name}</span>
      </div>
      <p className="text-lg font-bold text-white mt-1">
        {item.value.toLocaleString()}
      </p>
      <p className="text-[11px] text-gray-400">
        {addPercent(item.value, total)}% of total
      </p>
    </div>
  );
};

const CustomPieChart = ({ data = [], colors = [], label, totalAmount }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const hasData = data && data.some((item) => item.amount > 0);
  const chartData = hasData ? data : [{ name: "No Data", amount: 1 }];
  const total = useMemo(
    () => (hasData ? data.reduce((sum, d) => sum + (d.amount || 0), 0) : 0),
    [data, hasData],
  );

  const centerLabel =
    activeIndex !== null && hasData ? data[activeIndex].name : label;
  const centerValue =
    activeIndex !== null && hasData
      ? data[activeIndex].amount.toLocaleString()
      : totalAmount;

  const gradientId = (i) => `pieGradient-${i}`;

  return (
    <div className="relative w-full h-[380px] mt-4 group">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {hasData &&
              colors.map((color, i) => (
                <linearGradient
                  key={i}
                  id={gradientId(i)}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.72} />
                </linearGradient>
              ))}
          </defs>

          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={82}
            outerRadius={112}
            paddingAngle={hasData ? 4 : 0}
            cornerRadius={hasData ? 6 : 0}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
            activeIndex={activeIndex}
            activeShape={hasData ? renderActiveShape : undefined}
            onMouseEnter={(_, index) => hasData && setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={hasData ? `url(#${gradientId(index)})` : "#E5E7EB"}
                stroke={hasData ? "#fff" : "none"}
                strokeWidth={hasData ? 2 : 0}
                style={{ cursor: hasData ? "pointer" : "default" }}
              />
            ))}
          </Pie>

          {hasData && <Tooltip content={<CustomTooltip total={total} />} />}
        </PieChart>
      </ResponsiveContainer>

      {/* CENTER TEXT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {hasData ? (
          <>
            <p className="text-sm text-gray-500 transition-all duration-200">
              {centerLabel}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 transition-all duration-200">
              {centerValue}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Income • Expense • Balance overview
            </p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <span className="text-gray-300 text-lg">◌</span>
            </div>
            <p className="text-gray-500 text-sm">No Finance Data</p>
            <h2 className="text-sm font-medium text-gray-400 mt-0.5">
              Add transactions to see insights
            </h2>
          </>
        )}
      </div>

      {/* LEGEND */}
      {hasData && (
        <div className="flex justify-center flex-wrap gap-2 mt-3">
          {data.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? "border-gray-200 bg-gray-50 scale-105 shadow-sm"
                    : "border-transparent"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-600">{item.name}</span>
                <span className="text-gray-400">
                  {addPercent(item.amount, total)}%
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
