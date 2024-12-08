import React, { useEffect, useState } from "react";
import { getAllAuctions } from "../../api/fetch";
import AuctionDetails from "../components/AuctionDetails"; // Import the separate component
import {
  Clock,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  DollarSign,
  Activity,
} from "lucide-react";

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalAuctions: 0,
    liveAuctions: 0,
    upcomingAuctions: 0,
    completedAuctions: 0,
    totalParticipants: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchAllAuctions = async () => {
      setIsLoading(true);
      try {
        const res = await getAllAuctions();
        if (res?.auctions) {
          setAuctions(res.auctions);

          // Calculate stats
          const stats = {
            totalAuctions: res.auctions.length,
            liveAuctions: res.auctions.filter((a) => a.status === "LIVE")
              .length,
            upcomingAuctions: res.auctions.filter(
              (a) => a.status === "UPCOMING"
            ).length,
            completedAuctions: res.auctions.filter(
              (a) => a.status === "COMPLETED"
            ).length,
            totalParticipants: res.auctions.reduce(
              (sum, auction) => sum + (auction.participants?.length || 0),
              0
            ),
            totalRevenue: res.auctions.reduce(
              (sum, auction) =>
                sum +
                auction.registrationFee * (auction.participants?.length || 0),
              0
            ),
          };

          setStatsData(stats);
        } else {
          setError("Failed to fetch auctions");
        }
      } catch (err) {
        setError("Some Error has Occurred!");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAuctions();
  }, []);

  const handleViewDetails = (auction) => {
    setSelectedAuction(auction);
  };

  const handleCloseDetails = () => {
    setSelectedAuction(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4 hover:shadow-lg transition-shadow">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
          <RefreshCw className="animate-spin text-gray-500" size={36} />
          <p>Loading...</p>
        </div>
    );
  }

  // If an auction is selected, render the AuctionDetails
  if (selectedAuction) {
    return (
      <AuctionDetails auction={selectedAuction} onClose={handleCloseDetails} />
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">
        Auction Dashboard
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Activity}
          title="Total Auctions"
          value={statsData.totalAuctions}
          color="text-blue-500"
        />
        <StatCard
          icon={Clock}
          title="Live Auctions"
          value={statsData.liveAuctions}
          color="text-green-500"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Auctions"
          value={statsData.upcomingAuctions}
          color="text-yellow-500"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₹${statsData.totalRevenue.toLocaleString()}`}
          color="text-purple-500"
        />
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        All Auctions ({auctions.length})
      </h2>

      {auctions.length === 0 ? (
        <div className="text-center text-gray-500">
          No active or upcoming auctions
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-gray-50 rounded-lg border border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg text-gray-900 tracking-tight font-medium">
                    {auction.title}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      auction.status
                    )}`}
                  >
                    {auction.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {auction.description}
                </p>

                <div className="space-y-2.5 text-md">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-3.5 w-3.5 text-blue-400" />
                    Start:{" "}
                    <span className="truncate font-semibold ml-1 text-gray-600">
                      {new Date(auction.startTime).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-3.5 w-3.5 text-green-400" />
                    End:
                    <span className="truncate font-semibold ml-1 text-gray-600">
                      {new Date(auction.endTime).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-3.5 w-3.5 text-purple-400" />
                    Participants:
                    <span className="font-semibold ml-1 text-gray-600">
                      {" "}
                      {auction.participants?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="mr-2 h-3.5 w-3.5 text-red-400" />
                    Reg. Fee:{" "}
                    <span className="font-semibold ml-1 text-gray-600">
                      {auction.registrationFee}Rs
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(auction)}
                  className="mt-4 w-full py-2 rounded-md text-sm 
                  bg-blue-600 text-white 
                  hover:bg-blue-700 
                  transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Auction Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auctions;
