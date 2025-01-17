import { useState, useEffect, useCallback, useMemo } from "react";
import rightArr from "../assets/rightArrWhite.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import profile from "../assets/profile.svg";
import privacy from "../assets/privacy.svg";
import rules from "../assets/rules.svg";
import tnc from "../assets/t&c.svg";
import leftArr from "../assets/leftArr.png";
import user from "../assets/user (2).png";
import { Wallet, ChevronRight, Download, LogOut, HomeIcon } from "lucide-react";
import { getWalletBalance } from "../api/fetch";

const Header = ({ heading, backAllowed = true, homeAllowed = true }) => {
  const navigate = useNavigate();
  const { userId, username } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const fetchWalletData = useCallback(async (userId) => {
    try {
      const balanceRes = await getWalletBalance(userId);
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

  return (
    <div>
      {/* Header */}
      <div className="w-full h-[65px] border border-black bg-[#1F41BB] flex justify-between items-center px-4">
        {backAllowed && (
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

        <div className="flex justify-center items-center gap-6">
          {homeAllowed && (
            <div onClick={() => navigate("/home")}>
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
          )}
          {heading === "Results" && (
            <div className="flex justify-center">
              <Download size={22} className="text-white" />
            </div>
          )}
          {/* <div>
            <img src={bellIcon} alt="Notifications" />
          </div> */}

          <div
            className="border border-white w-[30px] h-[30px] rounded-full flex justify-center items-center text-white font-medium text-[16px] cursor-pointer"
            onClick={toggleSidebar}
          >
            <div>{username.split(" ")[0].charAt(0).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-dvh overflow-y-auto bg-white shadow-lg z-50 flex flex-col justify-between transition-transform duration-300 text-black ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
        }`}
        style={{ width: "300px" }}
      >
        <div className="flex flex-col gap-4 px-0">
          <div className="border-b border-gray-300 px-3 py-4 bg-[rgb(31,65,187)] flex items-center gap-5 justify-around">
            <div className="w-[50px] h-[50px] rounded-full border border-white justify-center items-center flex bg-white">
              <img src={user} alt="" className="w-[30px] h-[30px]" />
            </div>
            <div className="text-white">
              <div className="text-lg font-semibold">
                {username.split(" ")[0]}
              </div>
              <div className="text-sm ">Profile ID: {username}</div>
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
          <p className="px-4 border-b-2"></p>

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
                  ₹{memoizedBalance}
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

        <div className="flex items-center justify-center py-3 w-full">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-md px-4 transition-colors group"
          >
            Logout
            <LogOut className="ml-2 w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
