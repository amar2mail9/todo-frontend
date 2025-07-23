import React from "react";

const Spinner = ({ size = 40, color = "emerald-100" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`border-4 border-${color} border-t-transparent rounded-full animate-spin`}
        style={{
          width: size,
          height: size,
        }}
      ></div>
    </div>
  );
};

export default Spinner;
