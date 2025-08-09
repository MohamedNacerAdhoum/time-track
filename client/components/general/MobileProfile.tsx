import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Calendar, Eye, EyeOff, Edit3, X, ChevronDown, Pencil } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/contexts/UserContext";
import { useMembersStore } from "@/contexts/MembersContext";

interface MobileProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "profile" | "edit" | "password";

export function MobileProfile({ isOpen, onClose }: MobileProfileProps) {
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
    if (!raw) return 'border-[#EF4444]';
    if (raw.includes('break')) return 'border-[#F59E0B]';
    if (raw === 'in') return 'border-[#0FBA83]';
    if (raw.startsWith('in')) return 'border-[#0FBA83]';
    return 'border-[#EF4444]';
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

    return () => {
      if (!isOpen) {
        hasFetched.current = false;
      }
    };
  }, [isOpen, isInitialLoad, fetchCurrentUser, authUser?.token, fetchAllRoles]);

  if (!isOpen) return null;

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
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
    return password.length >= 6;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      setActiveTab("profile");
      
      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "default"
      });
      
    } catch (error) {
      console.error("Error in handlePasswordSubmit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#63CDFA]"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg font-normal">Back</span>
        </button>
        <h1 className="text-xl font-semibold text-black">Profile</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4">
        <div className="flex gap-5 overflow-x-auto justify-center pb-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "profile"
                ? "bg-[#63CDFA] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            My details
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "edit"
                ? "bg-[#63CDFA] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Edit profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "password"
                ? "bg-[#63CDFA] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Password
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {activeTab === "profile" && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-8">Loading user data...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : user ? (
              <>
                {/* Profile Avatar and Info */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-4 ${getStatusColor(user.status)} overflow-hidden`}>
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-medium text-gray-500">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div 
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full border-2 border-[#63CDFA] flex items-center justify-center cursor-pointer"
                      onClick={() => setActiveTab("edit")}
                    >
                      <Pencil className="w-4 h-4 text-[#63CDFA]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-black">
                      {user?.name || 'User xxxxx'}
                    </h2>
                    <p className="text-gray-500 mt-1">{user?.role_name || 'Role xxxx'}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Email</span>
                    <span className="text-lg text-gray-700">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Role</span>
                    <span className="text-lg text-gray-700">{user?.role_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Experience</span>
                    <span className="text-lg text-gray-700">
                      {user?.experience != null ? `${user.experience} years` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Location</span>
                    <span className="text-lg text-gray-700">{user?.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Joined</span>
                    <span className="text-lg text-gray-700">
                      {user?.joined ? formatDate(user.joined) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-black">Balance</span>
                    <span className="text-lg text-gray-700">
                      {user?.payrate != null ? `${user.payrate}` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button 
                  className="w-full bg-[#63CDFA] text-white py-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2 mt-8"
                  onClick={() => setActiveTab("edit")}
                >
                  <Pencil className="w-5 h-5" />
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="text-red-500 text-center py-8">No user data available</div>
            )}
          </div>
        )}

        {activeTab === "edit" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading user data...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : user ? (
              <>
                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    defaultValue={user?.age || ''}
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#63CDFA] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.location || ''}
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    defaultValue={user?.experience || ''}
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-black mb-2">
                    Join Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user?.joined ? formatDate(user.joined) : ''}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#63CDFA]" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors text-base font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-red-500 text-center py-8">No user data available</div>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordError && (
              <div className="text-red-500 text-sm mb-4">{passwordError}</div>
            )}
            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 pr-12 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 pr-12 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-lg text-gray-700 pr-12 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors text-base font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Home Indicator */}
      <div className="flex justify-center py-3">
        <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
      </div>
    </div>
  );
}
