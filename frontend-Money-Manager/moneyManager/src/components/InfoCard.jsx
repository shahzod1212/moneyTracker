import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex items-center justify-between gap-6 bg-white p-6 rounded-2xl 
      shadow-sm border border-gray-100 hover:shadow-lg transition-all"
    >
      {/* ICON */}
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white 
        ${color} rounded-full shadow-md`}
      >
        {icon}
      </div>

      {/* TEXT */}
      <div className="flex-1">
        <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
        <span className="text-[22px] font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
