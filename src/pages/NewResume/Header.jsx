import React from "react";

function Header() {
  return (
    <div className="px-[75px] py-5 w-full flex items-center justify-between gap-8 bg-black min-h-0">
      <div className="flex-grow">
        <p className="m-0 text-white text-[1.8rem] leading-[3.8rem] font-bold tracking-wider text-left">
          <span className="bg-clip-text bg-gradient-to-r from-white to-[#1369b9] text-transparent">
            HireIn:{" "}
          </span>
          Resume Builder
        </p>
      </div>
    </div>
  );
}

export default Header;
