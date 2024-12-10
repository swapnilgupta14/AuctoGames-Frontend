import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowUpLeftFromCircleIcon, RefreshCw, X } from "lucide-react";
import Header from "../components/Header";
import { validateAuctionRegistration, getWalletBalance } from "../api/fetch";

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [balance, setBalance] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);

  const userId = useSelector((state) => state.user.userId);
  const { id } = useParams();
  const location = useLocation();
  const { auction } = location.state;

  const fetchWalletData = async (userId) => {
    try {
      const balanceRes = await getWalletBalance(userId);
      setBalance(balanceRes.balance);
      return balanceRes.balance;
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
      return null;
    }
  };

  const validateUser = async (auctionId, userId) => {
    try {
      setIsValidating(true);

      const userBalance = await fetchWalletData(userId);

      const res = await validateAuctionRegistration(Number(auctionId), userId);

      console.log("Validation Response:", res);
      setRegistrationData(res);

      let status = "error";
      if (res?.status === "registered") {
        status = "success";
      } else if (res?.status === "not_registered") {
        if (userBalance >= auction.registrationFee) {
          status = "not_registered";
        } else {
          status = "insufficient_balance";
        }
      } else {
        status = "ineligible";
      }

      setValidationResult({
        status: status,
        team: res?.team || null,
        balance: userBalance,
      });
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        status: "error",
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (!id || !userId) return;
    validateUser(id, userId);
  }, [id, userId]);

  const renderValidationPopup = () => {
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-[85%] relative">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-gray-100 bg-black rounded-full p-1 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>

          {isValidating ? (
            <div className="flex flex-col items-center justify-center">
              <RefreshCw
                className="animate-spin text-gray-500 mb-4"
                size={40}
              />
              <p className="text-gray-700 font-medium">
                Validating registration...
              </p>
            </div>
          ) : validationResult?.status === "success" ? (
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-800 p-2 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4 text-green-800">
                Validation Successful
              </h2>

              {validationResult?.team !== null ? (
                <div className="w-full bg-gray-100 rounded-lg p-4 text-sm">
                  <h3 className="font-semibold mb-2">Team Details</h3>
                  <p>
                    <strong>Team Name:</strong> {validationResult.team.name}
                  </p>
                  <p>
                    <strong>Mobile Number:</strong>{" "}
                    {validationResult.team.mobileNumber}
                  </p>
                  <p>
                    <strong>Total Players:</strong>{" "}
                    {validationResult.team.auctionPlayers?.length || 0}
                  </p>
                  <p className="mt-2">
                    <strong>Current Balance:</strong> {validationResult.balance}{" "}
                    Cr
                  </p>
                </div>
              ) : (
                <div className="w-full bg-gray-100 rounded-lg p-4 text-sm">
                  {" "}
                  No Team Found{" "}
                </div>
              )}
            </div>
          ) : validationResult?.status === "insufficient_balance" ? (
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4 text-yellow-800">
                Insufficient Balance
              </h2>
              <p className="text-center text-gray-600 mb-4">
                Your current balance is {validationResult.balance} Cr, but the
                registration fee is {auction.registrationFee} Cr. Please add
                more funds to your wallet.
              </p>
            </div>
          ) : validationResult?.status === "ineligible" ? (
            <div className="flex flex-col items-center">
              <div className="bg-red-100 text-red-800 p-2 rounded-full mb-4">
                <X className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-red-800">
                Cannot Participate
              </h2>
              <p className="text-center text-gray-600 mb-4">
                You do not meet the requirements to enter this auction. frdc
              </p>
            </div>
          ) : validationResult?.status === "not_registered" ? (
            <div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 text-green-800 p-2 rounded-full mb-4">
                  <ArrowUpLeftFromCircleIcon className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-green-800">
                  Register in the Auction
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  You have not registered yet in the Auction, Register Now!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-red-100 text-red-800 p-2 rounded-full mb-4">
                <X className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-red-800">
                Validation Error
              </h2>
              <p className="text-center text-gray-600 mb-4">
                An error occurred during validation. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative pb-20">
      {renderValidationPopup()}

      <Header heading={"Upcoming Auction"}></Header>

      <div className="p-4 ">
        <img
          src={"https://via.placeholder.com/600x300"}
          alt={auction.title}
          className="w-full h-64 object-cover rounded-lg"
        />

        <h1 className="text-[20px] font-bold mt-4 px-3">{auction.title}</h1>

        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">Date-Time :</span>{" "}
          {new Date(auction.startTime).toLocaleString()}
        </p>

        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">
            Min Duration Required : 2hr
          </span>{" "}
        </p>

        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">
            Min Wallet Amount : 100 Cr
          </span>{" "}
        </p>

        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">Registration Fee : </span>{" "}
          {auction.registrationFee}
        </p>

        <p className="text-base mt-4 text-gray-600 text-justify px-3">
          {auction.description}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        {validationResult?.status === "success" ? (
          validationResult?.team !== null ? (
            <button
              className="px-4 py-3 bg-[#1F41BB] text-white rounded-lg w-full font-medium text-[16px]"
              onClick={() =>
                navigate("/successregister", {
                  state: {
                    auction,
                    registrationData,
                  },
                })
              }
            >
              Enter Auction
            </button>
          ) : (
            <button
              className="px-4 py-3 bg-[#1F41BB] text-white rounded-lg w-full font-medium text-[16px]"
              onClick={() =>
                navigate(`/register/${id}`, { state: { auction } })
              }
            >
              Create Team
            </button>
          )
        ) : validationResult?.status === "insufficient_balance" ? (
          <button
            className="px-4 py-3 bg-yellow-500 text-white rounded-lg w-full font-medium text-[16px]"
            onClick={() => navigate("/myWallet")}
          >
            Insufficient Balance! Go to Wallet
          </button>
        ) : validationResult?.status === "ineligible" ? (
          <div
            className="px-4 py-3 bg-red-500 text-white rounded-lg w-full font-medium text-[16px] text-center"
            onClick={() => navigate(`/register/${id}`, { state: { auction } })}
          >
            You cannot participate in this auction! Exit
          </div>
        ) : validationResult?.status === "not_registered" ? (
          <button
            disabled
            onClick={() => navigate(`/register/${id}`, { state: { auction } })}
            className="px-4 py-3 bg-blue-700 text-gray-100 rounded-lg w-full font-medium text-[16px] cursor-not-allowed"
          >
            Register Now
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-3 bg-gray-300 text-gray-500 rounded-lg w-full font-medium text-[16px] cursor-not-allowed"
          >
            Waiting for Validation
          </button>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;
