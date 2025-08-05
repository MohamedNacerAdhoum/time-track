import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { useAuthStore } from "@/contexts/UserContext";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Make onConfirm optional since we'll handle logout internally
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the onConfirm callback if provided (for any additional cleanup)
      if (onConfirm) {
        await onConfirm();
      }

      // Call the logout function from the auth store
      await logout();

      // Show success message
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out.",
      });

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error while logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
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
            Log out Confirmation
          </h2>
          <p
            className="text-[18px] font-normal text-black leading-normal"
            style={{
              fontFamily:
                "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            Are you sure you want to Log out?
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
              Cancel
            </span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex px-4 py-2 justify-center items-center gap-[10px] rounded-[10px] bg-[#FF6262] hover:bg-[#FF5252] transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white text-base font-normal leading-normal" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                  Logging out...
                </span>
              </>
            ) : (
              <span className="text-white text-base font-normal leading-normal" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                Log out
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
