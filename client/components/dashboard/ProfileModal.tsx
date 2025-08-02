import { useState } from "react";
import { X, Eye, EyeOff, Calendar, ChevronDown } from "lucide-react";

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

  if (!isOpen) return null;

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[15px] w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-[24px] font-semibold text-black leading-4"
              style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
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

          {/* Tabs */}
          <div className="flex justify-center gap-[8px] mb-6 p-[8px] bg-white">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-[#63CDFA] text-white"
                  : "bg-[#F2FBFF] text-[#77838F]"
              }`}
              style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
            >
              My details
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${
                activeTab === "edit"
                  ? "bg-[#63CDFA] text-white"
                  : "bg-[#F2FBFF] text-[#77838F]"
              }`}
              style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
            >
              Edit profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-[8px] rounded-[8px] text-lg transition-colors ${
                activeTab === "password"
                  ? "bg-[#63CDFA] text-white"
                  : "bg-[#F2FBFF] text-[#77838F]"
              }`}
              style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
            >
              Password
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center">
                {/* Profile Picture - Centered */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-[160px] h-[160px]">
                    <div className="w-full h-full rounded-full border-[3px] border-[#4DA64D] p-[3px]">
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center border-[2px] border-white"
                        style={{
                          backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800')"
                        }}
                      />
                    </div>
                    {/* Edit Icon */}
                    <div className="absolute bottom-1 right-1 w-[36px] h-[36px] bg-[#F4F4F4] rounded-full border-[1px] border-[#63CDFA] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5026 24.3987C0.564851 25.3362 0.0378808 26.6077 0.0375977 27.9337L0.0375977 30.5H2.60385C3.92982 30.4997 5.20138 29.9727 6.13885 29.035L22.8176 12.3562L18.1813 7.71997L1.5026 24.3987Z" fill="#63CDFA"/>
                        <path d="M28.9687 1.56883C28.6643 1.26413 28.3029 1.0224 27.905 0.857478C27.5071 0.692554 27.0807 0.607666 26.65 0.607666C26.2193 0.607666 25.7928 0.692554 25.3949 0.857478C24.9971 1.0224 24.6356 1.26413 24.3312 1.56883L19.9487 5.95258L24.585 10.5888L28.9687 6.20633C29.2734 5.90194 29.5152 5.54048 29.6801 5.14262C29.845 4.74475 29.9299 4.31828 29.9299 3.88758C29.9299 3.45689 29.845 3.03041 29.6801 2.63255C29.5152 2.23468 29.2734 1.87322 28.9687 1.56883Z" fill="#63CDFA"/>
                      </svg>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center space-y-3">
                    <h2
                      className="text-[24px] font-medium text-black leading-5"
                      style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                    >
                      User xxxxx
                    </h2>
                    <p
                      className="text-[16px] font-medium text-[#71839B] leading-4"
                      style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                    >
                      Role xxxx
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="max-w-[400px] mx-auto space-y-3 px-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-semibold text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Email
                  </span>
                  <span
                    className="text-[16px] font-normal text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    yyy@gmail.com
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-semibold text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    AGE
                  </span>
                  <span
                    className="text-[16px] font-normal text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    26
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-semibold text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    EXPERIENCE
                  </span>
                  <span
                    className="text-[16px] font-normal text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    4 Years
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-semibold text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    LOCATION
                  </span>
                  <span
                    className="text-[16px] font-normal text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Ariana,Tunisia
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[16px] font-semibold text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    JOINED
                  </span>
                  <span
                    className="text-[16px] font-normal text-black"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    08/08/2023
                  </span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="max-w-[400px] mx-auto px-4">
                <button
                  onClick={() => setActiveTab("edit")}
                  className="w-full bg-[#63CDFA] hover:bg-[#5ab8e8] text-white py-[12px] px-4 rounded-[8px] shadow-[-4px_4px_12px_rgba(0,0,0,0.25)] transition-colors flex items-center justify-center gap-[8px]"
                >
                  <svg width="20" height="20" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.965 23.899C1.02725 24.8364 0.500283 26.108 0.5 27.434L0.5 30.0002H3.06625C4.39222 29.9999 5.66379 29.473 6.60125 28.5352L23.28 11.8565L18.6438 7.22021L1.965 23.899Z" fill="white"/>
                    <path d="M29.4314 1.06883C29.127 0.764126 28.7655 0.522401 28.3677 0.357478C27.9698 0.192554 27.5433 0.107666 27.1126 0.107666C26.6819 0.107666 26.2555 0.192554 25.8576 0.357478C25.4597 0.522401 25.0983 0.764126 24.7939 1.06883L20.4114 5.45258L25.0476 10.0888L29.4314 5.70633C29.7361 5.40194 29.9778 5.04048 30.1427 4.64262C30.3077 4.24475 30.3925 3.81828 30.3925 3.38758C30.3925 2.95689 30.3077 2.53041 30.1427 2.13255C29.9778 1.73468 29.7361 1.37322 29.4314 1.06883Z" fill="white"/>
                  </svg>
                  <span
                    className="text-[16px] font-semibold"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Name */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue="xxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="yyyy@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    defaultValue="35"
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Role
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F] appearance-none pr-8">
                      <option>Please select an option</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Employee</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB] pointer-events-none" />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="yyyyyyyyy"
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Experience
                  </label>
                  <input
                    type="number"
                    defaultValue="4"
                    className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#5F5F5F]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                </div>

                {/* Date picker - full width */}
                <div className="md:col-span-2 space-y-1">
                  <label
                    className="block text-[14px] font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  >
                    Date picker
                  </label>
                  <div className="relative max-w-sm">
                    <input
                      type="text"
                      defaultValue="12/08/2022"
                      className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#7F7F7F] pr-10"
                      style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB]" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-[10px] max-w-4xl mx-auto">
                <button
                  onClick={onClose}
                  className="px-6 py-[10px] border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  className="px-10 py-[10px] bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors"
                  style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-10 max-w-2xl mx-auto">
              {/* Current Password */}
              <div className="space-y-2">
                <label 
                  className="block text-[16px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    defaultValue="Pasword xxxx"
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[18px] text-[#5F5F5F] pr-12"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.current ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label 
                  className="block text-[16px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    defaultValue="Pasword xxxx"
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[18px] text-[#666] pr-12"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.new ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label 
                  className="block text-[16px] font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    defaultValue="Pasword xxxx"
                    className="w-full px-4 py-3 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[18px] text-[#5F5F5F] pr-12"
                    style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#71839B]"
                  >
                    {showPasswords.confirm ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-[10px]">
                <button
                  onClick={onClose}
                  className="px-6 py-[10px] border border-[#63CDFA] text-[#0A0A0A] rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  className="px-10 py-[10px] bg-[#63CDFA] text-white rounded-lg hover:bg-[#5ab8e8] transition-colors"
                  style={{ fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
