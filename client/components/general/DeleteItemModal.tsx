import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { createPortal } from "react-dom";

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loadingText?: string;
  itemName?: string;
}

export function DeleteItemModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  loadingText = "Deleting...",
  itemName = ""
}: DeleteItemModalProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: `There was an error while deleting ${itemName ? itemName : 'the item'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[10px] p-[30px] flex flex-col items-end gap-[11px] w-full max-w-[578px] mx-4">
        {/* Content */}
        <div className="flex flex-col justify-center items-start gap-[11px] w-full">
          <h2
            className="text-[30px] font-normal text-black leading-normal"
            style={{
              fontFamily:
                "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {title}
          </h2>
          <p
            className="text-[18px] font-normal text-black leading-normal"
            style={{
              fontFamily:
                "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-start gap-3 h-[40px]">
          <button
            onClick={onClose}
            className="flex px-4 py-2 justify-center items-center gap-[10px] rounded-[10px] border border-[#DDD] bg-white hover:bg-gray-50 transition-colors"
          >
            <span
              className="text-black text-base font-normal leading-normal"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {cancelButtonText}
            </span>
          </button>

          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`flex px-4 py-2 justify-center items-center gap-[10px] rounded-[10px] bg-[#FF6262] hover:bg-[#FF5252] transition-colors ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white text-base font-normal leading-normal" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                  {loadingText}
                </span>
              </>
            ) : (
              <span className="text-white text-base font-normal leading-normal" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                {confirmButtonText}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
