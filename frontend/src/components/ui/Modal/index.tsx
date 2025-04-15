import { type PropsWithChildren, type ButtonHTMLAttributes } from "react";
import { useModal } from "./useModal";
import { cn } from "@/shared/utils";
import { Xmark } from "iconoir-react";
import { CTAButton } from "@/components";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ctaButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function Modal({
  isOpen,
  onClose,
  title,
  ctaButtonProps,
  children,
}: ModalProps) {
  const { isClosing, modalRef, handleClose } = useModal(isOpen, onClose);
  const { className: ctaButtonClassName, ...restCtaButtonProps } =
    ctaButtonProps || {};

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
          isClosing ? "animate-fade-out" : "animate-fade-in"
        )}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={cn(
            "w-full max-w-xl",
            isClosing ? "animate-slide-down" : "animate-slide-up"
          )}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex w-full items-center justify-between px-6 py-4 border-b border-gray-200">
              {/* Header */}
              {title && (
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              )}
              {/* Close button */}
              <button
                onClick={handleClose}
                className=" text-gray-400 hover:text-gray-600 transition-all"
                aria-label="Close modal"
              >
                <Xmark />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            {ctaButtonProps && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <CTAButton
                  className={cn(
                    "bg-blue-600 border-t border-gray-200 flex justify-end",
                    ctaButtonClassName
                  )}
                  {...restCtaButtonProps}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
