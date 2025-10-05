import React from "react";

function Title({
  text1 = "",
  text2 = "",
  addSolidLineBefore = false,
  addSolidLineAfter = false,
}) {
  return (
    <div className="inline-block text-left">
      {/* Solid Line Before */}
      {addSolidLineBefore && (
        <span className="inline-block w-16 h-1 bg-gray-800 align-middle mr-2 rounded"></span>
      )}

      {/* Primary Text */}
      <span className="text-2xl font-bold text-black inline-block align-middle">
        {text1}
      </span>

      {/* Secondary Text */}
      {text2 && (
        <span className="text-2xl text-gray-700 inline-block align-middle ml-2">
          {text2}
        </span>
      )}

      {/* Solid Line After */}
      {addSolidLineAfter && (
        <span className="inline-block w-16 h-1 bg-gray-800 align-middle ml-2 rounded mt-4"></span>
      )}
    </div>
  );
}

export default Title;
