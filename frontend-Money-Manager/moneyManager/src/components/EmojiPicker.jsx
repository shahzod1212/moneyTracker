import { Image, X } from "lucide-react";
import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerInput = ({ icon, onSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(emoji) {
    onSelected(emoji?.imageUrl || "");
    setIsOpen(false);
  }
  return (
    <div className="flex flex-col md:flex-row items-start gap-5mb-6 mb-3">
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-500 rounded-lg">
          {icon ? <img src={icon} alt="" className="w-12 h-12" /> : <Image />}
        </div>
        <p className="text-sm font-semibold text-purple-700 mr-3">
          {icon ? "Change icon" : "Pick Icon"}
        </p>
      </div>
      {isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
          >
            <X />
          </button>
          <EmojiPicker open={isOpen} onEmojiClick={handleClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerInput;
