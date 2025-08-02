import { X } from "lucide-react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[10px] p-[30px] flex flex-col items-end gap-[11px] w-full max-w-[578px] mx-4">
        {/* Content */}
        <div className="flex flex-col justify-center items-start gap-[11px] w-full">
          <h2 className="text-[30px] font-normal text-black font-[Poppins] leading-normal">
            Log out Confirmation
          </h2>
          <p className="text-[18px] font-normal text-black font-[Poppins] leading-normal">
            Are you sure you want to Log out?
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-center items-start gap-3 h-[40px]">
          <button
            onClick={onClose}
            className="flex px-4 py-2 justify-center items-center gap-[10px] rounded-[10px] border border-[#DDD] bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-black font-[Poppins] text-base font-normal leading-normal">
              Cancel
            </span>
          </button>
          
          <button
            onClick={onConfirm}
            className="flex px-4 py-2 justify-center items-center gap-[10px] rounded-[10px] bg-[#FF6262] hover:bg-[#FF5252] transition-colors"
          >
            <span className="text-white font-[Poppins] text-base font-normal leading-normal">
              Log out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
