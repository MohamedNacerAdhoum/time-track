import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Upload, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/Calendar";
import { useToast } from "@/hooks/useToast";

type DemandType = "standard" | "permission" | "leave";
type LeaveType = "multiple" | "single";

interface FormData {
  type: DemandType;
  // Standard fields
  subject?: string;
  body?: string;
  // Permission fields
  datePicker?: Date;
  from?: string;
  hours?: string;
  reason?: string;
  // Leave fields
  leaveType?: LeaveType;
  fromDate?: Date;
  toDate?: Date;
  singleDate?: Date;
  timePeriod?: string;
  // Common
  file?: File;
}

interface MakeDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

const TIME_PERIODS = [
  "Full Day",
  "Half Day - Morning",
  "Half Day - Afternoon",
  "1 Hour",
  "2 Hours",
  "3 Hours",
  "4 Hours",
];

export function MakeDemandModal({
  isOpen,
  onClose,
  onSubmit,
}: MakeDemandModalProps) {
  const [activeTab, setActiveTab] = useState<DemandType>("standard");
  const [formData, setFormData] = useState<FormData>({
    type: "standard",
    leaveType: "multiple",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const [isSingleDatePickerOpen, setIsSingleDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fromDatePickerRef = useRef<HTMLDivElement>(null);
  const toDatePickerRef = useRef<HTMLDivElement>(null);
  const singleDatePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const requiredFields = getRequiredFields();
    const missingFields = requiredFields.filter(
      (field) => !getFieldValue(field),
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
        type: activeTab,
        file: selectedFile || undefined,
      };

      await onSubmit?.(submitData);

      // Reset form
      resetForm();
      onClose();

      toast({
        title: "Demand Submitted",
        description: "Your demand has been submitted successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submit Failed",
        description:
          "There was an error submitting your demand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequiredFields = (): string[] => {
    switch (activeTab) {
      case "standard":
        return ["subject", "body"];
      case "permission":
        return ["datePicker", "from", "hours", "reason"];
      case "leave":
        if (formData.leaveType === "multiple") {
          return ["fromDate", "toDate", "reason"];
        } else {
          return ["singleDate", "timePeriod", "reason"];
        }
      default:
        return [];
    }
  };

  const getFieldValue = (field: string): any => {
    return formData[field as keyof FormData];
  };

  const resetForm = () => {
    setFormData({ type: "standard", leaveType: "multiple" });
    setSelectedFile(null);
    setActiveTab("standard");
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
            Make demand
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex p-2.5 bg-white rounded-xl gap-2.5">
            {[
              { key: "standard", label: "Standard" },
              { key: "permission", label: "Permission" },
              { key: "leave", label: "Leave" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as DemandType)}
                className={`px-5 py-2.5 rounded-xl text-xl font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#63CDFA] text-white"
                    : "bg-[#F2FBFF] text-[#77838F] hover:bg-[#E1F3FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Standard Tab */}
          {activeTab === "standard" && (
            <>
              <div className="space-y-2">
                <label className="block text-base font-semibold text-black font-poppins">
                  Subject
                </label>
                <Input
                  value={formData.subject || ""}
                  onChange={(e) => updateFormData({ subject: e.target.value })}
                  className="h-12 bg-[#F2FBFF] border-[#CCDFFF] border rounded-lg text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                  placeholder="Enter subject..."
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
            </>
          )}

          {/* Permission Tab */}
          {activeTab === "permission" && (
            <>
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

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="flex-1 space-y-2">
                  <label className="block text-base font-semibold text-black font-poppins">
                    Reason
                  </label>
                  <Textarea
                    value={formData.reason || ""}
                    onChange={(e) => updateFormData({ reason: e.target.value })}
                    className="min-h-[220px] bg-[#F2FBFF] border-[#CCDFFF] border-2 rounded-lg resize-none p-4 text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                    placeholder="Enter reason..."
                  />
                </div>

                {/* File Upload Component - Same as Standard */}
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
            </>
          )}

          {/* Leave Tab */}
          {activeTab === "leave" && (
            <>
              {/* Multiple days / Single day radio buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div
                  className={`flex items-center gap-4 px-6 py-6 rounded-lg border cursor-pointer transition-colors ${
                    formData.leaveType === "multiple"
                      ? "border-[#CCDFFF] bg-white"
                      : "border-[#CCDFFF] bg-white"
                  }`}
                  onClick={() => updateFormData({ leaveType: "multiple" })}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-[#CCDFFF] flex items-center justify-center ${
                      formData.leaveType === "multiple"
                        ? "bg-white"
                        : "bg-white"
                    }`}
                  >
                    {formData.leaveType === "multiple" && (
                      <div className="w-3 h-3 rounded-full bg-[#63CDFA]" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-[#63CDFA] font-poppins">
                    Multiple days
                  </span>
                </div>

                <div
                  className={`flex items-center gap-4 px-6 py-6 rounded-lg border cursor-pointer transition-colors ${
                    formData.leaveType === "single"
                      ? "border-[#CCDFFF] bg-white"
                      : "border-[#CCDFFF] bg-white"
                  }`}
                  onClick={() => updateFormData({ leaveType: "single" })}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-[#CCDFFF] flex items-center justify-center ${
                      formData.leaveType === "single" ? "bg-white" : "bg-white"
                    }`}
                  >
                    {formData.leaveType === "single" && (
                      <div className="w-3 h-3 rounded-full bg-[#63CDFA]" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-[#00003C] font-poppins">
                    Single day
                  </span>
                </div>
              </div>

              {/* Date fields - conditional based on leave type */}
              {formData.leaveType === "multiple" ? (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-base font-semibold text-black font-poppins">
                      From
                    </label>
                    <div className="relative">
                      <div
                        ref={fromDatePickerRef}
                        onClick={() => setIsFromDatePickerOpen(!isFromDatePickerOpen)}
                        className="h-12 w-full px-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-base text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer flex items-center font-poppins"
                        style={{
                          fontFamily:
                            "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        {formData.fromDate
                          ? formData.fromDate.toLocaleDateString()
                          : "12/08/2022"}
                      </div>
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                      <Calendar
                        value={formData.fromDate}
                        onChange={(date) => updateFormData({ fromDate: date })}
                        isOpen={isFromDatePickerOpen}
                        onClose={() => setIsFromDatePickerOpen(false)}
                        fieldRef={fromDatePickerRef}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-base font-semibold text-black font-poppins">
                      To
                    </label>
                    <div className="relative">
                      <div
                        ref={toDatePickerRef}
                        onClick={() => setIsToDatePickerOpen(!isToDatePickerOpen)}
                        className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer"
                        style={{
                          fontFamily:
                            "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        {formData.toDate
                          ? formData.toDate.toLocaleDateString()
                          : "12/08/2022"}
                      </div>
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                      <Calendar
                        value={formData.toDate}
                        onChange={(date) => updateFormData({ toDate: date })}
                        isOpen={isToDatePickerOpen}
                        onClose={() => setIsToDatePickerOpen(false)}
                        fieldRef={toDatePickerRef}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-base font-semibold text-black font-poppins">
                      Date picker
                    </label>
                    <div className="relative">
                      <div
                        ref={singleDatePickerRef}
                        onClick={() => setIsSingleDatePickerOpen(!isSingleDatePickerOpen)}
                        className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer"
                        style={{
                          fontFamily:
                            "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        {formData.singleDate
                          ? formData.singleDate.toLocaleDateString()
                          : "12/08/2022"}
                      </div>
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                      <Calendar
                        value={formData.singleDate}
                        onChange={(date) => updateFormData({ singleDate: date })}
                        isOpen={isSingleDatePickerOpen}
                        onClose={() => setIsSingleDatePickerOpen(false)}
                        fieldRef={singleDatePickerRef}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 relative">
                    <label className="block text-base font-semibold text-black font-poppins">
                      Time period
                    </label>
                    <div
                      onClick={() =>
                        setShowTimePeriodDropdown(!showTimePeriodDropdown)
                      }
                      className="flex items-center justify-between px-4 py-3 bg-[#F2FBFF] border border-[#CCDFFF] rounded-lg cursor-pointer hover:bg-[#E1F3FF] transition-colors"
                    >
                      <span className="text-base text-[#7F7F7F] font-ibm-plex">
                        {formData.timePeriod || "Select a time period"}
                      </span>
                      <ChevronDown className="w-6 h-6 text-[#06B2FB]" />
                    </div>
                    {showTimePeriodDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CCDFFF] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {TIME_PERIODS.map((period) => (
                          <div
                            key={period}
                            onClick={() => {
                              updateFormData({ timePeriod: period });
                              setShowTimePeriodDropdown(false);
                            }}
                            className="px-4 py-3 text-base text-[#00003C] font-ibm-plex hover:bg-[#F2FBFF] cursor-pointer transition-colors"
                          >
                            {period}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="flex-1 space-y-2">
                  <label className="block text-base font-semibold text-black font-poppins">
                    Reason
                  </label>
                  <Textarea
                    value={formData.reason || ""}
                    onChange={(e) => updateFormData({ reason: e.target.value })}
                    className="min-h-[220px] bg-[#F2FBFF] border-[#CCDFFF] border-2 rounded-lg resize-none p-4 text-base font-poppins focus:border-[#63CDFA] focus:ring-[#63CDFA]"
                    placeholder="Enter reason..."
                  />
                </div>

                {/* File Upload Component - Same as other tabs */}
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
            </>
          )}
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
