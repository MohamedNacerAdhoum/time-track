import { useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, XCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

interface DemandData {
  id: string;
  name: string;
  role?: string;
  subject: string;
  content: string;
  createdAt: string;
  state: "Pending" | "Approved" | "Declined";
  attachments?: Array<{
    name: string;
    size: string;
    url?: string;
  }>;
  userAvatar?: string;
}

interface DemandViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  demand?: DemandData;
  onApprove?: (demandId: string) => Promise<void> | void;
  onDecline?: (demandId: string) => Promise<void> | void;
  onDownload?: (attachment: { name: string; url?: string }) => void;
  showActions?: boolean;
}

export function DemandViewModal({
  isOpen,
  onClose,
  demand,
  onApprove,
  onDecline,
  onDownload,
  showActions = true,
}: DemandViewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!demand || !onApprove) return;

    try {
      setIsProcessing(true);
      await onApprove(demand.id);
      onClose();
      toast({
        title: "Demand Approved",
        description: "The demand has been approved successfully.",
      });
    } catch (error) {
      console.error("Approve error:", error);
      toast({
        title: "Approval Failed",
        description:
          "There was an error approving the demand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!demand || !onDecline) return;

    try {
      setIsProcessing(true);
      await onDecline(demand.id);
      onClose();
      toast({
        title: "Demand Declined",
        description: "The demand has been declined.",
      });
    } catch (error) {
      console.error("Decline error:", error);
      toast({
        title: "Decline Failed",
        description:
          "There was an error declining the demand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (attachment: { name: string; url?: string }) => {
    if (onDownload) {
      onDownload(attachment);
    } else {
      toast({
        title: "Download",
        description: `Downloading ${attachment.name}...`,
      });
    }
  };

  if (!isOpen || !demand) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 sm:p-10 flex flex-col gap-6 sm:gap-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black font-poppins">
            Demand subject
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 text-[#979797] hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* User Info and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {demand.userAvatar ? (
              <img
                src={demand.userAvatar}
                alt={demand.name}
                className="w-15 h-15 rounded-full object-cover"
              />
            ) : (
              <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-500">
                {demand.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-black font-poppins">
              {demand.name}
            </h3>
            {demand.role && (
              <p className="text-base font-semibold text-[#979797] font-poppins">
                {demand.role}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {showActions && demand.state === "Pending" && (
            <div className="flex gap-4 sm:gap-9">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-16 h-16 rounded-full bg-[#56C992] hover:bg-[#4AB881] text-white p-0"
              >
                <CheckCircle className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecline}
                disabled={isProcessing}
                className="w-16 h-16 rounded-full bg-[#FF6262] hover:bg-[#FF5252] text-white p-0"
              >
                <XCircle className="w-8 h-8" />
              </Button>
            </div>
          )}
        </div>

        {/* Demand Content */}
        <div className="space-y-6">
          <div className="text-lg sm:text-xl text-[#666] font-poppins leading-relaxed">
            {demand.content}
          </div>

          {/* Attachments */}
          {demand.attachments && demand.attachments.length > 0 && (
            <div className="space-y-4">
              {demand.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-[#63CDFA] rounded-xl bg-white gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <FileText className="w-10 h-10 text-[#63CDFA] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-[#63CDFA] font-poppins underline truncate">
                        {attachment.name}
                      </p>
                      <p className="text-base font-semibold text-[#979797] font-poppins">
                        {attachment.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(attachment)}
                    className="w-10 h-10 text-[#63CDFA] hover:bg-[#F2FBFF] flex-shrink-0"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
