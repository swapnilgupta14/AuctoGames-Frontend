import { useEffect } from "react";
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { initGA, trackPageView, trackEvent } from "./analytics";
import LoginPage from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassPage from "./pages/ForgotPassPage";
import ResetPassword from "./pages/ResetPassword";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import AuctionDetail from "./pages/AuctionDetail";
import AuctionRegistration from "./pages/AuctionRegistration";
import SuccessRegister from "./pages/SuccessfulRegistration";
import MyProfile from "./pages/MyProfile";
import AuctionHome from "./pages/AuctionHome";
import AuctionRoom from "./pages/AuctionRoom";
import BidHistory from "./pages/BidHistory";
import ResultPage from "./pages/Result";
import YourTeamPlayers from "./pages/AuctionResult/YourTeamPlayers";
import Play from "./pages/StaticPages/Play";
import Pay from "./pages/StaticPages/Pay";
import Withdraw from "./pages/StaticPages/Withdraw";
import Privacy from "./pages/StaticPages/Privacy";
import Terms from "./pages/StaticPages/Terms";
import MyWallet from "./pages/MyWallet";
import MyAuctions from "./pages/MyAuctions";
import TeamsPage from "./pages/TeamsPage";
const Admin = lazy(() => import("./admin"));

import PWAPrompt from "./components/PWAPrompt";
import Kyc from "./pages/Kyc";
import { getWalletBalance } from "./api/fetch";
import { useSelector } from "react-redux";

const PAGE_TITLES = {
  "/home": "Home",
  "/login": "Login",
  "/signup": "Sign Up",
  "/fpp": "Forgot Password",
  "/": "Welcome",
  "/auction/:id": "Auction",
  "/register/:id": "Auction Registration",
  "/successregister": "Auction Registration",
  "/auctionRoom/:auctionId": "Auction Room",
  "/profile": "Profile",
  "/bidhistory": "Bid History",
  "/yourTeamPlayers/:auctionId/:userId": "Players",
  "/result/:auctionId": "Auction Result",
  "/auctionHome": "Auction",
  "/auction-room": "Auction Room",
  "/how-to-play": "How to Play",
  "/how-to-register": "Registration Instructions",
  "/how-to-withdraw": "Withdraw Instructions",
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Terms and Conditions",
  "/my-auctions": "My Auctions",
  "/teamPage/:auctionId/:userId": "Team Page",
  "/myWallet": "Aucto | My Wallet",
  "/admin/*": "Aucto | Admin",
  "/resetpass/:email/:token": "Aucto | Reset Password",
};

const BYPASS_ROUTES = {
  "/login": true,
  "/signup": true,
  "/fpp": true,
  "/resetpass": true,
  "/": true,
};

const SESSION_CHECK_INTERVAL = 30000;
const USER_ENGAGEMENT_TIMEOUT = 30000;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initGA();
    const sessionStartTime = new Date().toISOString();
    trackEvent("Session Start", { sessionStartTime });
    return () => {
      const sessionEndTime = new Date().toISOString();
      trackEvent("Session End", { sessionEndTime });
    };
  }, []);

  useEffect(() => {
    const pathName = location.pathname;
    trackPageView(pathName);

    const bounceTimer = setTimeout(() => {
      trackEvent("User Engaged", { page: pathName });
    }, USER_ENGAGEMENT_TIMEOUT);

    const matchingRoute = Object.keys(PAGE_TITLES).find((route) => {
      const routeParts = route.split("/");
      const pathParts = pathName.split("/");

      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every(
        (part, index) => part.startsWith(":") || part === pathParts[index]
      );
    });

    document.title = matchingRoute
      ? `${PAGE_TITLES[matchingRoute]} | Aucto Games`
      : "Aucto Games";

    return () => clearTimeout(bounceTimer);
  }, [location]);

  const fetchWalletData = async (userId) => {
    try {
      const balanceRes = await getWalletBalance(userId);
      if (balanceRes?.paymentInfo?.mobileNumber) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    }
  };

  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    const checkSessionTimeout = async () => {
      const pathName = location.pathname;

      if (pathName.startsWith("/admin")) return;
      if (BYPASS_ROUTES[pathName]) {
        if (["/login", "/signup", "/"].includes(pathName)) {
          const token = localStorage.getItem("shopCoToken");
          if (token) {
            // const kycOrNot = await fetchWalletData(userId);
            // if (kycOrNot === false) {
            //   navigate("/kyc");
            //   return;
            // }
            navigate("/home");
            return;
          }
        }
        return;
      }

      const sessionExpiryTime = localStorage.getItem("SessionExpiryTime");
      const token = localStorage.getItem("shopCoToken");

      const clearSession = () => {
        ["shopCoToken", "userId", "email", "SessionExpiryTime"].forEach((key) =>
          localStorage.removeItem(key)
        );
        toast.error("Session expired. Please log in again.", {
          duration: 4000,
        });
        navigate("/login");
      };

      if (
        !sessionExpiryTime ||
        !token ||
        Date.now() > parseInt(sessionExpiryTime, 10)
      ) {
        clearSession();
      }
    };

    checkSessionTimeout();
    const timeoutInterval = setInterval(
      checkSessionTimeout,
      SESSION_CHECK_INTERVAL
    );
    return () => clearInterval(timeoutInterval);
  }, [location, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/fpp" element={<ForgotPassPage />} />
        <Route path="/resetpass/:email/:token" element={<ResetPassword />} />
        <Route path="/" element={<Splash />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/register/:id" element={<AuctionRegistration />} />
        <Route path="/successregister" element={<SuccessRegister />} />
        <Route path="/auctionRoom/:auctionId" element={<AuctionRoom />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/bidhistory" element={<BidHistory />} />
        <Route
          path="/yourTeamPlayers/:auctionId/:userId"
          element={<YourTeamPlayers />}
        />
        <Route path="/result/:auctionId" element={<ResultPage />} />
        <Route path="/auctionHome" element={<AuctionHome />} />
        <Route path="/auction-room" element={<AuctionRoom />} />
        <Route path="/how-to-play" element={<Play />} />
        <Route path="/how-to-register" element={<Pay />} />
        <Route path="/how-to-withdraw" element={<Withdraw />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/my-auctions" element={<MyAuctions />} />
        <Route path="/teamPage/:auctionId/:userId" element={<TeamsPage />} />
        <Route path="/myWallet" element={<MyWallet />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div>Loading Admin Panel...</div>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
      <Toaster />
      <PWAPrompt />
    </div>
  );
}

export default App;
