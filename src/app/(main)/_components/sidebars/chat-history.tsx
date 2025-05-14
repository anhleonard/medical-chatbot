import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getDateLabel } from "@/utils/day-mapper";
import Spinner from "@/components/spinner";
import { useContext, useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Context } from "@/context/context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Separator } from "@/libs/separator";
import { Input } from "@/components/ui/input";
import { getAccessToken } from "@/storage/storage";
import { deleteConversation, updateConversationTitle } from "@/api/services/conversation";
import { openAlert } from "@/redux/slices/alert";
import { useDispatch } from "react-redux";
import { openConfirmModal } from "@/redux/slices/confirm";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { setChatId } from "@/redux/slices/chat";

export default function ChatHistory() {
  const { chats, isLoadingChats, setIsVisible, setChats } = useContext(Context);
  const displayedLabels = new Set<string>();
  const isLgScreen = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentChatId = pathname.split("/").pop();
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingChatId]);

  const handleChangeTitle = (chatId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setEditingChatId(chatId);
      setEditingTitle(chat.title);
    }
  };

  const handleTitleBlur = async () => {
    if (!editingChatId || !editingTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    // Store the original chat data in case of failure
    const originalChat = chats.find((chat) => chat.id === editingChatId);
    if (!originalChat) {
      setEditingChatId(null);
      return;
    }

    // Check if title has actually changed
    if (originalChat.title === editingTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("No access token found");
      }

      await updateConversationTitle(editingChatId, editingTitle.trim(), token);

      // Update the chat title in the local state and move it to the top
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.id === editingChatId ? { ...chat, title: editingTitle.trim() } : chat,
        );

        // Find the updated chat and move it to the top
        const updatedChat = updatedChats.find((chat) => chat.id === editingChatId);
        if (updatedChat) {
          const filteredChats = updatedChats.filter((chat) => chat.id !== editingChatId);
          return [updatedChat, ...filteredChats];
        }
        return updatedChats;
      });

      dispatch(
        openAlert({
          isOpen: true,
          title: "Thành công",
          subtitle: "Đã cập nhật tiêu đề",
          type: "success",
        }),
      );
    } catch (error) {
      // Restore the original chat data on failure
      setChats((prevChats) => prevChats.map((chat) => (chat.id === editingChatId ? originalChat : chat)));

      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Không thể cập nhật tiêu đề",
          type: "error",
        }),
      );
    } finally {
      setEditingChatId(null);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setEditingChatId(null);
    }
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      openConfirmModal({
        title: "XÓA ĐOẠN CHAT",
        subtitle: "Bạn có chắc chắn muốn xóa đoạn chat này không?",
        onConfirm: async () => {
          try {
            dispatch(openLoading());
            const token = getAccessToken();
            if (!token) {
              throw new Error("No access token found");
            }
            await deleteConversation(chatId, token);

            // Update local state by removing the deleted chat
            setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

            // If the deleted chat is the current one, redirect to main chat page
            if (Number(currentChatId) === chatId) {
              router.push("/chat");
            }

            dispatch(
              openAlert({
                isOpen: true,
                title: "Thành công",
                subtitle: "Đã xóa đoạn chat",
                type: "success",
              }),
            );
          } catch (error) {
            dispatch(
              openAlert({
                isOpen: true,
                title: "Lỗi",
                subtitle: "Không thể xóa đoạn chat",
                type: "error",
              }),
            );
          } finally {
            dispatch(closeLoading());
          }
        },
      }),
    );
  };

  const handleChatClick = (chatId: number) => {
    dispatch(setChatId(chatId));
    if (!isLgScreen) {
      setIsVisible(false);
    }
  };

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
              <div className="flex flex-col gap-2 items-center justify-center w-full h-full absolute inset-0">
                <Image
                  src="/icons/not-found-item.svg"
                  alt="not-found-item"
                  width={0}
                  height={0}
                  className="w-8 h-8 2xl:w-10 2xl:h-10"
                />
                <div className="text-grey-c400 text-[13px] 2xl:text-[15px]">Bạn chưa có đoạn chat nào</div>
              </div>
            ) : null}
            {chats.length !== 0 &&
              chats.map((chat, index) => {
                const updatedAt = new Date(chat?.updated_at);
                const dateLabel = getDateLabel(updatedAt);
                const shouldDisplayLabel = !displayedLabels.has(dateLabel);
                if (shouldDisplayLabel) displayedLabels.add(dateLabel);

                const truncatedText = chat?.title?.length! > 26 ? chat?.title?.substring(0, 26) + "..." : chat?.title;

                return (
                  <div key={chat.id} className={`${shouldDisplayLabel && dateLabel !== "Hôm nay" ? "mt-6" : "mt-0"}`}>
                    {shouldDisplayLabel && <div className="text-grey-c400 text-xs mb-1 px-2">{dateLabel}</div>}

                    <div className="relative w-full mt-1">
                      <div
                        className={`flex items-center justify-between gap-2 rounded-lg p-2 py-2.5 text-sm 2xl:text-base text-left shadow-none hover:bg-grey-c100 w-full text-black/90 duration-200 transition-all ${
                          chat.id === Number(currentChatId) ? "bg-grey-c100" : "bg-transparent"
                        }`}
                      >
                        {editingChatId === chat.id ? (
                          <input
                            ref={inputRef}
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            className="rounded-sm flex-1 bg-transparent border border-grey-c200 focus:outline-none focus-visible:ring-0 p-0 h-auto text-sm 2xl:text-base"
                          />
                        ) : (
                          <Link
                            href={`/chat/${chat.id}`}
                            className="block truncate flex-1"
                            onClick={() => handleChatClick(chat.id)}
                          >
                            <div className="truncate pr-2">
                              {index === 0 ? <Typewriter words={[truncatedText!]} loop={1} /> : truncatedText}
                            </div>
                          </Link>
                        )}

                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="three-dot-button w-[12px] h-4 flex items-center justify-center"
                              data-action="three-dot"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Image src="/icons/three-dot.svg" alt="three-dot" width={3} height={24} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            align="start"
                            className="mt-1 z-[900] w-[150px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-grey-c900 rounded-lg border-grey-c200/50 border-[1px] overflow-hidden
                            data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                          >
                            <div className="flex flex-col">
                              <button
                                onClick={(e) => handleChangeTitle(chat.id, e)}
                                className="hover:bg-grey-c100 active:bg-grey-c200 px-3 py-2 w-full flex flex-wrap gap-2 items-center font-medium text-xs"
                              >
                                <Image src="/icons/edit-title.svg" alt="edit-title" width={20} height={20} />
                                Thay đổi tiêu đề
                              </button>
                              <Separator />
                              <button
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className="hover:bg-grey-c100 active:bg-grey-c200 px-3 py-2 w-full flex flex-wrap gap-2 items-center font-medium text-xs"
                              >
                                <Image src="/icons/delete-icon.svg" alt="delete-icon" width={20} height={20} />
                                Xóa đoạn chat
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-bl-xl rounded-br-xl" />
        </ScrollArea>
      )}
    </>
  );
}
