import React from "react";

export default function Button({
  onClick,
  title,
  color,
  hoverColor,
}: {
  onClick?: () => void;
  title: string;
  color?: string;
  hoverColor?: string;
}) {
  return (
    <button
      className={`text-white w-full relative z-40 p-[.2rem]  sm:p-[1vw] rounded-[.5vw] max-sm:text-md max-sm:rounded-md sm:text-[1.3vw] duration-300 transition-all ${
        color ? color : "  bg-[#2759CE]"
      } ${hoverColor ? hoverColor : " hover:bg-[#2759CE]/80"}`}
      type="button"
      onClick={() => onClick && onClick()}
    >
      {title}
    </button>
  );
}
