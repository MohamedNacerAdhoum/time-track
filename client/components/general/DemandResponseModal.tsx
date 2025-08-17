import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";

interface DemandResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { body: string; file?: File }) => Promise<void> | void;
  demandId?: string;
}

export function DemandResponseModal({
  isOpen,
  onClose,
  onSubmit,
  demandId,
}: DemandResponseModalProps) {
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!body.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a response message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({ body: body.trim(), file: selectedFile || undefined });

      // Reset form
      setBody("");
      setSelectedFile(null);
      onClose();

      toast({
        title: "Response Sent",
        description: "Your demand response has been sent successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Send Failed",
        description:
          "There was an error sending your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setBody("");
    setSelectedFile(null);
    setIsDragOver(false);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 sm:p-10 flex flex-col gap-6 sm:gap-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black font-poppins">
            Demand response
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
          {/* Body Input */}
          <div className="flex-1 space-y-2">
            <label className="block text-base font-semibold text-black font-poppins">
              Body
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[290px] bg-[#F2FBFF] border-[#CCDFFF] border-2 rounded-lg resize-none p-4 text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
              placeholder="Type your response here..."
            />
          </div>

          {/* File Upload */}
          <div className="w-full lg:w-[350px] space-y-2">
            <label className="block text-base font-semibold text-black font-poppins">
              File
            </label>
            <div
              className={`flex flex-col items-center justify-center gap-6 p-6 h-[290px] border-2 border-dashed rounded-xl transition-colors ${
                isDragOver
                  ? "border-[#63CDFA] bg-[#E1F3FF]"
                  : "border-[#63CDFA] bg-[#F2FBFF]"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-10 h-10 text-[#63CDFA]" />

              <p className="text-center text-lg font-semibold text-[#979797] font-ibm-plex">
                Drag and drop file here or
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseFiles}
                className="border-2 border-[#63CDFA] text-[#979797] hover:bg-[#E1F3FF] font-ibm-plex font-semibold"
              >
                Browse files
              </Button>

              {selectedFile && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-[#CCDFFF] w-full">
                  <p className="text-sm font-medium text-[#63CDFA] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#979797]">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-3 border-[#63CDFA] text-black hover:bg-gray-50 font-ibm-plex font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3 bg-[#63CDFA] hover:bg-[#4BA8E8] text-white font-ibm-plex font-semibold"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
