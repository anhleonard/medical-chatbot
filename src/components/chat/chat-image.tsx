import Image from "next/image";
import { FilesId } from "../chat";
import { useState } from "react";
import { Modal } from "../modal";

type props = {
  filesIds: FilesId[];
  messageId: string;
};

export default function ChatImage({ filesIds, messageId }: props) {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  return (
    <>
      {filesIds.map(
        (file) =>
          messageId === file.id && (
            <div className="w-36 h-36 p-2 group relative ml-auto" key={`${file.id}-${file.imageUrl}`}>
              <Image
                className="object-cover object-center w-full h-full rounded-lg cursor-pointer blur"
                src={`https://storage.googleapis.com/digman-dev/${file.imageUrl}`}
                width={512}
                height={512}
                alt={file.id}
                onClick={() => setModalImageUrl(`https://storage.googleapis.com/digman-dev/${file.imageUrl}`)}
                onLoadingComplete={(image) => image.classList.remove("blur")}
                // onError={(event)=>{
                //     const target = event.target as HTMLImageElement;
                //     target.src = `https://storage.googleapis.com/digman-dev/${file.imageUrl}`
                // }}
              />
            </div>
          ),
      )}
      {modalImageUrl && <Modal src={modalImageUrl} alt={"modal-image"} onClose={() => setModalImageUrl(null)} />}
    </>
  );
}
