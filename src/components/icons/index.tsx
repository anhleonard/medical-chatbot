import { FaFile, FaFilePdf, FaFileWord } from "react-icons/fa";

export const FileIcon = ({ className = "" }: { className?: string }) => {
  return <FaFile className={`text-grey-c900 ${className}`} />;
};

export const PdfIcon = ({ className = "" }: { className?: string }) => {
  return <FaFilePdf className={`text-support-c300 ${className}`} />;
};

export const WordIcon = ({ className = "" }: { className?: string }) => {
  return <FaFileWord className={`text-primary-c700 ${className}`} />;
};
