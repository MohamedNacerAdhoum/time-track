import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Download, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { DemandData } from "@/contexts/DemandsContext";

interface DemandViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  demand?: DemandData;
  responseData?: any;
  onApprove?: (demandId: string) => Promise<void> | void;
  onDecline?: (demandId: string) => Promise<void> | void;
  onDownload?: (attachment: { name: string; url?: string }) => void;
  showActions?: boolean;
  viewMode?: 'demand' | 'response';
}

export function DemandViewModal({
  isOpen,
  onClose,
  demand,
  responseData,
  onApprove,
  onDecline,
  onDownload,
  showActions = true,
  viewMode = 'demand',
}: DemandViewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !demand) return null;

  console.log('DemandViewModal rendering with:', {
    viewMode,
    demand,
    responseData,
    demandResponse: demand?.response,
    isResponseView: viewMode === 'response'
  });

  // Determine if we're viewing a response and get the appropriate data
  const isResponseView = viewMode === 'response';
  const response = responseData || demand?.response;
  
  console.log('DemandViewModal data:', {
    viewMode,
    demand,
    responseData,
    demandResponse: demand?.response,
    isResponseView,
    hasResponse: !!response,
    responseType: typeof response
  });
  
  // Handle case where response might be just an ID string
  const displayData = isResponseView ? 
    (typeof response === 'string' ? null : response) : 
    demand;
    
  // Get sender info based on whether we're viewing a response
  const sender = isResponseView ? 
    (typeof response === 'object' ? response?.employee : null) : 
    demand?.sender;
  
  console.log('Display data:', { 
    displayData, 
    sender,
    isResponseView,
    hasDisplayData: !!displayData,
    senderType: typeof sender
  });

  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 sm:p-10 flex flex-col gap-6 sm:gap-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black font-poppins">
            {isResponseView 
              ? `Response to: ${demand.subject || 'Demand'}` 
              : demand?.subject || 'Demand Details'}
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
            <div className="w-15 h-15 rounded-full p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                {sender?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-black font-poppins">
              {sender?.name || 'Unknown User'}
            </h3>
            {sender?.role_name && (
              <p className="text-base font-semibold text-[#979797] font-poppins">
                {sender.role_name}
              </p>
            )}
            {isResponseView && response?.responded_at && (
              <p className="text-sm text-gray-500">
                Replied on: {formatDate(response.responded_at)}
              </p>
            )}
          </div>

          {/* Action Buttons - Only show for demands (not responses) that are pending */}
          {showActions && !isResponseView && demand.state === "PENDING" && (
            <div className="flex gap-4 sm:gap-9">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-14 h-14 rounded-full bg-[#56C992] hover:bg-[#4AB881] text-white p-0 flex items-center justify-center"
              >
                <Check className="w-10 h-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecline}
                disabled={isProcessing}
                className="w-14 h-14 rounded-full bg-[#FF6262] hover:bg-[#FF5252] text-white p-0 flex items-center justify-center"
              >
                <X className="w-10 h-10" />
              </Button>
              {response?.attachment_url && (
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => onDownload?.({
                      name: response.attachment_name || 'Response Attachment',
                      url: response.attachment_url
                    })}
                  >
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">
                      {response.attachment_name || 'Response Attachment'}
                    </span>
                    <Download className="h-4 w-4 ml-auto text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
