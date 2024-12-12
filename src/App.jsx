import { useEffect } from "react";
import { Suspense, lazy } from "react";
import LoginPage from "./pages/Login";
import { Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import ForgotPassPage from "./pages/ForgotPassPage";
import { Toaster } from "react-hot-toast";
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

import { initGA, trackPageView } from "./analytics";

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
  "/how-to-register": "Registeration Instructions",
  "/how-to-withdraw": "Withdraw Instructions",
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Terms and Conditions",
  "/my-auctions": "My Auctions",
  "/teamPage/:auctionId/:userId": "Team Page",
  "/myWallet": "Aucto | My Wallet",
  "/admin/*": "Aucto | Admin",
  "/resetpass/:email/:token": "Aucto | Reset Password",
};

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);

    const pathName = location.pathname;
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
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
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
        <Route path="/yourTeamPlayers/:teamId" element={<YourTeamPlayers />} />
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
    </div>
  );
}

export default App;
