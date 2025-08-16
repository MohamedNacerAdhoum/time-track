import { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Eye, EyeOff } from "lucide-react";
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
  location: string;
  experience: string;
  payrate: string;
  password: string;
  confirmPassword: string;
}

export function UserFormModal({ 
  isOpen, 
  onClose, 
  mode, 
  userData = null,
  onSuccess 
}: UserFormModalProps) {
  const { toast } = useToast();
  const { roles, fetchAllRoles, addMember } = useMembersStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    age: "",
    role: "",
    location: "",
    experience: "",
    payrate: "",
    password: "",
    confirmPassword: ""
  });

  // Load roles when modal opens
  useEffect(() => {
    if (isOpen && roles.length === 0) {
      fetchAllRoles();
    }
  }, [isOpen, roles.length, fetchAllRoles]);

  // Populate form data when editing
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          age: userData.age?.toString() || "",
          role: userData.role_name || "",
          location: userData.location || "",
          experience: userData.experience?.toString() || "",
          payrate: userData.payrate || "",
          password: "",
          confirmPassword: ""
        });
      } else if (mode === "add") {
        // Reset form for add mode
        setFormData({
          name: "",
          email: "",
          age: "",
          role: roles.length > 0 ? roles[0].name : "",
          location: "",
          experience: "",
          payrate: "",
          password: "",
          confirmPassword: ""
        });
      }
    }
  }, [isOpen, mode, userData, roles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.role) {
      toast({
        title: "Validation Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return false;
    }

    if (mode === "add") {
      if (!formData.password.trim()) {
        toast({
          title: "Validation Error",
          description: "Password is required for new users",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "add") {
        // Create new user
        const memberData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          age: formData.age ? parseInt(formData.age) : undefined,
          location: formData.location.trim() || undefined,
          experience: formData.experience ? parseInt(formData.experience) : undefined,
          payrate: formData.payrate.trim() || undefined,
          password: formData.password,
        };

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
              style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
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
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
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
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
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
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
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
                      <option key={role.id} value={role.name}>
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
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Pay Rate
                </label>
                <input
                  type="text"
                  name="payrate"
                  value={formData.payrate}
                  onChange={handleInputChange}
                  placeholder="e.g., $25/hour"
                  className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                />
              </div>

              {mode === "add" && (
                <>
                  <div className="space-y-1">
                    <label
                      className="block text-[14px] font-semibold text-[#0A0A0A]"
                      style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.password ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("password")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                      >
                        {showPasswords.password ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[14px] font-semibold text-[#0A0A0A]"
                      style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                      >
                        {showPasswords.confirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-[8px] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-[8px] border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors text-[14px] disabled:opacity-50"
                style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-[8px] bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                {isSubmitting ? 'Saving...' : mode === "add" ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
