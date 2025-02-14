import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowUpLeftFromCircleIcon,
  ArrowUpRightFromCircleIcon,
  FileDown,
  Image,
  RefreshCw,
  WatchIcon,
  X,
  Youtube,
} from "lucide-react";
import Header from "../components/Header";
import { validateAuctionRegistration, getWalletBalance } from "../api/fetch";
import toast from "react-hot-toast";

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  // const [balance, setBalance] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);

  const userId = useSelector((state) => state.user.userId);
  const { id } = useParams();
  const location = useLocation();
  const { auction } = location.state;

  const fetchWalletData = async (userId) => {
    try {
      const balanceRes = await getWalletBalance(userId);
      // setBalance(balanceRes.balance);
      return balanceRes.balance;
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
      return null;
    }
  };

  const handleDownloadInstructions = async () => {
    const pdfFileName = "Instructions_Aucto_Games.pdf";
    const pdfPath = `/${pdfFileName}`;

    try {
      const response = await fetch(pdfPath);

      if (!response.ok) {
        throw new Error(`Failed to download PDF. Status: ${response.status}`);
      }

      const blob = await response.blob();

      if (!blob.type.includes("pdf") || blob.size === 0) {
        throw new Error("Invalid PDF file");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "How-to-Play-Instructions.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("PDF downloaded successfully");

      return true;
    } catch (error) {
      toast.error("PDF download failed:", error.message);
      throw error;
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

      setValidationResult({
        status: status,
        team: res?.teams && res?.teams.length > 0 ? res?.teams[0] : null,
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
          ) : validationResult?.status === "success" ||
            validationResult?.status === "APPROVED" ? (
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
                  <h3 className="font-semibold mb-2 text-blue-700">
                    Registered Team Details Found!
                  </h3>
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
                </div>
              ) : (
                <div className="w-full bg-gray-100 rounded-lg p-4 text-sm">
                  {" "}
                  No Team Found{" "}
                </div>
              )}

              {auction?.status === "LIVE" ? (
                <p className="text-red-600 font-sm py-2 font-medium text-center">
                  Auction is Live Now!
                </p>
              ) : (
                auction?.status === "SCHEDULED" && (
                  <p className="text-red-600 font-sm py-2 font-medium text-center">
                    Auction is Scheduled! Join the Auction at the start Time.
                  </p>
                )
              )}
            </div>
          ) : validationResult?.status === "insufficient_balance" ? (
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 text-orange-800 p-2 rounded-full mb-4">
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
              <h2 className="text-xl font-bold mb-4 text-orange-600">
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
                You do not meet the requirements to enter this auction.
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
                  You are not registered yet in the Auction, Register Now!
                </p>
              </div>
            </div>
          ) : validationResult?.status === "PENDING" ? (
            <div>
              <div className="flex flex-col items-center">
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full mb-4">
                  <WatchIcon className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-yellow-800">
                  Wait! Request Pending
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  Your Team Registration Request is Pending!
                </p>
              </div>
            </div>
          ) : validationResult?.status === "ENDED" ? (
            <div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full mb-4">
                  <ArrowUpRightFromCircleIcon className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-blue-800">
                  Auction Ended!
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  Auction is Ended! Check the Results
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

  const truncateText = (text = "", maxLength = 24) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="relative pb-20">
      {renderValidationPopup()}

      <Header heading={truncateText(auction.title)}></Header>

      <div className="p-4 relative">
        <div className="w-full h-64">
          {auction?.imageUrl ? (
            <img
              src={auction.imageUrl}
              alt={auction.title}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div
              className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center
                        border border-blue-100 group-hover:bg-blue-100/50 transition-colors"
            >
              <Image className="w-12 h-12 text-blue-600" />
            </div>
          )}
        </div>

        {auction?.ytLink && (
          <a
            href={auction?.ytLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 rounded-full p-2 text-white absolute top-[70%] right-2"
          >
            <Youtube className="w-6 h-6" />
          </a>
        )}

        <h1 className="text-[20px] font-semibold mt-4 px-3 flex justify-between">
          {auction.title}{" "}
          <span className="bg-gray-600 text-xs text-white py-2 px-3 rounded-xl h-fit w-fit">
            {auction?.status}
          </span>
        </h1>

        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">Date-Time :</span>{" "}
          {auction.startTime}
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
        <button
          onClick={async () => await handleDownloadInstructions()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 my-2 bg-gray-50 border-gray-400 border text-gray-800 rounded-lg font-medium text-[16px] transition-colors"
        >
          <FileDown className="w-5 h-5" />
          How to Play
        </button>
        {validationResult?.status === "success" ||
        validationResult?.status === "APPROVED" ? (
          validationResult?.team !== null ? (
            <button
              className="px-4 py-3 bg-[#1F41BB] text-white rounded-lg w-full font-medium text-[16px]"
              onClick={() => {
                auction?.status === "LIVE"
                  ? navigate("/successregister", {
                      state: {
                        auction,
                        registrationData,
                      },
                    })
                  : navigate("/home");
              }}
            >
              {auction?.status === "LIVE"
                ? "Enter Auction"
                : "Join when Auction is Live! Go Home"}
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
            onClick={() => navigate(-1)}
          >
            You cannot participate in this auction! Exit
          </div>
        ) : validationResult?.status === "not_registered" ? (
          <button
            onClick={() => navigate(`/register/${id}`, { state: { auction } })}
            className="px-4 py-3 bg-blue-700 text-gray-100 rounded-lg w-full font-medium text-[16px] cursor-not-allowed"
          >
            Register Now
          </button>
        ) : validationResult?.status === "PENDING" ? (
          <button className="px-4 py-3 bg-gray-300 text-gray-600 rounded-lg w-full font-medium text-[16px] cursor-not-allowed">
            Wait! Request Pending
          </button>
        ) : validationResult?.status === "ENDED" ? (
          <button
            onClick={() => navigate(`/teamPage/${auction?.id}/${userId}`)}
            className="px-4 py-3 bg-blue-700 text-white rounded-lg w-full font-medium text-[16px] cursor-not-allowed"
          >
            Auction Ended! Check Result
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-3 bg-gray-300 text-gray-600 rounded-lg w-full font-medium text-[16px] cursor-not-allowed"
          >
            Waiting for Validation
          </button>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;
