import React, { useState } from "react";
import { FilesId } from "../chat";
import Image from "next/image";
import { motion } from "framer-motion";
import { Message } from "../../../utils/interfaces";
import TextArea from "@/libs/text-area";
import Button from "@/libs/button";
import { openAlert } from "@/redux/slices/alert";
import { useDispatch } from "react-redux";
import { FileIcon, PdfIcon, WordIcon } from "@/components/icons";
import { feedbackMessage } from "@/api/services/message";
import { getAccessToken } from "@/storage/storage";

type props = {
  message: Message;
  filesId: FilesId[];
};

const ChatItem = ({ message, filesId }: props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [comment, setComment] = useState("");
  const [tempComment, setTempComment] = useState(""); // Store temporary comment while editing

  // Check if message has OCR but no corresponding file
  const hasOcrButNoFile = message?.hasFile === true && filesId.length === 0;

  const handleLikeAction = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Vui lòng đăng nhập để thực hiện chức năng này",
            type: "error",
          }),
        );
        return;
      }

      const newLikeState = !like;
      setLike(newLikeState);
      if (dislike) {
        setDislike(false);
      }

      await feedbackMessage(
        {
          message_id: message.id,
          feedback: newLikeState,
          comment: comment,
        },
        token
      );
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Có lỗi xảy ra khi gửi phản hồi",
          type: "error",
        }),
      );
    }
  };

  const handleDislikeAction = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Vui lòng đăng nhập để thực hiện chức năng này",
            type: "error",
          }),
        );
        return;
      }

      const newDislikeState = !dislike;
      setDislike(newDislikeState);
      if (like) {
        setLike(false);
      }

      await feedbackMessage(
        {
          message_id: message.id,
          feedback: !newDislikeState, // false for dislike
          comment: comment,
        },
        token
      );
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Có lỗi xảy ra khi gửi phản hồi",
          type: "error",
        }),
      );
    }
  };

  const handleSendComment = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Vui lòng đăng nhập để thực hiện chức năng này",
            type: "error",
          }),
        );
        return;
      }

      await feedbackMessage(
        {
          message_id: message.id,
          feedback: like ? true : dislike ? false : null,
          comment: tempComment,
        },
        token
      );

      setComment(tempComment); // Update the actual comment state
      setOpen(false);
      
      // Show different notifications based on whether comment was deleted
      if (comment && !tempComment) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Xóa bình luận",
            subtitle: "Bình luận đã được xóa thành công",
            type: "success",
          }),
        );
      } else {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Thông báo",
            subtitle: "Gửi bình luận thành công",
            type: "info",
          }),
        );
      }
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Có lỗi xảy ra khi gửi bình luận",
          type: "error",
        }),
      );
    }
  };

  const handleCancelComment = () => {
    setOpen(false);
    setTempComment(comment); // Restore the previous comment
  };

  const handleEditComment = () => {
    setTempComment(comment); // Store current comment in temp state
    setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendComment();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      dispatch(
        openAlert({
          isOpen: true,
          title: "Thông báo",
          subtitle: "Sao chép thành công",
          type: "info",
        }),
      );
    } catch (error) {
      dispatch(
        openAlert({
          isOpen: true,
          title: "Lỗi",
          subtitle: "Sao chép thất bại",
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="whitespace-pre-wrap w-full text-black/90 font-medium">
      {message.role === "user" && (
        <div className="my-6 md:my-8 w-full flex flex-wrap">
          <div className="ml-auto mt-1.5">
            <div className="flex flex-wrap gap-2 mb-2">
              {hasOcrButNoFile ? (
                <div className="px-6 py-4 flex items-center justify-center bg-grey-c100 rounded-lg">
                  <div className="text-center text-grey-c500 text-sm cursor-default">File không khả dụng</div>
                </div>
              ) : (
                filesId
                  .filter((file) => file.messageId === message.id)
                  .map((file) => (
                    <div key={file.id} className="w-36 h-36 p-2 group relative">
                      {file.type?.startsWith("image/") ? (
                        <Image
                          className="object-cover object-center w-full h-full rounded-lg"
                          src={file.imageUrl}
                          width={512}
                          height={512}
                          alt="uploaded image"
                        />
                      ) : (
                        <a
                          href={file.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-full flex flex-col items-center justify-center bg-grey-c100 rounded-lg hover:bg-grey-c200 transition-colors"
                        >
                          {file.type === "application/pdf" ? (
                            <PdfIcon className="w-12 h-12" />
                          ) : file.type === "application/msword" ||
                            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                            <WordIcon className="w-12 h-12" />
                          ) : (
                            <FileIcon className="w-12 h-12" />
                          )}
                          <span className="text-xs text-grey-c900 mt-2 text-center px-2 truncate w-full">
                            {file.name || "Download file"}
                          </span>
                        </a>
                      )}
                    </div>
                  ))
              )}
            </div>
            {!hasOcrButNoFile ? (
              <div className="py-2 px-3 lg:px-4 bg-grey-c100 rounded-2xl w-fit ml-auto">
                <p className="text-sm 2xl:text-base break-words max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
                  {message.content}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {message.role === "assistant" && (
        <div>
          <div className="flex gap-2 items-start md:gap-3 w-full">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/logo/main-robotic.svg" width={24} height={24} alt="Medical chatbot" />
                <p className="font-bold text-sm md:text-sm">BOT</p>
              </div>
              <div
                className="text-sm 2xl:text-base"
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
              <div className="flex flex-row items-center gap-2 mt-2 2xl:mt-4 w-full">
                <button
                  onClick={handleLikeAction}
                  className={`${
                    like ? "bg-button-c10" : "hover:bg-grey-c100 active:bg-grey-c200"
                  } rounded-md p-1 duration-200 transition`}
                >
                  {like ? (
                    <Image src="/icons/blue-like-icon.svg" alt="blue-like-icon" width={18} height={18} />
                  ) : (
                    <Image src="/icons/like-icon.svg" alt="like-icon" width={18} height={18} />
                  )}
                </button>
                <button
                  onClick={handleDislikeAction}
                  className={`${
                    dislike ? "bg-button-c10" : "hover:bg-grey-c100 active:bg-grey-c200"
                  } rounded-md p-1 duration-200 transition`}
                >
                  {dislike ? (
                    <Image src="/icons/blue-dislike-icon.svg" alt="blue-dislike-icon" width={18} height={18} />
                  ) : (
                    <Image src="/icons/dislike-icon.svg" alt="dislike-icon" width={18} height={18} />
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="hover:bg-grey-c100 active:bg-grey-c200 rounded-md p-1 duration-200 transition"
                >
                  <Image src="/icons/copy-icon.svg" alt="copy-icon" width={18} height={18} />
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="hover:bg-grey-c100 active:bg-grey-c200 rounded-md p-1 duration-200 transition"
                >
                  <Image src="/icons/add-comment.svg" alt="add-comment" width={18} height={18} />
                </button>
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 2xl:mt-6 w-full flex flex-col gap-3"
                >
                  <TextArea
                    label="Vui lòng nhập nội dung bổ sung"
                    defaultValue={tempComment}
                    onChange={(value) => setTempComment(value)}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                  <div className="flex flex-row items-center justify-end gap-2 w-full">
                    <Button
                      label="Hủy"
                      onClick={handleCancelComment}
                      status="cancel"
                      className="rounded-xl py-2 px-8 !bg-grey-c200/60"
                    />
                    <Button
                      label="Gửi"
                      onClick={handleSendComment}
                      status="primary"
                      className="rounded-xl !py-2 px-8 bg-primary-c900"
                    />
                  </div>
                </motion.div>
              )}
              {comment && !open ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
    >
                <div className="relative mt-4 2xl:mt-6 mb-2">
                  <div className="absolute -top-3.5 left-4 bg-white px-2">
                    <span className="text-grey-c900 text-xs 2xl:text-sm">Thông tin bổ sung</span>
                  </div>
                    <div className="border-[2px] border-grey-c200/60 rounded-xl px-4 py-3 2xl:px-5 2xl:py-4 mt-2">
                      <div className="text-justify text-black/90 text-sm 2xl:text-base leading-7">
                        {comment}{" "}
                        <button
                          onClick={handleEditComment}
                          className="hover:bg-grey-c100 active:bg-grey-c200 rounded-md p-1 duration-200 transition ml-1"
                        >
                          <Image src="/icons/edit-icon.svg" alt="edit-icon" width={0} height={0} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
