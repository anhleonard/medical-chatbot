"use client";

import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signOut } from "next-auth/react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@/libs/separator";
export default function DropdownAvatar() {
  const router = useRouter();

  const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    router.replace('/login');
    return;
    event.preventDefault();
    await signOut();
  };

  const menuItems = [
    {
      href: "/profile",
      icon: "/icons/profile.svg",
      alt: "profile",
      text: "Thông tin cá nhân"
    },
    {
      href: "/setting",
      icon: "/icons/setting.svg",
      alt: "setting",
      text: "Cài đặt"
    },
    {
      href: "/subscription",
      icon: "/icons/subscription.svg",
      alt: "subscription",
      text: "Nâng cấp gói"
    }
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="w-9 h-9 cursor-pointer flex flex-wrap justify-center items-center">
          <AvatarImage src={"/images/user-avatar.jpg"} />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="mt-1 mr-3 text-sm w-56 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-grey-c900 rounded-lg border-grey-c200/50 border-[1px] overflow-hidden
      data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <div className="py-3 px-3 text-left text-grey-c900 font-medium">Nguyễn Thị Thu Anh</div>
        <Separator />
        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              className="hover:bg-grey-c100 active:bg-grey-c200 p-3 w-56 flex flex-wrap gap-2 items-center font-medium" 
              href={item.href}
            >
              <Image src={item.icon} alt={item.alt} width={18} height={18} />
              {item.text}
            </Link>
          ))}
        </div>
        <Separator />
        <button
          onClick={handleSignOut}
          className="hover:bg-grey-c100 active:bg-grey-c200 p-3 w-56 flex flex-wrap gap-2 items-center outline-none focus:outline-none font-medium"
        >
          <Image src="/icons/log-out.svg" alt="log-out" width={20} height={20} />
          Đăng xuất
        </button>
      </PopoverContent>
    </Popover>
  );
}
