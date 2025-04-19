"use client";

import { Context } from "@/context/context";
import { useContext } from "react";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import DropdownAvatar from "./dropdown-avatar";

export default function SidebarSwitcher() {
  const { isVisible, setIsVisible } = useContext(Context);
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="absolute top-0 z-10 left-0 w-full rounded-b-2xl overflow-hidden">
      <div className="flex flex-row items-center justify-between bg-white w-full p-3">
        <HiOutlineBars3BottomLeft
          onClick={toggleSidebar}
          className="text-grey-c300 text-3xl cursor-pointer hover:text-grey-c400 transition ease-in-out"
        />
        <DropdownAvatar />
      </div>
    </div>
  );
}
