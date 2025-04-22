"use client";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import Image from "next/image";
import { useContext, useState } from "react";
import { Context } from "@/context/context";
import Link from "next/link";
import { getDateLabel } from "@/utils/day-mapper";
import { Message } from "../../../../utils/interfaces";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SearchModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const { chats } = useContext(Context);

  const filteredChats = chats.filter((chat) => {
    return chat.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const groupChatsByDate = () => {
    const displayedLabels = new Set<string>();
    return filteredChats.map((chat, index) => {
      // may be replaced with created_at
      const updatedAt = new Date(chat?.updated_at);
      const dateLabel = getDateLabel(updatedAt);
      const shouldDisplayLabel = !displayedLabels.has(dateLabel);

      if (shouldDisplayLabel) {
        displayedLabels.add(dateLabel);
      }

      const truncatedText = chat.title;

      return {
        chat,
        dateLabel,
        shouldDisplayLabel,
        truncatedText,
      };
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-3 rounded-2xl bg-button-c10 hover:bg-button-c50 active:bg-button-c100 duration-300 transition-all">
          <Image src="/icons/blue-search-icon.svg" alt="blue-search-icon" width={20} height={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 mt-1 ml-[220px] text-sm w-[400px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-grey-c900 rounded-xl border-primary-c900/20 border-[1px] overflow-hidden
            data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <div className="p-3 bg-primary-c10">
          <div className="flex flex-row gap-2">
            <div className="flex-1 flex items-center bg-white rounded-2xl px-3 relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-3 outline-none text-sm text-black/90 bg-transparent"
              />
              <Image src="/icons/search-icon.svg" alt="search" width={21} height={21} className="ml-2" />
            </div>
          </div>

          <ScrollArea className="h-[350px] bg-white rounded-sm mt-3">
            <div className="h-full">
              {filteredChats.length > 0 ? (
                <div className="p-2">
                  {groupChatsByDate().map(({ chat, dateLabel, shouldDisplayLabel, truncatedText }) => (
                    <div key={chat.id} className={`${shouldDisplayLabel && dateLabel !== "Hôm nay" ? "mt-6" : "mt-0"}`}>
                      {shouldDisplayLabel && <div className="text-grey-c400 text-xs mb-2 px-2">{dateLabel}</div>}
                      <Link href={`/chat/${chat.id}`} className="w-full">
                        <button className="rounded-lg p-2 py-2.5 text-sm text-left bg-transparent shadow-none hover:bg-grey-c100/80 w-full justify-start text-black/90 flex items-center gap-2">
                          <Image src="/icons/chat-icon.svg" alt="chat-icon" width={18} height={18} />
                          <div className="font-medium truncate max-w-[300px]">{truncatedText}</div>
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[350px] flex flex-col gap-2 items-center justify-center">
                  <Image src="/icons/not-found-item.svg" alt="not-found-item" width={32} height={32} />
                  <div className="text-grey-c400">Không tìm thấy kết quả</div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
