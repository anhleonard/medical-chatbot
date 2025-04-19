import Image from "next/image";
import React, { useEffect, useCallback } from "react";

type ModalProps = {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ src, alt, caption, onClose }) => {
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [handleEscKey]);

  return (
    <div className="modal" onClick={handleClickOutside}>
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <img className="modal-content" src={src} alt={alt} />
      {caption && caption.length > 0 && <div className="caption">{caption}</div>}
    </div>
  );
};
