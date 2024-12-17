import React, { useState } from "react";
import {
  User,
  LogOut,
  History,
  RefreshCw,
  CreditCard,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userIcon from "../assets/user (2).png";
import { uploadProfilePhoto } from "../api/fetch";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
console.log(user)
  const username = localStorage.getItem("email") || "User";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imagePreview) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    try {
      await uploadProfilePhoto(userId, imagePreview);
      alert("Profile photo uploaded successfully!");
    } catch (error) {
      alert("Failed to upload profile photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("shopCoToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("SessionExpiryTime");
    navigate("/");
  };

  const ProfileActionButton = ({
    icon: Icon,
    text,
    onClick,
    className = "",
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-start w-full p-3 rounded-lg hover:bg-gray-100 transition-colors group ${className}`}
    >
      <Icon
        className="mr-3 text-gray-500 group-hover:text-gray-700"
        size={20}
      />
      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
        {text}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header heading="My Profile" />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <img
                src={user?.imageUrl || imagePreview || userIcon}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1">
                <User className="text-gray-600" size={16} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-4 px-6 py-2 rounded-md flex items-center ${
                loading
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loading ? "Uploading..." : "Update Profile Photo"}
            </button>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Account Actions
          </h3>
          <div className="space-y-2">
            <ProfileActionButton
              icon={History}
              text="Bid History"
              onClick={() => {
                /* Navigate to bid history */
              }}
            />
            <ProfileActionButton
              icon={CreditCard}
              text="Payment Methods"
              onClick={() => {
                /* Navigate to payment methods */
              }}
            />
            <ProfileActionButton
              icon={Settings}
              text="Account Settings"
              onClick={() => {
                /* Navigate to account settings */
              }}
            />
            <ProfileActionButton
              icon={LogOut}
              text="Logout"
              onClick={handleLogout}
              className="hover:bg-red-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
