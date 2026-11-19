import React, { useMemo, useState } from "react";
import moment from "moment";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const SpendingCalendar = ({ incomes = [], expenses = [] }) => {
  const [cursor, setCursor] = useState(moment());

  const dayMap = useMemo(() => {
    const map = {};

    incomes.forEach((item) => {
      const key = moment(item.date).format("YYYY-MM-DD");
      if (!map[key]) map[key] = { income: false, expense: false };
      map[key].income = true;
    });

    expenses.forEach((item) => {
      const key = moment(item.date).format("YYYY-MM-DD");
      if (!map[key]) map[key] = { income: false, expense: false };
      map[key].expense = true;
    });

    return map;
  }, [incomes, expenses]);

  const startOfMonth = cursor.clone().startOf("month");
  const endOfMonth = cursor.clone().endOf("month");
  const startOfGrid = startOfMonth.clone().startOf("week");
  const endOfGrid = endOfMonth.clone().endOf("week");

  const days = [];
  const day = startOfGrid.clone();
  while (day.isSameOrBefore(endOfGrid, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  const weekLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const getDayStyle = (dateKey) => {
    const entry = dayMap[dateKey];
    if (!entry) return null;

    if (entry.income && entry.expense) {
      return {
        background:
          "linear-gradient(135deg, #34d399 0%, #34d399 50%, #f87171 50%, #f87171 100%)",
      };
    }
    if (entry.income) return { background: "#34d399" };
    if (entry.expense) return { background: "#f87171" };
    return null;
  };

  return (
    <div className="max-w-md rounded-3xl bg-white border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center shrink-0">
            <CalendarDays className="text-violet-600" size={15} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">
            {cursor.format("MMMM YYYY")}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCursor((prev) => prev.clone().subtract(1, "month"))
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCursor((prev) => prev.clone().add(1, "month"))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {weekLabels.map((label, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-semibold text-gray-300"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const dateKey = d.format("YYYY-MM-DD");
          const isCurrentMonth = d.isSame(cursor, "month");
          const isToday = d.isSame(moment(), "day");
          const style = getDayStyle(dateKey);

          return (
            <div
              key={dateKey}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium transition-all duration-150 ${
                isCurrentMonth ? "text-gray-700" : "text-gray-300"
              } ${!style ? "bg-gray-50" : ""} ${
                isToday ? "ring-2 ring-violet-400 ring-offset-1" : ""
              }`}
              style={style || {}}
            >
              <span className={style ? "text-white drop-shadow-sm" : ""}>
                {d.date()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-gray-400">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-[11px] text-gray-400">Expense</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #34d399 50%, #f87171 50%)",
            }}
          />
          <span className="text-[11px] text-gray-400">Both</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingCalendar;
