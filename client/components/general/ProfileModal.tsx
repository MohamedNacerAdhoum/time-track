import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, ChevronDown, Pencil } from "lucide-react";
import { CalendarField } from "../ui/calendar-field";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/contexts/UserContext";
import { useMembersStore } from "@/contexts/MembersContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "profile" | "edit" | "password";

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { toast } = useToast();
  const { changePassword } = useAuthStore();
  const hasFetched = useRef(false);

  // Use MembersContext for user data and roles
  const { 
    currentUser, 
    loading, 
    error, 
    fetchCurrentUser, 
    roles, 
    fetchAllRoles 
  } = useMembersStore();
  const { user: authUser } = useAuthStore();

  const getStatusColor = (status: string | undefined | null) => {
    const raw = (status || '').toString().trim().toLowerCase();
    // Normalize common backend variants
    if (!raw) return 'border-[#EF4444]';
    if (raw.includes('break')) return 'border-[#F59E0B]'; // 'IN BREAK', 'break'
    if (raw === 'in') return 'border-[#0FBA83]';
    if (raw.startsWith('in')) return 'border-[#0FBA83]'; // handle any other 'in*' variants
    return 'border-[#EF4444]'; // default to out
  };

  // Fetch user data and roles when modal opens
  useEffect(() => {
    if (!isOpen || !authUser?.token || hasFetched.current) return;

    const loadUserData = async () => {
      try {
        const [userData, rolesData] = await Promise.all([
          fetchCurrentUser(),
          fetchAllRoles()
        ]);
        
        // Set the selected role to the user's current role
        if (userData?.role_name) {
          setSelectedRole(userData.role_name);
        }
        
        hasFetched.current = true;
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    };

    loadUserData();

    // Reset hasFetched when modal closes
    return () => {
      if (!isOpen) {
        hasFetched.current = false;
      }
    };
  }, [isOpen, isInitialLoad, fetchCurrentUser, authUser?.token, fetchAllRoles]);

  if (!isOpen) return null;

  // Use currentUser from MembersContext
  const user = currentUser;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password) {
      setPasswordError('Current password is required');
      return false;
    }

    if (!new_password) {
      setPasswordError('New password is required');
      return false;
    }

    if (new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }

    if (new_password !== confirm_password) {
      setPasswordError('New passwords do not match');
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string) => {
    // Only require minimum 6 characters
    return password.length >= 6;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      const errorMsg = "All fields are required";
      setPasswordError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    // Check if new password meets minimum length requirement
    if (!validatePassword(passwordData.new_password)) {
      const errorMsg = "Password must be at least 6 characters long";
      setPasswordError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      const errorMsg = "New passwords do not match";
      setPasswordError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    // Ensure new password is different from current
    if (passwordData.current_password === passwordData.new_password) {
      const errorMsg = "New password must be different from current password";
      setPasswordError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setPasswordError(null);

    try {
      // Use the changePassword function from auth store
      await changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );

      // Reset form
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      // Switch back to profile tab
      setActiveTab("profile");
    } catch (error) {
      // Error is already handled by the changePassword function
      console.error("Error in handlePasswordSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[15px] w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-[24px] font-semibold text-black leading-4"
              style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
            >
              Profile
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-[8px] mb-6 p-[8px] bg-white">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${activeTab === "profile" ? "bg-[#63CDFA] text-white" : "bg-[#F2FBFF] text-[#77838F]"}`}
              style={{ fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif" }}
            >
              My details
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${activeTab === "edit" ? "bg-[#63CDFA] text-white" : "bg-[#F2FBFF] text-[#77838F]"}`}
              style={{ fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif" }}
            >
              Edit profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${activeTab === "password" ? "bg-[#63CDFA] text-white" : "bg-[#F2FBFF] text-[#77838F]"}`}
              style={{ fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif" }}
            >
              Password
            </button>
          </div>
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-[160px] h-[160px]">
                    <div className={`w-full h-full rounded-full p-[3px] border-[3px] ${getStatusColor(user?.status)}`}>
                      {user?.imageUrl ? (
                        <div
                          className="w-full h-full rounded-full bg-cover bg-center border-[2px] border-white"
                          style={{
                            backgroundImage: `url(${user.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-medium text-gray-500">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-[36px] h-[36px] bg-[#F4F4F4] rounded-full border-[1px] border-[#63CDFA] flex items-center justify-center">
                      <Pencil className="w-[23px] h-[23px] text-[#63CDFA]" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h2
                      className="text-[24px] font-medium text-black leading-5"
                      style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                    >
                      {user?.name ?? 'User xxxxx'}
                    </h2>
                    <p
                      className="text-[16px] font-medium text-[#71839B] leading-4"
                      style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                    >
                      {user?.role_name ?? 'Role xxxx'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="max-w-[400px] mx-auto space-y-3 px-4">
                {loading ? (
                  <div className="text-center py-4">Loading user data...</div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Email
                      </span>
                      <span className="text-[16px] font-normal text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        {user?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Role
                      </span>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                        {user?.role_name || user?.role || 'Role not specified'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Experience
                      </span>
                      <span className="text-[16px] font-normal text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        {user.experience != null ? `${user.experience} years` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Location
                      </span>
                      <span className="text-[16px] font-normal text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        {user.location ?? 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Joined
                      </span>
                      <span className="text-[16px] font-normal text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        {user.joined ? formatDate(user.joined) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        Balance
                      </span>
                      <span className="text-[16px] font-normal text-black" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                        {user.payrate != null ? `${user.payrate}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500 text-center py-4">No user data available</div>
                )}
              </div>
              <div className="max-w-[400px] mx-auto px-4">
                <button
                  onClick={() => setActiveTab("edit")}
                  className="w-full bg-[#63CDFA] hover:bg-[#5ab8e8] text-white py-[12px] px-4 rounded-[8px] shadow-[-4px_4px_12px_rgba(0,0,0,0.25)] transition-colors flex items-center justify-center gap-[8px]"
                >
                  <Pencil className="w-[23px] h-[23px] text-white" />
                  <span
                    className="text-[16px] font-semibold"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>
          )}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name ?? "xxxxxxxxxxxxxxxxxxx"}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email ?? "yyyy@gmail.com"}
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
                    defaultValue={user?.age ?? "35"}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Role
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    >
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
                    defaultValue={user?.location ?? "yyyyyyyyy"}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Experience
                  </label>
                  <input
                    type="number"
                    defaultValue={user?.experience ?? "4"}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    Date picker
                  </label>
                  <CalendarField
                    value={user?.joined ? new Date(user.joined) : undefined}
                    onChange={(date) => {
                      // Handle date change - you can add your update logic here
                      console.log('Date selected:', date);
                    }}
                    placeholder={user?.joined ? formatDate(user.joined) : "12/08/2022"}
                    variant="profile"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-[8px]">
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
                  {isSubmitting ? 'Changing...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.current ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#666] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.new ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  className="block text-[14px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.confirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-[8px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-[8px] border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors text-[14px]"
                  style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-[8px] bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] disabled:opacity-50 transition-colors text-[14px]"
                  style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
