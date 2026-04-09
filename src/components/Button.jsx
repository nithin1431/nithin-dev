import React, { useState } from "react";

const Button = ({ label, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(prev => !prev);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-4 py-2 rounded-lg text-white transition duration-300
        ${isActive 
          ? "bg-green-600 hover:bg-green-700" 
          : "bg-blue-500 hover:bg-blue-600"}
      `}
    >
      {label}
    </button>
  );
};

export default React.memo(Button);