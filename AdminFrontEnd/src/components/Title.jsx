import React from "react";

function Title({
  text1 = "",
  text2 = "",
  addSolidLineBefore = false,
  addSolidLineAfter = false,
  text1Color = "text-gray-900",
  text2Color = "text-gray-700",
  lineColor = "bg-gray-800",
  bg = "bg-transparent",
}) {
  return (
    <div className={`inline-flex items-center text-left font-title ${bg}`}>
      {/* Solid Line Before */}
      {addSolidLineBefore && (
        <span
          className={`inline-block w-16 h-1 ${lineColor} rounded mr-2 self-center mb-[-1vw]`}
        ></span>
      )}

      {/* Primary + Secondary Text */}
      <div className="inline-flex items-center space-x-2">
        {text1 && (
          <span className={`font-bold text-3xl md:text-4xl ${text1Color}`}>
            {text1}
          </span>
        )}

        {text2 && (
          <span className={`font-bold text-3xl md:text-4xl ${text2Color}`}>
            {text2}
          </span>
        )}

        {/* Solid Line After */}
        {addSolidLineAfter && (
          <span
            className={`inline-block w-20 h-1 ${lineColor} rounded self-center mb-[-1vw]`}
          ></span>
        )}
      </div>
    </div>
  );
}
export default Title;
