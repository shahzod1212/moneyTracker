import { Eye, EyeOff, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Input = ({
  label,
  placeholder,
  value,
  type,
  onChange,
  isSelect,
  options,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div className="mb-5">
      <label className="text-[12px] font-semibold text-gray-500 block mb-1.5 tracking-wide uppercase">
        {label}
      </label>

      <div className="relative group">
        {isSelect ? (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`w-full appearance-none bg-white border rounded-2xl py-3 pl-4 pr-10 text-[14px] text-gray-800 font-medium cursor-pointer transition-all duration-200 outline-none ${
                focused
                  ? "border-violet-400 ring-4 ring-violet-100 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {Array.isArray(options) &&
                options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
                focused ? "text-violet-500 rotate-180" : "text-gray-400"
              }`}
            />
          </div>
        ) : (
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full bg-white border rounded-2xl py-3 px-4 text-[14px] text-gray-800 placeholder:text-gray-300 transition-all duration-200 outline-none ${
              type === "password" ? "pr-11" : ""
            } ${
              focused
                ? "border-violet-400 ring-4 ring-violet-100 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors duration-150"
          >
            {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        )}

        {!isSelect && (
          <div
            className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 origin-left transition-transform duration-300 ${
              focused ? "scale-x-100" : "scale-x-0"
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
