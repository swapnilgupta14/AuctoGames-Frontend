import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { LogIn, ShieldAlert } from "lucide-react";
import { axiosInstanceAdmin } from "../api/axiosInstance";

import AdminLayout from "./components/AdminLayout";
import Auctions from "./pages/Auctions";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import AnalyticsPage from "./pages/Analytics";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HowToPlay from "./pages/HowToPlay";
import HowToPay from "./pages/HowToPay";
import TermsAndConditions from "./pages/TermsAndConditions";

import AuctionDetails from "./components/AuctionDetails";
import WalletRequests from "./pages/WalletRequests";
import HowToWithdraw from "./pages/HowToWithdraw";
import Players from "./pages/Players";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstanceAdmin.post("/admin-login", {
        email: username,
        password: password,
      });

      if (response.data?.status === 201) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminAuth", "true");

        const sessionExpiryTime =
          Date.now() + (response.data?.session_timeout || 30) * 60 * 1000;
        localStorage.setItem("AdminSessionTimeout", sessionExpiryTime.toString());

        navigate("/admin/auctions");
      } else {
        setError(response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "An error occurred during login"
      );
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-black" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>

        {error && error.length > 0 && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

const useSessionTimeout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSessionTimeout = () => {
      const storedSessionExpiryTime = localStorage.getItem("AdminSessionTimeout");
      const adminToken = localStorage.getItem("adminToken");
      const currentTime = Date.now();

      // If no token or session timeout, redirect to login
      if (!adminToken || !storedSessionExpiryTime) {
        if (location.pathname !== "/admin/login") {
          handleLogout();
        }
        return;
      }
  
      const expiryTime = parseInt(storedSessionExpiryTime, 10);
      if (currentTime >= expiryTime) {
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("AdminSessionTimeout");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminAuth");
      
      if (location.pathname !== "/admin/login") {
        navigate("/admin/login");
      }
    };

    checkSessionTimeout();

    window.addEventListener('focus', checkSessionTimeout);
    const intervalId = setInterval(checkSessionTimeout, 60000);

    return () => {
      window.removeEventListener('focus', checkSessionTimeout);
      clearInterval(intervalId);
    };
  }, [navigate, location.pathname]);

  return null;
};

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useSessionTimeout();

  const isAuthenticated = 
    localStorage.getItem("adminAuth") === "true" && 
    !!localStorage.getItem("adminToken");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminLayout />;
};

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="auctions" replace />} />
        <Route path="auctions" element={<Auctions />} />
        <Route path="auctions/:auctionId" element={<AuctionDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="wallet-requests" element={<WalletRequests />} />
        <Route path="transactions" element={<Payments />} />
        <Route path="players" element={<Players />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="how-to-play" element={<HowToPlay />} />
        <Route path="how-to-pay" element={<HowToPay />} />
        <Route path="how-to-withdraw" element={<HowToWithdraw />} />
        <Route path="terms" element={<TermsAndConditions />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default Admin;