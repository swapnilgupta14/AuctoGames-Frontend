import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { LogIn, ShieldAlert } from "lucide-react";

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

    let url = "https://server.rishabh17704.workers.dev/api/admin-login";
    const data = {
      email: username,
      password,
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const finalRes = await response.json();
    if (finalRes?.status === 201) {
      localStorage.setItem("adminToken", finalRes.token);
      localStorage.setItem("adminAuth", true);
      navigate("/admin/auctions");
    } else {
      setError("Invalid Credentials");
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

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  console.log(isAuthenticated, "qwertyuitrewqwertyui");
  return isAuthenticated ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const Admin = () => {
  return (
    <Routes>
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
        <Route path="how-to-pay" element={<HowToPay />} />
        <Route path="terms" element={<TermsAndConditions />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default Admin;
