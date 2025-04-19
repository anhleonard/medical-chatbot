import { FilesId } from "@/components/chat";
import { Message } from "ai";

type UploadResponse = {
    success?: boolean;
    data?: any;
    error?: string;
};


export async function saveChat(chatId: string | null, messages: Message[], filesId: FilesId[]): Promise<string> {
    console.log('saving chat...')
    const saveUrl = '/api/chat/save';
    const formData = new FormData();
    formData.append('chatId', chatId ? chatId : "null"); 
    formData.append('messages', JSON.stringify(messages)); 
    formData.append('filesId', JSON.stringify(filesId)); 

    try {
        const response = await fetch(saveUrl, {
            method: 'POST',
            body: formData
        });
        const result: UploadResponse = await response.json();
        if (result.success === true) {
            console.log("Save chat berhasil");
            console.log(result)
            return result.data.id
        } else {
            throw new Error(`Save chat failed`);
        }
    } catch (error){
        console.error(error);
        return (error as Error).message
    }
}