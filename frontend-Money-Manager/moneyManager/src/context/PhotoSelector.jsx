import { Trash, Upload, User } from "lucide-react";
import React, { useRef, useState } from "react";

const PhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previous, setPrevious] = useState(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const prev = URL.createObjectURL(file);
      setPrevious(prev);
    }
  }

  function hadleRemove() {
    setImage(null);
    setPrevious(null);
  }

  function onChooseFile() {
    inputRef.current?.click();
  }
  return (
    <div className="flex justify-center mb-6 ">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImage}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <User className="text-purple-500" size={35} />
          <button
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <Upload size={15} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previous}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            onClick={hadleRemove}
            className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoSelector;
