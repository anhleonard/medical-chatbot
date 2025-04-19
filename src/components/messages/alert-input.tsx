import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogTrigger, AlertDialogDescription, AlertDialogHeader, AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { generateRandomString, programmingLanguages } from "./message-codeblock";
import { FaDownload } from "react-icons/fa6";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

export type AlertInputProps = {
    value: string,
    language: string
}

export default function AlertInput({value, language} : AlertInputProps) {
    const handleModalConfirm = () => {
        setIsModalOpen(false);
        if (!fileName) {
          return;
        }
  
        const blob = new Blob([value], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => {
            toast({
                title: "Success",
                description: "Berhasil mengunduh file"
            })
        }, 500)
      };

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [fileName, setFileName] = useState('');
  
      const downloadAsFile = () => {
        const fileExtension = programmingLanguages[language] || ".file";
        const suggestedFileName = `file-${generateRandomString(3, true)}${fileExtension}`;
        setFileName(suggestedFileName)
        setIsModalOpen(true);
      };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-300 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
                onClick={downloadAsFile}
                >
                <FaDownload size={16} />
            </Button>        
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Enter File Name</AlertDialogTitle>
                <AlertDialogDescription>
                Please provide a name for the file.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="input-class"
            />
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleModalConfirm}>Download</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
