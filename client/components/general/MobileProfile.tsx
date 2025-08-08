import { useState } from "react";
import { ChevronLeft, Calendar, Eye, EyeOff, Edit3 } from "lucide-react";

interface MobileProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "details" | "edit" | "password";

export function MobileProfile({ isOpen, onClose }: MobileProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!isOpen) return null;

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#63CDFA]"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg font-normal">Back</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4 flex flex-col sm:flex sm:flex-col">
        <div className="flex gap-3 mx-auto sm:gap-3 sm:mx-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "bg-[#63CDFA] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            My details
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "bg-[#63CDFA] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Edit profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
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
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* Profile Avatar and Info */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#4DA64D] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-[#63CDFA]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-black">
                  User xxxxx
                </h2>
                <p className="text-gray-500 mt-1">Role xxxx</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium text-black">Email</span>
                <span className="text-lg text-gray-700">yyy@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium text-black">AGE</span>
                <span className="text-lg text-gray-700">26</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium text-black">
                  EXPERIENCE
                </span>
                <span className="text-lg text-gray-700">4 Years</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium text-black">LOCATION</span>
                <span className="text-lg text-gray-700">Ariana,Tunisia</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium text-black">JOINED</span>
                <span className="text-lg text-gray-700">08/08/2023</span>
              </div>
            </div>

            {/* Edit Button */}
            <button className="w-full bg-[#63CDFA] text-white py-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2 mt-8">
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        )}

        {activeTab === "edit" && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Name
              </label>
              <input
                type="text"
                defaultValue="xxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="yyyy@gmail.com"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Age
              </label>
              <input
                type="number"
                defaultValue="35"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Role
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700 appearance-none pr-10">
                  <option>Software developer</option>
                  <option>Designer</option>
                  <option>Manager</option>
                </select>
                <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-[-90deg] w-5 h-5 text-[#63CDFA]" />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Location
              </label>
              <input
                type="text"
                defaultValue="YYYYYYYYY"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Experience
              </label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Date picker
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="12/08/2022"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700 pr-12"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#63CDFA]" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 py-3 border-2 border-[#63CDFA] text-[#63CDFA] rounded-lg text-lg font-medium">
                Cancel
              </button>
              <button className="flex-1 py-3 bg-[#63CDFA] text-white rounded-lg text-lg font-medium">
                Save
              </button>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  placeholder="Password xxxx"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.current ? (
                    <EyeOff className="w-6 h-6 text-gray-500" />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" />
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
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Password xxxx"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.new ? (
                    <EyeOff className="w-6 h-6 text-gray-500" />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="Password xxxx"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 text-lg text-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-6 h-6 text-gray-500" />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 py-3 border-2 border-[#63CDFA] text-[#63CDFA] rounded-lg text-lg font-medium">
                Cancel
              </button>
              <button className="flex-1 py-3 bg-[#63CDFA] text-white rounded-lg text-lg font-medium">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Home Indicator */}
      <div className="flex justify-center py-3">
        <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
      </div>
    </div>
  );
}
