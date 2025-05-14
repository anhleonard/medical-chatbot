import { PiShootingStarLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import ChatHistory from "../chat-history";
import Image from "next/image";
import SearchModal from "../../search-modal";
import { useDispatch } from "react-redux";
import { resetChat } from "@/redux/slices/chat";

export default function ChatSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlerNewChat = () => {
    dispatch(resetChat());
    router.replace("/chat");
  };

  return (
    <div className="flex flex-col h-full bg-primary-c10 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 w-fit">
            <Image src="/logo/medical-logo.svg" alt="medical-logo" width={24} height={24} />
            <div className="font-righteous text-xl 2xl:text-2xl">
              <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-3 bg-white p-2 rounded-tl-xl rounded-tr-xl">
          <div className="flex flex-row gap-2">
            <button
              onClick={handlerNewChat}
              className="flex-1 flex flex-row items-center justify-center gap-2 py-3 rounded-2xl bg-button-c10 hover:bg-button-c50 active:bg-button-c100 duration-300 transition-all"
            >
              <Image src="/icons/blue-add-icon.svg" alt="blue-add-icon" width={18} height={18} />
              <div className="text-sm 2xl:text-base text-primary-c900 font-semibold">Tạo mới</div>
            </button>
            <SearchModal />
          </div>
          <div className="w-full h-[0.5px] bg-grey-c100"></div>
        </div>
      </div>
      <ChatHistory />
      <div>
        <button className="rounded-xl mt-2 w-full justify-start flex flex-wrap gap-2 items-center hover:bg-button-c10 bg-white active:bg-button-c50 p-2 h-auto duration-300 transition-all">
          <div className="p-1.5 border-[1.5px] rounded-full border-primary-c900">
            <PiShootingStarLight className="text-xl text-primary-c900" />
          </div>
          <div className="flex flex-col justify-start">
            <h5 className="text-start text-primary-c900 text-sm font-medium">Nâng cấp gói</h5>
            <p className="text-xs text-grey-c900">Hỏi đáp không giới hạn</p>
          </div>
        </button>
      </div>
    </div>
  );
}
