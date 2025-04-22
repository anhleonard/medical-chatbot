import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { closeConfirmModal } from "@/redux/slices/confirm";

export function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, subtitle, onConfirm } = useSelector((state: RootState) => state.confirmModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    dispatch(closeConfirmModal());
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[999] flex items-start justify-center pt-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-120 rounded-xl bg-[#fdf4f6] shadow-lg relative"
            >
              <div className="w-full h-full px-5 py-5">
                <div className="flex items-start justify-center gap-5">
                  <Image src="/icons/delete-icon.svg" alt="confirm-icon" width={32} height={32} />
                  <div className="text-sm flex flex-col gap-1 items-start">
                    <div className="font-bold text-[15px] text-[#C21E1E]">{title}</div>
                    <div className="text-black/80 text-[13px] font-medium">{subtitle}</div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleClose}
                    className="w-24 px-4 py-2 rounded-2xl bg-white border border-grey-c200 text-gray-700 text-sm font-medium hover:bg-grey-c200 active:bg-grey-c300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="w-24 px-4 py-2 rounded-2xl bg-[#cb3333] text-white text-sm font-medium hover:bg-[#b12727] active:bg-[#a32121] transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-4 hover:opacity-50 active:opacity-70 duration-300 transition-all w-5 h-5"
              >
                <Image src="/icons/exit-icon.svg" alt="exit-icon" width={16} height={16} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
