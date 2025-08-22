import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";

interface FormData {
  problem?: string;
  body?: string;
  file?: File;
}

interface MakeComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

export function MakeComplaintModal({
  isOpen,
  onClose,
  onSubmit,
}: MakeComplaintModalProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const requiredFields = ["problem", "body"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData],
    );

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = {
        ...formData,
        file: selectedFile || undefined,
      };

      await onSubmit?.(submitData);

      // Reset form
      resetForm();
      onClose();

      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submit Failed",
        description:
          "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setSelectedFile(null);
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
    resetForm();
    onClose();
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div
        role="dialog"
        className="relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black font-poppins">
            Make complaint
          </h2>
        </div>

        {/* Form Content - Based on Standard Tab */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-base font-semibold text-black font-poppins">
              Problem
            </label>
            <Input
              value={formData.problem || ""}
              onChange={(e) => updateFormData({ problem: e.target.value })}
              className="h-12 bg-[#F2FBFF] border-[#CCDFFF] border rounded-lg text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
              placeholder="Enter problem..."
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-2">
              <label className="block text-base font-semibold text-black font-poppins">
                Body
              </label>
              <Textarea
                value={formData.body || ""}
                onChange={(e) => updateFormData({ body: e.target.value })}
                className="min-h-[220px] bg-[#F2FBFF] border-[#CCDFFF] border-2 rounded-lg resize-none p-4 text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                placeholder="Enter your message..."
              />
            </div>

            {/* File Upload Component */}
            <div className="w-full lg:w-[300px] space-y-2">
              <label className="block text-base font-semibold text-black font-poppins">
                File
              </label>
              <div
                className={`flex flex-col items-center justify-center gap-4 p-4 h-[220px] border-2 border-dashed rounded-xl transition-colors ${
                  isDragOver
                    ? "border-[#63CDFA] bg-[#E1F3FF]"
                    : "border-[#63CDFA] bg-[#F2FBFF]"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-8 h-8 text-[#63CDFA]" />

                <p className="text-center text-base font-semibold text-[#979797] font-ibm-plex">
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
            </div>
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

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
