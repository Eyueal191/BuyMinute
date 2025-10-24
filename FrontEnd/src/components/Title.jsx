import React from "react";

function Title({
  text1 = "",
  text2 = "",
  addSolidLineBefore = false,
  addSolidLineAfter = false,
  text1Color = "text-black",
  text2Color = "text-gray-700",
  lineColor = "bg-gray-800", // Line color prop
}) {
  return (
    <div className="inline-flex items-center text-left font-title"> {/* Apply custom font here */}
      {/* Solid Line Before */}
      {addSolidLineBefore && (
        <span className={`inline-block w-16 h-1 ${lineColor} rounded mr-2 self-center mb-[-1vw]`}></span>
      )}

      {/* Primary + Secondary Text */}
      <div className="inline-flex items-center space-x-2">
        <span
          className={`font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px] ${text1Color}`}
        >
          {text1}
        </span>

        {text2 && (
          <span
            className={`font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px] ${text2Color}`}
          >
            {text2}
          </span>
        )}

        {/* Solid Line After */}
        {addSolidLineAfter && (
          <span className={`inline-block w-20 h-1 ${lineColor} rounded self-center mb-[-1vw]`}></span>
        )}
      </div>
    </div>
  );
}

export default Title;
