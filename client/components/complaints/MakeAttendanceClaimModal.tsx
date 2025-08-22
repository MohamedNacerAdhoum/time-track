import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/Calendar";
import { useToast } from "@/hooks/useToast";

interface FormData {
  datePicker?: Date;
  from?: string;
  hours?: string;
  missingType?: string;
  notes?: string;
}

interface MakeAttendanceClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

const MISSING_TYPE_OPTIONS = [
  "Clock In",
  "Clock Out",
  "Break Start",
  "Break End",
];

export function MakeAttendanceClaimModal({
  isOpen,
  onClose,
  onSubmit,
}: MakeAttendanceClaimModalProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMissingTypeDropdown, setShowMissingTypeDropdown] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const requiredFields = [
      "datePicker",
      "from",
      "hours",
      "missingType",
      "notes",
    ];
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
      await onSubmit?.(formData);

      // Reset form
      resetForm();
      onClose();

      toast({
        title: "Attendance Claim Submitted",
        description: "Your attendance claim has been submitted successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submit Failed",
        description:
          "There was an error submitting your attendance claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setShowMissingTypeDropdown(false);
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
            Make attendance claim
          </h2>
        </div>

        {/* Form Content - Based on Permission Tab */}
        <div className="space-y-4 sm:space-y-6">
          {/* Date, From, Hours Fields */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 space-y-2">
              <label className="block text-base font-semibold text-black font-poppins">
                Date picker
              </label>
              <div className="relative">
                <div
                  ref={datePickerRef}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="h-12 w-full px-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-base text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer flex items-center font-poppins"
                  style={{
                    fontFamily:
                      "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {formData.datePicker
                    ? formData.datePicker.toLocaleDateString()
                    : "12/08/2022"}
                </div>
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                <Calendar
                  value={formData.datePicker}
                  onChange={(date) => updateFormData({ datePicker: date })}
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  fieldRef={datePickerRef}
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-base font-semibold text-black font-poppins">
                From
              </label>
              <Input
                value={formData.from || ""}
                onChange={(e) => updateFormData({ from: e.target.value })}
                className="h-12 bg-[#F2FBFF] border-[#CCDFFF] border rounded-lg text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                placeholder="Enter from time..."
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-base font-semibold text-black font-poppins">
                Hours
              </label>
              <Input
                value={formData.hours || ""}
                onChange={(e) => updateFormData({ hours: e.target.value })}
                className="h-12 bg-[#F2FBFF] border-[#CCDFFF] border rounded-lg text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                placeholder="Enter hours..."
              />
            </div>
          </div>

          {/* Missing Type Dropdown - Full Width */}
          <div className="space-y-2 relative">
            <label className="block text-base font-semibold text-black font-poppins">
              Missing Type
            </label>
            <div
              onClick={() =>
                setShowMissingTypeDropdown(!showMissingTypeDropdown)
              }
              className="flex items-center justify-between px-4 py-3 bg-[#F2FBFF] border border-[#CCDFFF] rounded-lg cursor-pointer hover:bg-[#E1F3FF] transition-colors"
            >
              <span className="text-base text-[#7F7F7F] font-ibm-plex">
                {formData.missingType || "Select missing type"}
              </span>
              <ChevronDown className="w-6 h-6 text-[#06B2FB]" />
            </div>
            {showMissingTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CCDFFF] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {MISSING_TYPE_OPTIONS.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      updateFormData({ missingType: type });
                      setShowMissingTypeDropdown(false);
                    }}
                    className="px-4 py-3 text-base text-[#00003C] font-ibm-plex hover:bg-[#F2FBFF] cursor-pointer transition-colors"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Field - Full Width */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-black font-poppins">
              Notes
            </label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              className="min-h-[220px] bg-[#F2FBFF] border-[#CCDFFF] border-2 rounded-lg resize-none p-4 text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
              placeholder="Enter notes..."
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
