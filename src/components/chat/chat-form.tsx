import { Cross1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { FaFile, FaFilePdf, FaFileWord } from "react-icons/fa";
import { Input } from "../ui/input";
import TextareaAutosize from "react-textarea-autosize";
import { IoIosSend } from "react-icons/io";
import { FilesId } from "../chat";
import Spinner from "../spinner";
import { Context } from "@/context/context";
import { useRouter } from "next/navigation";
import { Message } from "../../../utils/interfaces";
import { openAlert } from "@/redux/slices/alert";
import { useDispatch } from "react-redux";

type props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  filesId: FilesId[];
  setFilesId: Dispatch<SetStateAction<FilesId[]>>;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  fileUploaded: Record<string, string>;
  setFileUploaded: Dispatch<SetStateAction<Record<string, string>>>;
  chatId: string | null;
  setChatId: Dispatch<SetStateAction<string | null>>;
  messages: Message[];
  onHeightChange: (height: number) => void;
};

export default function ChatForm({
  handleSubmit,
  isLoading,
  input,
  handleInputChange,
  filesId,
  setFilesId,
  files,
  setFiles,
  fileUploaded,
  setFileUploaded,
  chatId,
  setChatId,
  messages,
  onHeightChange,
}: props) {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { chats, setChats } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    const updateHeight = () => {
      if (formRef.current) {
        const height = formRef.current.getBoundingClientRect().height;
        onHeightChange(height);
      }
    };

    // Update height initially
    updateHeight();

    // Create ResizeObserver to watch for changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (formRef.current) {
      resizeObserver.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        resizeObserver.unobserve(formRef.current);
      }
    };
  }, [onHeightChange]);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isAcceptedFileType = (type: string) => {
    return (
      type.startsWith("image/") ||
      type === "application/pdf" ||
      type === "application/msword" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const items = event.target.files;
    if (items) {
      const newFiles = Array.from(items).filter((file): file is File => file !== null && isAcceptedFileType(file.type));

      const newFileCount = files.length + newFiles.length;

      if (newFileCount > 3) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Chỉ upload tối đa 3 files",
            type: "error",
          }),
        );
        return;
      }

      for (let file of newFiles) {
        if (file.size > 5 * 1024 * 1024) {
          dispatch(
            openAlert({
              isOpen: true,
              title: "Lỗi",
              subtitle: "Dung lượng file tối đa là 5MB",
              type: "error",
            }),
          );
          return;
        }
      }

      event.target.value = ""; // Reset input để onChange luôn trigger

      // Tạo unique name cho mỗi file để tránh trùng lặp
      const uniqueNewFiles = newFiles.map((file) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
        return new File([file], uniqueName, { type: file.type });
      });

      setFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);

      // Tạo URL cho mỗi file để hiển thị ảnh preview
      const newFileUploaded: Record<string, string> = {};
      for (let file of uniqueNewFiles) {
        const fileURL = URL.createObjectURL(file);
        newFileUploaded[file.name] = fileURL;
      }

      setFileUploaded((prevFileUploaded) => ({
        ...prevFileUploaded,
        ...newFileUploaded,
      }));
    }
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (items) {
      const newFiles = Array.from(items)
        .map((item) => (item.kind === "file" && isAcceptedFileType(item.type) ? item.getAsFile() : null))
        .filter((file): file is File => file !== null);

      const newFileCount = files.length + newFiles.length;
      if (newFileCount > 3) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Chỉ upload tối đa 3 files",
            type: "error",
          }),
        );
        return;
      }

      for (let file of newFiles) {
        if (file.size > 5 * 1024 * 1024) {
          dispatch(
            openAlert({
              isOpen: true,
              title: "Lỗi",
              subtitle: "Dung lượng file tối đa là 5MB",
              type: "error",
            }),
          );
          return;
        }
      }

      // Tạo unique name cho mỗi file để tránh trùng lặp
      const uniqueNewFiles = newFiles.map((file) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
        return new File([file], uniqueName, { type: file.type });
      });

      setFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);

      // Tạo URL cho mỗi file để hiển thị ảnh preview
      const newFileUploaded: Record<string, string> = {};
      for (let file of uniqueNewFiles) {
        const fileURL = URL.createObjectURL(file);
        newFileUploaded[file.name] = fileURL;
      }

      setFileUploaded((prevFileUploaded) => ({
        ...prevFileUploaded,
        ...newFileUploaded,
      }));
    }
  };

  const removeFile = (index: number) => {
    // Lấy file tại index cần xóa
    const fileToRemove = files[index];

    // Xóa file khỏi mảng files
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    // Xóa URL của file khỏi fileUploaded
    setFileUploaded((prevFileUploaded) => {
      const updatedFileUploaded = { ...prevFileUploaded };
      // Chỉ xóa URL của file tại index tương ứng
      delete updatedFileUploaded[fileToRemove.name];
      return updatedFileUploaded;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isLoading) {
      event.preventDefault();
      handleSubmit(event as any);
    }
  };

  const isAnyFileUploading = Object.values(uploading).some((status) => status);

  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const isPdf = (file: File) => {
    return file.type === "application/pdf";
  };

  const isDoc = (file: File) => {
    return (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const getFileIcon = (file: File) => {
    if (isPdf(file)) {
      return <FaFilePdf className="text-2xl text-support-c300" />;
    } else if (isDoc(file)) {
      return <FaFileWord className="text-2xl text-primary-c700" />;
    } else {
      return <FaFile className="text-2xl" />;
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      <div className="rounded-[28px] py-2 bg-white shadow-[0_0_20px_rgb(0,0,0,0.2)]">
        <div className="flex flex-wrap px-2.5">
          {files.map((file, index) => (
            <div key={index} className="relative">
              {isImage(file) ? (
                <div className="w-[72px] h-[72px] p-2 relative group">
                  {!uploading[file.name] && (
                    <button
                      className="absolute right-0 top-0 p-1 bg-grey-c700 rounded-full hidden group-hover:block cursor-pointer shadow-lg z-10"
                      onClick={() => removeFile(index)}
                      type="button"
                    >
                      <Cross1Icon className="p-[0.5px] text-white" />
                    </button>
                  )}
                  <Image
                    className="object-cover object-center w-full h-full rounded-lg"
                    src={fileUploaded[file.name]}
                    width={256}
                    height={256}
                    alt="image"
                  />
                  {uploading[file.name] && (
                    <div className="absolute inset-0 m-2 rounded-lg bg-grey-c900 bg-opacity-50 flex items-center justify-center text-white">
                      <Spinner />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 relative group h-[72px]">
                  <button
                    className="absolute right-0 top-0 p-1 bg-grey-c700 rounded-full hidden group-hover:block cursor-pointer shadow-lg duration-300 transition z-10"
                    onClick={() => removeFile(index)}
                    type="button"
                  >
                    <Cross1Icon className="p-[0.5px] text-white" />
                  </button>
                  <div className="flex items-center justify-start w-48 sm:w-56 h-14 rounded-lg text-sm text-white p-3 gap-2 shadow-md bg-grey-c700">
                    {getFileIcon(file)}
                    <div className="w-3/4 break-words overflow-hidden text-ellipsis whitespace-nowrap">
                      {file.name.length > 25 ? `${file.name.slice(0, 25)}...` : file.name}
                    </div>
                    {uploading[file.name] && (
                      <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center text-white">
                        <Spinner />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center px-4">
          {/* Nút thêm file */}
          <button
            type="button"
            className="p-2 border rounded-full cursor-pointer flex items-center justify-center border-primary-c900/50 hover:bg-button-c10 duration-300 transition"
            onClick={handleFileInputClick}
          >
            <Image src={"/icons/plus-icon.svg"} alt="upload" width={16} height={16} />
          </button>

          {/* Input text */}
          <TextareaAutosize
            value={input}
            placeholder="Nhập nội dung để hỏi"
            onChange={handleInputChange}
            maxRows={12}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            style={{ height: 40 }}
            className="text-md text-black/90 flex-grow resize-none rounded-xl border-none bg-transparent px-4 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Nút gửi tin nhắn */}
          <button
            type="submit"
            disabled={isLoading || isAnyFileUploading}
            className={`p-2 flex items-center justify-center duration-300 transition ${
              isLoading || isAnyFileUploading ? "opacity-50 cursor-not-allowed" : "hover:opacity-50"
            }`}
          >
            <IoIosSend className="text-primary-c900 text-2xl sm:text-3xl" />
          </button>
        </div>
      </div>

      {/* Input file ẩn */}
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept="image/*,.pdf,.doc,.docx"
      />
    </form>
  );
}
