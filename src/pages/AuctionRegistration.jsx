import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Upload, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import heroImg from "../assets/image 1.png";

const AuctionRegistration = () => {
  const { username, token, userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { auction } = location.state;
  const [errors, setErrors] = useState({
    teamName: "",
    mobileNumber: "",
    teamIcon: "",
  });

  const [teamName, setTeamName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [teamIcon, setTeamIcon] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          teamIcon: "File size should be less than 5MB",
        }));
        return;
      }
      setTeamIcon(file);
      setErrors((prev) => ({
        ...prev,
        teamIcon: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        auctionId: Number(auction.id),
        teamName: teamName,
        mobileNumber: mobileNumber,
        registrationFee: auction.registrationFee,
        token: token,
        ownerId: Number(userId),
      };

      const response = await fetch(
        "https://server.rishabh17704.workers.dev/api/auctions/register-participant",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const finalRes = await response.json();
      navigate("/successregister", { state: { auction } });
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
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                <Upload size={24} />
                <span className="text-lg">
                  {teamIcon ? teamIcon.name : "Upload Team Icon"}
                </span>
              </div>
            </div>
            {/* {errors.teamIcon && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{errors.teamIcon}</span>
              </div>
            )} */}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
              <div className="space-y-1">
                <span className="text-gray-400 text-sm font-medium">TOTAL</span>
                <p className="text-xl font-semibold">
                  Rs. {auction.registrationFee}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Continue to pay"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionRegistration;
