import React, { forwardRef } from "react";
import ScrollToBottom from "./scroll-to-bottom";
import { ScrollArea } from "../ui/scroll-area";
import { FilesId } from "../chat";
import ChatItem from "./chat-item";
import { Message } from "../../../utils/interfaces";
import Image from "next/image";
import { Loading } from "@/libs/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type props = {
  messages: Message[];
  filesId: FilesId[];
  height: number | undefined;
  loading: boolean;
  chatFormHeight: number;
  isProcessing: boolean;
};

const ChatContainer = forwardRef<HTMLDivElement, props>(
  ({ messages, filesId, height, loading, chatFormHeight, isProcessing }, ref) => {
    const { chatId } = useSelector((state: RootState) => state.chat);

    return (
      <>
        <ScrollToBottom ref={ref} height={height} chatFormHeight={chatFormHeight} />
        <ScrollArea ref={ref} className="w-full rounded-md pt-20">
          <div className="sm:w-[600px] md:w-[700px] xl:w-3/4 2xl:w-3/5 mx-auto px-2 md:px-0">
            {chatId ? (
              <>
                {messages.map((m) => {
                  const messageFiles = filesId.filter((file) => file.messageId === m.id);
                  return <ChatItem key={m.id} message={m} filesId={messageFiles} />;
                })}
                {isProcessing && <Loading />}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full mt-10 2xl:mt-20 gap-4 2xl:gap-6">
                <Image
                  src="/logo/funny-robotic.svg"
                  alt="funny-robotic"
                  width={0}
                  height={0}
                  className="w-[200px] h-[200px] xl:w-[250px] xl:h-[250px] 2xl:w-[350px] 2xl:h-[350px] animate-scale-in"
                />
                <div className="text-center text-grey-c900 font-bold text-3xl 2xl:text-4xl">
                  Xin chào, tôi có thể giúp gì cho bạn?
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </>
    );
  },
);

ChatContainer.displayName = "ChatContainer";
export default ChatContainer;
