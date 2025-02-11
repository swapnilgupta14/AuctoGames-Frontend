import { useState, useEffect, useCallback, useMemo } from "react";
import rightArr from "../assets/rightArrWhite.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import profile from "../assets/profile.svg";
import privacy from "../assets/privacy.svg";
import rules from "../assets/rules.svg";
import tnc from "../assets/t&c.svg";
import leftArr from "../assets/leftArr.png";
import {
  Wallet,
  ChevronRight,
  Download,
  LogOut,
  HomeIcon,
  AwardIcon,
  Eye,
  MenuIcon,
  User,
} from "lucide-react";
import { getWalletBalance } from "../api/fetch";

const Header = ({
  heading,
  backAllowed = true,
  homeAllowed = true,
  showPrizeIcon = false,
  openAuctionDetailModal,
  showRules = false,
  handleOpenRulesModal,
  backToMinusOne = false,
  sidebar = true,
}) => {
  const navigate = useNavigate();
  const { userId, username, imageUrl } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const fetchWalletData = useCallback(async (userId) => {
    try {
      const balanceRes = await getWalletBalance(userId);
      // if(!balanceRes?.paymentInfo || !balanceRes?.paymentInfo?.mobileNumber) {
      //   navigate("/kyc");
      //   return;
      // }
      setBalance(balanceRes.balance);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    }
  }, []);

  const memoizedBalance = useMemo(() => balance, [balance]);

  const toggleSidebar = () => {
    if (!isSidebarOpen) {
      fetchWalletData(userId);
    }
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("shopCoToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("SessionExpiryTime");
    navigate("/");
  };

  useEffect(() => {
    if (userId) {
      fetchWalletData(userId);
    }
  }, [userId, fetchWalletData]);

  const whatsappNumber = "7011596733";
  const emailAddress = "auctogames@gmail.com";

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    window.location.href = `whatsapp://send?phone=91${whatsappNumber}`;
    setTimeout(() => {
      window.location.href = `https://wa.me/91${whatsappNumber}`;
    }, 500);
  };

  return (
    <div>
      <div className="w-full h-[65px] border border-black bg-[#1F41BB] flex justify-between items-center px-4 z-20">
        {!backToMinusOne && backAllowed && (
          <div>
            <img
              src={rightArr}
              alt="Back"
              className="w-[14px] h-[16px]"
              onClick={() => navigate("/home")}
            />
          </div>
        )}

        {backToMinusOne && (
          <div>
            <img
              src={rightArr}
              alt="Back"
              className="w-[14px] h-[16px]"
              onClick={() => navigate(-1)}
            />
          </div>
        )}

        <div className="flex-1 font-medium text-lg text-start text-white pl-5">
          {heading}
        </div>

        <div className="flex justify-center items-center gap-4">
          {showPrizeIcon && (
            <div onClick={openAuctionDetailModal}>
              <AwardIcon size={24} className="text-white" />
            </div>
          )}

          {showRules !== true && homeAllowed && (
            <div onClick={() => navigate("/home")}>
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
          )}

          {showRules && (
            <div
              onClick={handleOpenRulesModal}
              className="cursor-pointer bg-white p-1 px-2 rounded-full flex justify-center items-center gap-1"
            >
              <span>
                <Eye size={20} className="text-blue-700" />
              </span>
              <p className="text-blue-700 font-semibold">Rules</p>
            </div>
          )}

          {heading === "Results" && (
            <div className="flex justify-center">
              <Download size={22} className="text-white" />
            </div>
          )}

          {sidebar && !isSidebarOpen && (
            <div
              className="w-[30px] h-[30px] rounded-full flex justify-center items-center text-white font-medium text-[16px] cursor-pointer"
              onClick={toggleSidebar}
            >
              <MenuIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-dvh overflow-y-auto bg-white shadow-lg z-50 flex flex-col justify-between transition-transform duration-300 text-black ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
        }`}
        style={{ width: "300px" }}
      >
        <div className="flex flex-col gap-4 px-0">
          <div className="px-3 py-4 bg-[rgb(31,65,187)] flex items-center gap-2 justify-around">
            <div className="flex items-center gap-2">
              <div className="w-[50px] h-[50px] overflow-hidden rounded-full justify-center items-center flex bg-white">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="text-white">
                <div className="text-lg font-semibold">
                  {username.split(" ")[0]}
                </div>
                <div className="text-sm ">Profile ID: {username}</div>
              </div>
            </div>
            <div className="p-4 flex justify-end text-white">
              <button className="font-bold text-lg" onClick={toggleSidebar}>
                ✕
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={profile} alt="" />
                <div>My Profile</div>
              </div>

              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate("/my-auctions")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={profile} alt="" />
                <div>My Auctions</div>
              </div>

              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>

          <p className="px-4 border-b-2"></p>

          <button
            onClick={() => navigate("/how-to-play")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={rules} alt="" />
                <div>How to Play</div>
              </div>
              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate("/how-to-register")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={rules} alt="" />
                <div>How to Register</div>
              </div>
              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/privacy-policy")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={privacy} alt="" />
                <div>Privacy Policy</div>
              </div>
              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/terms-and-conditions")}
            className="w-full py-2 text-left hover:bg-blue-700 rounded-md px-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-5">
                <img src={tnc} alt="" />
                <div>Terms and Conditions</div>
              </div>
              <div>
                <img src={leftArr} alt="" />
              </div>
            </div>
          </button>

          <p className="px-4 border-b-2"></p>

          <div className="bg-white rounded-lg p-2 mx-1 shadow-sm border border-gray-100">
            <div
              className="flex justify-between items-center mb-4"
              onClick={() => navigate("/myWallet")}
            >
              <div className="flex items-center space-x-5">
                <Wallet className="text-blue-950 w-6 h-6 ml-1" />
                <h3 className="text-md">My Wallet</h3>
              </div>
              <ChevronRight className="text-gray-500 w-5 h-5" />
            </div>

            <div className="bg-green-50 rounded-md p-3 flex items-center justify-between">
              <span className="text-green-700 font-medium">Total Balance</span>
              <div className="bg-green-100 px-2 py-1 rounded-full">
                <span className="text-green-800 font-bold">
                  ₹{memoizedBalance.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-3 mt-3">
              <button
                className="w-full bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center"
                onClick={() => {
                  navigate("/myWallet");
                  setIsSidebarOpen(!isSidebarOpen);
                }}
              >
                <Wallet className="mr-2 w-4 h-4" />
                Add Money
              </button>

              <button
                className="w-full bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
                onClick={() => {
                  navigate("/myWallet");
                  setIsSidebarOpen(!isSidebarOpen);
                }}
              >
                <Download className="mr-2 w-4 h-4" />
                Withdraw
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full p-4 flex-col gap-3 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-2 items-center">
              <a
                href="#contact"
                className="text-gray-600 transition-colors font-medium text-sm"
              >
                Contact Us
              </a>
              <span className="text-gray-300">|</span>
              <a
                href={`whatsapp://send?phone=91${whatsappNumber}`}
                onClick={handleWhatsAppClick}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
              >
                WhatsApp
              </a>
              <span className="text-gray-300">|</span>
              <a
                href={`mailto:${emailAddress}`}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center gap-2 text-sm"
              >
                E-mail
              </a>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full max-w-xs flex items-center justify-center py-3 px-6 text-red-600 bg-red-50 rounded-lg
          hover:bg-red-100 active:bg-red-200 transition-colors duration-200
          font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <span>Logout</span>
            <LogOut className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
