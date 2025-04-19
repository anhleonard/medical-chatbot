"use client";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { MdOutlineSchool } from "react-icons/md";
import { TbPrompt } from "react-icons/tb";
import { useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/context/context";
import ChatSidebar from "./sidebars/user/chat-sidebar";

export const iconMap: { [key: string]: IconType } = {
  LuLayoutDashboard: LuLayoutDashboard,
  FaRegUser: FaRegUser,
  MdOutlineMessage: MdOutlineMessage,
  MdOutlineSchool: MdOutlineSchool,
  TbPrompt: TbPrompt,
};

const Sidebar = () => {
  const { isVisible, setIsVisible } = useContext(Context);

  useEffect(() => {
    const message = sessionStorage.getItem("loginMessage");
    if (message) {
      toast({
        title: "Success",
        description: message,
      });
      sessionStorage.removeItem("loginMessage");
    }
  }, []);

  return (
    <>
      <aside
        className={`top-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isVisible 
            ? "translate-x-0 w-72" 
            : "-translate-x-72 w-0"
        } ${
          "absolute flex lg:relative"
        }`}
      >
        <div
          className={`bg-primary-c10 transition-all duration-300 ease-in-out h-screen w-full`}
        >
          <ChatSidebar />
        </div>
      </aside>
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
