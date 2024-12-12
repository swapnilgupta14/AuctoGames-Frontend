import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ArrowDownLeft,
  Users,
  User,
  Percent,
  UserPlus,
  Check,
  IndianRupee,
} from "lucide-react";
import { fetchAnalyticsData } from "../../api/fetch";
import { RefreshCw } from "lucide-react";

const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const data = await fetchAnalyticsData();
      if (data) {
        setAnalyticsData(data);
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
        <RefreshCw className="animate-spin text-gray-500" size={36} />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  const userInsights = {
    totalUsers: analyticsData.bidsPerUser.bidsPerUser.length,
    activeUsers: analyticsData.bidsPerUser.bidsPerUser.filter(
      (user) => user.totalBids > 0
    ).length,
    activeUserPercentage: (
      (analyticsData.bidsPerUser.bidsPerUser.filter(
        (user) => user.totalBids > 0
      ).length /
        analyticsData.bidsPerUser.bidsPerUser.length) *
      100
    ).toFixed(2),
    topBidders: analyticsData.bidsPerUser.bidsPerUser
      .filter((user) => user.totalBids > 0)
      .sort((a, b) => b.totalBidsAmount - a.totalBidsAmount)
      .slice(0, 3),
  };

  const registrationInsights = {
    totalRegistrations: analyticsData.registrationsPerAuction.reduce(
      (sum, auction) =>
        sum + auction.approvedRegistrations + auction.deniedRegistrations,
      0
    ),
    approvalRate: (
      (analyticsData.allRegistrationRequests.APPROVED /
        (analyticsData.allRegistrationRequests.APPROVED +
          analyticsData.allRegistrationRequests.DENIED)) *
      100
    ).toFixed(2),
  };

  // const auctionInsights = analyticsData.eventCompletionRate.completionData.map(
  //   (auction) => ({
  //     ...auction,
  //     completionPercentage: (
  //       (auction.completedTeams / auction.totalTeams) *
  //       100
  //     ).toFixed(2),
  //   })
  // );

  const bidUserData = analyticsData.bidsPerUser.bidsPerUser
    .filter((user) => user.totalBids > 0)
    .map((user) => ({
      name: user.username,
      bids: user.totalBids,
      amount: user.totalBidsAmount,
    }));

  const registrationData = analyticsData.registrationsPerAuction.map(
    (auction) => ({
      name: auction.auctionName,
      approved: auction.approvedRegistrations,
      denied: auction.deniedRegistrations,
    })
  );

  const auctionCompletionData =
    analyticsData.eventCompletionRate.completionData.map((auction) => ({
      name: auction.auctionName,
      total: auction.totalTeams,
      completed: auction.completedTeams,
      incomplete: auction.incompleteTeams,
    }));

  const userActivityData = [
    { name: "Active Users", value: userInsights.activeUsers },
    {
      name: "Inactive Users",
      value: userInsights.totalUsers - userInsights.activeUsers,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-white overflow-y-scroll h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-semibold text-gray-800 mb-8">
            Analytics Dashboard
          </h1>
          <a
            href="https://analytics.google.com/analytics/web/?authuser=2#/p469787007/reports/intelligenthome?params=_u..nav%3Dmaui"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white font-semibold py-2 px-3 rounded-xl text-sm hover:bg-blue-950"
          >
            Google Analytics Dashboard
          </a>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Platform Gain",
              className: "text-blue-600",
              value: `₹${analyticsData.financialSummary.totalPlatformGain}`,
              icon: TrendingUp,
            },
            {
              label: "Total Deposited",
              value: `₹${analyticsData.financialSummary.totalDeposited}`,
              className: "text-green-600",
              icon: IndianRupee,
            },
            {
              label: "Total Withdrawn",

              value: `₹${Math.abs(
                analyticsData.financialSummary.totalWithdrawn
              )}`,
              className: "text-red-600",
              icon: ArrowDownLeft,
            },
            {
              label: "Total Users",
              value: userInsights.totalUsers,
              icon: Users,
            },
            {
              label: "Active Users",
              value: userInsights.activeUsers,
              icon: User,
            },
            {
              label: "Active User Rate",
              value: `${userInsights.activeUserPercentage}%`,
              className: "text-blue-600",
              icon: Percent,
            },
            {
              label: "Total Registrations",
              value: registrationInsights.totalRegistrations,
              icon: UserPlus,
            },
            {
              label: "Registration Approval Rate",
              className: "text-blue-600",
              value: `${registrationInsights.approvalRate}%`,
              icon: Check,
            },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-100 shadow-md rounded-lg p-6 border border-gray-200 w-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    {item.label}
                  </h3>
                  <IconComponent
                    className="text-black bg-zinc-300 p-1 w-6 h-6 rounded-full"
                    size={20}
                  />
                </div>
                <p className={`text-lg font-bold ${item.className || ""}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className=" flex flex-row-reverse gap-6">
          <div className="bg-gray-50 rounded-lg shadow p-4 flex-1">
            <h2 className="text-md font-semibold mb-4">
              Registrations Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="approved"
                  stackId="a"
                  fill="#10B981"
                  name="Approved"
                />
                <Bar
                  dataKey="denied"
                  stackId="a"
                  fill="#EF4444"
                  name="Denied"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center flex gap-8 items-center justify-center">
              <p>
                Total Registrations: {registrationInsights.totalRegistrations}
              </p>
              <p>Approval Rate: {registrationInsights.approvalRate}%</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow p-4 w-[33%]">
            <h2 className="text-md font-semibold mb-4">
              User Activity Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h2 className="text-md font-semibold mb-4">Bidders Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bidUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bids" fill="#3B82F6" name="Total Bids" />
                <Bar dataKey="amount" fill="#10B981" name="Bid Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-md font-semibold mb-4">
              Auction Completion Rate
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={auctionCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#FF6384" />
                <Line type="monotone" dataKey="completed" stroke="#36A2EB" />
                <Line type="monotone" dataKey="incomplete" stroke="#FFCE56" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
