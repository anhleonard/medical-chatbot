import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getDateLabel } from "@/utils/day-mapper";
import Spinner from "@/components/spinner";
import { useContext } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Context } from "@/context/context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function ChatHistory() {
  const { chats, isLoadingChats, setIsVisible } = useContext(Context);
  const displayedLabels = new Set<string>();
  const isLgScreen = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const currentChatId = pathname.split("/").pop();

  return (
    <>
      {isLoadingChats ? (
        <div className="w-full h-full flex justify-center items-center bg-white rounded-bl-xl rounded-br-xl">
          <Spinner className="h-5 w-5 animate-spin text-grey-c400" />
        </div>
      ) : (
        <ScrollArea className="relative overflow-y-auto h-full font-medium bg-white rounded-bl-xl rounded-br-xl p-2">
          <ScrollBar orientation="vertical" />
          <div className="flex flex-col h-full overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col gap-2 items-center justify-center mt-32">
                <Image src="/icons/not-found-item.svg" alt="not-found-item" width={32} height={32} />
                <div className="text-grey-c400 text-[13px]">Bạn chưa có đoạn chat nào</div>
              </div>
            ) : null}
            {chats.length !== 0
              ? chats.map((chat, index) => {
                  // may be replaced with updated_at
                  const createdAt = new Date(chat.created_at);
                  const dateLabel = getDateLabel(createdAt);
                  const shouldDisplayLabel = !displayedLabels.has(dateLabel);
                  if (shouldDisplayLabel) {
                    displayedLabels.add(dateLabel);
                  }

                  const truncatedText = chat?.title?.length! > 26 ? chat?.title?.substring(0, 26) + "..." : chat?.title;
                  return (
                    <div key={chat.id} className={`${shouldDisplayLabel && dateLabel !== "Hôm nay" ? "mt-6" : "mt-0"}`}>
                      {shouldDisplayLabel && <div className="text-grey-c400 text-xs mb-1 px-2">{dateLabel}</div>}
                      <Link
                        href={`/chat/${chat.id}`}
                        className="w-full"
                        onClick={() => {
                          if (!isLgScreen) {
                            setIsVisible(false);
                          }
                        }}
                      >
                        <button
                          className={`mt-1 rounded-lg p-2 py-2.5 text-sm text-left shadow-none hover:bg-grey-c100 w-full justify-start text-black/90 duration-200 transition-all ${
                            chat.id === Number(currentChatId) ? "bg-grey-c100" : "bg-transparent"
                          }`}
                        >
                          {index === 0 ? <Typewriter words={[truncatedText!]} loop={1} /> : truncatedText}
                        </button>
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-bl-xl rounded-br-xl" />
        </ScrollArea>
      )}
    </>
  );
}
