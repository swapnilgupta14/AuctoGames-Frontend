import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Upload, AlertCircle, Trash2, ImagePlus } from "lucide-react";
import Header from "../components/Header";
import heroImg from "../assets/image 1.png";
import { submitRegistrationRequest } from "../api/fetch";

const AuctionRegistration = () => {
  const { username, token, userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleRemoveImage = () => setImagePreview(null);

  const location = useLocation();
  const { auction = { id: null, title: "", registrationFee: 0 } } =
    location.state || {};
  const [errors, setErrors] = useState({
    teamName: "",
    mobileNumber: "",
    teamIcon: "",
  });

  const [teamName, setTeamName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      teamName: "",
      mobileNumber: "",
      teamIcon: "",
    };

    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required";
      isValid = false;
    } else if (teamName.length < 3) {
      newErrors.teamName = "Team name must be at least 3 characters";
      isValid = false;
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const newErrors = { ...errors };

    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      newErrors.teamIcon = "";
    } else {
      newErrors.teamIcon = "File size must be under 5MB.";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("auctionId", auction?.id);
      formData.append("userId", userId);
      formData.append("token", token);
      formData.append("mobileNumber", mobileNumber);
      formData.append("teamName", teamName);

      const result = await submitRegistrationRequest(formData, imagePreview);
      if (result) {
        console.log(result, "result");
        navigate(`/auction/${auction?.id}`);
      } else {
        alert(result?.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header heading="Auction Registration" />

      <div className="relative">
        <img
          src={heroImg || "https://via.placeholder.com/600x300"}
          alt={auction.title}
          className="w-full h-40 object-cover mb-4"
        />
        <div className="absolute top-10 left-10 text-white font-semibold text-[20px] w-[80%] text-center">
          Join us at - Afternoon Relax Auction
        </div>
      </div>

      <h1 className="text-lg font-semibold mx-6">{auction.title}</h1>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all
                                    ${
                                      errors.teamName
                                        ? "border-red-500"
                                        : "border-black"
                                    }`}
                placeholder="Team Name"
              />
              {errors.teamName && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle size={16} />
                  <span>{errors.teamName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all
                                    ${
                                      errors.mobileNumber
                                        ? "border-red-500"
                                        : "border-black"
                                    }`}
                placeholder="Mobile Number"
              />
              {errors.mobileNumber && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle size={16} />
                  <span>{errors.mobileNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-all
                                ${
                                  errors.teamIcon
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
              onClick={() => document.getElementById("team-icon-input").click()}
            >
              <input
                id="team-icon-input"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Auction Preview"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="cursor-pointer flex flex-col items-center justify-center w-full h-20 rounded-lg hover:border-blue-500 transition">
                  <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    Upload Team Icon
                    <br />
                    <span className="text-xs text-gray-400">
                      (Optional, Max 5MB)
                    </span>
                  </p>
                </div>
              )}
            </div>
            {/* {errors.teamIcon && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{errors.teamIcon}</span>
              </div>
            )} */}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between bg-zinc-200 p-4 rounded-xl shadow-sm">
              <div className="space-y-1">
                <span className="text-blue-500 text-sm font-medium">TOTAL</span>
                <p className="text-xl text-blue-700 font-semibold">
                  Rs. {auction.registrationFee}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionRegistration;
