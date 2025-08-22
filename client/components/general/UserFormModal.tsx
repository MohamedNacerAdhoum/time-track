import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { useToast } from "@/hooks/useToast";
import { useMembersStore } from "@/contexts/MembersContext";
import { MemberData } from "@/contexts/MembersContext";
import { createPortal } from "react-dom";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  userData?: MemberData | null;
  onSuccess?: () => void;
}

interface UserFormData {
  name: string;
  email: string;
  age: string;
  role: string;
  hours: string;
  location: string;
  experience: string;
  payrate: string;
  joined: Date | null;
}

export function UserFormModal({
  isOpen,
  onClose,
  mode,
  userData = null,
  onSuccess,
}: UserFormModalProps) {
  const { toast } = useToast();
  const { roles, fetchAllRoles, addMember } = useMembersStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateFieldRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    age: "",
    role: "",
    hours: "8", // Default to 8 hours
    location: "",
    experience: "",
    payrate: "",
    joined: new Date(), // Default to today's date
  });

  // Load roles when modal opens
  useEffect(() => {
    if (isOpen && roles.length === 0) {
      fetchAllRoles();
    }
  }, [isOpen, roles.length, fetchAllRoles]);

  // Initialize form with user data if in edit mode
  useEffect(() => {
    if (mode === "edit" && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age?.toString() || "",
        role: userData.role || "",
        location: userData.location || "",
        experience: userData.experience?.toString() || "",
        payrate: userData.payrate || "",
        hours: userData.hours?.toString() || "8",
        joined: userData.joined ? new Date(userData.joined) : new Date(),
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        joined: new Date(),
      }));
    }
  }, [isOpen, mode, userData, roles]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      joined: date,
    }));
  };

  const validateForm = (): boolean => {
    const { name, email, role } = formData;

    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!role) {
      toast({
        title: "Validation Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "add") {
        // Find the selected role to get both ID and name
        const selectedRole = roles.find((role) => role.id === formData.role);
        if (!selectedRole) {
          throw new Error("Please select a valid role");
        }

        // Create new user with structure expected by backend
        const memberData = {
          // User data
          email: formData.email.trim(),
          name: formData.name.trim(),

          // Employee data
          role: formData.role, // Role ID
          role_name: selectedRole.name, // Role name
          hours: parseInt(formData.hours) || 8,
          joined: formData.joined
            ? formData.joined.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          ...(formData.age && { age: parseInt(formData.age) }),
          ...(formData.location && { location: formData.location.trim() }),
          ...(formData.experience && {
            experience: parseInt(formData.experience),
          }),
          ...(formData.payrate && { payrate: formData.payrate.trim() }),
        };

        console.log("Sending member data:", memberData);

        await addMember(memberData);

        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else {
        // Update existing user
        // TODO: Implement user update API call
        console.log("Update user:", formData);

        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error is already handled by the API calls and toast is shown
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[15px] w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-[24px] font-semibold text-black leading-4"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {mode === "add" ? "Add New User" : "Edit User"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Age (Optional)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Role *
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Experience (Optional)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Balance
                </label>
                <input
                  type="text"
                  name="payrate"
                  value={formData.payrate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Hours
                </label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  min="8"
                  max="12"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  Joined At (Optional)
                </label>
                <div className="relative">
                  <div
                    ref={dateFieldRef}
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer"
                    style={{
                      fontFamily:
                        "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {formData.joined
                      ? formatDate(formData.joined)
                      : "12/08/2022"}
                  </div>
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                  <Calendar
                    value={formData.joined}
                    onChange={handleDateChange}
                    isOpen={isDatePickerOpen}
                    onClose={() => setIsDatePickerOpen(false)}
                    fieldRef={dateFieldRef}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-[8px] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-[8px] border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors text-[14px] disabled:opacity-50"
                style={{
                  fontFamily:
                    "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-[8px] bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily:
                    "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "add"
                    ? "Create User"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
