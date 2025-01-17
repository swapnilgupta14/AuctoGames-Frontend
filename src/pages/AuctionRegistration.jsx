import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Upload, AlertCircle, Trash2, ImagePlus, X } from "lucide-react";
import Header from "../components/Header";
import heroImg from "../assets/image 1.png";
import {
  submitRegistrationRequest,
  validateAuctionRegistration,
} from "../api/fetch";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [registrationData, setRegistrationData] = useState(null);

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

  const validateUser = async (auctionId, userId) => {
    try {
      const res = await validateAuctionRegistration(Number(auctionId), userId);
      let status = "error";

      if (res?.status === "REGISTERED") {
        status = "success";
      } else if (res?.status === "ELIGIBLE") {
        status = "not_registered";
      } else if (res?.status === "INSUFFICIENT_BALANCE") {
        status = "insufficient_balance";
      } else if (res?.status === "COMPLETED") {
        status = "ENDED";
      } else {
        status = "ineligible";
      }
      return status;
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const [auctionStatus, setAuctionStatus] = useState(null);
  const openModal = (type, message, status) => {
    setModalType(type);
    setAuctionStatus(status);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const state = await validateUser(auction.id, userId);
    if (state === "success") {
      openModal("error", "You are already registered", "ERROR");
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("auctionId", auction?.id);
      formData.append("userId", userId);
      formData.append("token", token);
      formData.append("mobileNumber", mobileNumber);
      formData.append("teamName", teamName);

      const result = await submitRegistrationRequest(formData, imagePreview);
      if (result) {
        setRegistrationData(result);
        openModal(
          "success",
          "The team is Sucessfully Registered",
          result?.auctionStatus
        );
        // console.log(result, "od the registartion");
      } else {
        openModal("error", result?.message || "Failed to register", "ERROR");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      openModal("error", "An error occurred. Please try again.", "ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 relative">
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
                {isSubmitting ? "Processing..." : "Register Team"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[85%] relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              {modalType === "success" ? (
                <>
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto text-green-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Team Registration Successful!
                  </h2>
                  {auctionStatus === "LIVE" ? (
                    <p className="text-red-600 font-sm py-2 font-medium">
                      Auction is Live Now!
                    </p>
                  ) : (
                    auctionStatus === "SCHEDULED" && (
                      <p className="text-red-600 font-sm py-2 font-medium">
                        Auction is Scheduled! Join the Auction at the start
                        Time.
                      </p>
                    )
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Error!
                  </h2>
                </>
              )}
              <p className="text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={() => {
                  closeModal();
                  if (
                    modalType === "success" &&
                    auctionStatus === "SCHEDULED"
                  ) {
                    navigate(-2);
                  }
                  if (modalType === "success" && auctionStatus === "LIVE") {
                    navigate("/successregister", {
                      state: {
                        auction,
                        registrationData,
                      },
                    });
                  }
                }}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  modalType === "success"
                    ? "bg-blue-600 text-white text-sm hover:bg-blue-700"
                    : "bg-red-600 text-white text-sm hover:bg-red-700"
                }`}
              >
                {modalType === "success"
                  ? auctionStatus === "LIVE"
                    ? "Enter Auction"
                    : "Go Home"
                  : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionRegistration;
