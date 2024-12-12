import React, { useEffect, useState, createContext, useContext } from "react";
import {
  getAllAuctions,
  getRegistrationrequest,
  updateAuctionDetails,
  updateRegistrationRequest,
} from "../../api/fetch";
import AuctionDetails from "../components/AuctionDetails";
import {
  Clock,
  Users,
  Calendar,
  RefreshCw,
  Activity,
  IndianRupee,
  Plus,
  Edit,
} from "lucide-react";
import CreateAuctionModal from "../components/CreateAuctionModal";
import { convertTo12HourFormat } from "../../utils/TimeConversion";
import { EditAuctionModal } from "../components/EditAuctionModal";

const AuctionContext = createContext();
export const useAuctionContext = () => useContext(AuctionContext);

const Auctions = () => {
  const [allAuctions, setAllAuctions] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingReq, setIsFetchingRequest] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("liveAuctions");
  const [requests, setRequests] = useState([]);
  const [isCreateAuctionModalOpen, setIsCreateAuctionModalOpen] =
    useState(false);
  const [isEditAuctionModalOpen, setIsEditAuctionModalOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);

  const [statsData, setStatsData] = useState({
    totalAuctions: 0,
    liveAuctions: 0,
    upcomingAuctions: 0,
    completedAuctions: 0,
    totalParticipants: 0,
    totalRevenue: 0,
  });

  const fetchAllAuctions = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAuctions();
      if (res?.auctions) {
        setAllAuctions(res.auctions);

        const live = res.auctions.filter((a) => a.status === "LIVE");
        const scheduled = res.auctions.filter((a) => a.status === "SCHEDULED");
        const completed = res.auctions.filter((a) => a.status === "COMPLETED");

        setLiveAuctions(live);
        setScheduledAuctions(scheduled);
        setCompletedAuctions(completed);

        const stats = {
          totalAuctions: res.auctions.length,
          liveAuctions: live.length,
          upcomingAuctions: scheduled.length,
          completedAuctions: completed.length,
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

  useEffect(() => {
    fetchAllAuctions();
  }, []);

  const approveRegistrationRequest = async (reqId) => {
    try {
      if (!reqId) {
        console.log("Error! request id not received");
        return;
      }
      const res = await updateRegistrationRequest(reqId, 1);
      if (res) {
        console.log(res);
        fetchRequests();
      }
    } catch (err) {
      console.log(err, "Error occured while updating the registration request");
    }
  };

  const declineRegistrationRequest = async (reqId) => {
    try {
      if (!reqId) {
        console.log("Error! request id not received");
        return;
      }
      const res = await updateRegistrationRequest(reqId, 0);
      if (res) {
        console.log(res);
        fetchRequests();
      }
    } catch (err) {
      console.log(err, "Error occured while updating the registration request");
    }
  };

  const fetchRequests = async () => {
    try {
      setIsFetchingRequest(true);
      const result = await getRegistrationrequest();
      if (result) {
        setRequests(result?.requests);
        setIsFetchingRequest(false);
      }
    } catch (error) {
      setIsFetchingRequest(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewDetails = (auction) => {
    setSelectedAuction(auction);
  };

  const handleCloseDetails = () => {
    setSelectedAuction(null);
  };

  const handleEditAuction = (auction) => {
    setEditingAuction(auction);
    setIsEditAuctionModalOpen(true);
  };

  const onEditClose = () => {
    setEditingAuction(null);
    setIsEditAuctionModalOpen(null);
  }

  const onClose =() => {
    setIsCreateAuctionModalOpen(false);
  }

  const handleUpdateAuction = async (updatedAuctionData) => {
    try {
      const payload = {
        title: updatedAuctionData.title,
        description: updatedAuctionData.description,
        scheduledDate: updatedAuctionData.scheduledDate,
        startTime: updatedAuctionData.startTime.includes(":")
          ? `${updatedAuctionData.startTime}:00`
          : updatedAuctionData.startTime,
        registrationFee: updatedAuctionData.registrationFee,
        budgetLimit: updatedAuctionData.budgetLimit,
        auctionId: editingAuction.id,
        status: updatedAuctionData?.status,
      };

      console.log(payload);
      await updateAuctionDetails(payload);
      await fetchAllAuctions();
      onEditClose();
    } catch (error) {
      console.error("Failed to update auction:", error);
      setError("Failed to update auction");
      onEditClose();
    }
  };

  const contextValue = {
    selectedAuction,
    handleCloseDetails,
    fetchAllAuctions,
  };

  const AuctionCard = ({ auction, onViewDetails, onEditAuction }) => (
    <div
      key={auction.id}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-md font-medium text-gray-900 truncate max-w-[70%]">
            {auction.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
              auction.status
            )}`}
          >
            {auction.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 truncate">
          {auction.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-2 h-4 w-4 text-blue-400" />
            <span className="truncate">
              {new Date(auction.startTime).toISOString().split("T")[0]},{" "}
              {convertTo12HourFormat(
                new Date(auction.startTime)
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              )}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <Clock className="mr-2 h-4 w-4 text-green-400" />
            <span className="truncate">
              {new Date(auction.endTime).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <Users className="mr-2 h-4 w-4 text-purple-400" />
            Participants: {auction.participants?.length || 0}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center mt-4">
          <button
            onClick={() => onViewDetails(auction)}
            className="w-full py-2 rounded-md text-sm 
          bg-blue-600 text-white 
          hover:bg-blue-700 
          transition-colors 
          focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            View Details
          </button>

          <button
            className="bg-gray-400 rounded-md p-[0.4rem] text-white font-bold"
            onClick={() => onEditAuction(auction)}
          >
            <Edit />
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
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

  if (selectedAuction) {
    return (
      <AuctionContext.Provider value={contextValue}>
        <AuctionDetails
          // auction={selectedAuction}
          onClose={handleCloseDetails}
        />
      </AuctionContext.Provider>
    );
  }

  return (
    <AuctionContext.Provider value={contextValue}>
      {" "}
      <div className="p-6 bg-white overflow-y-scroll h-screen">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">
          Auction Dashboard
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError("")}>x</button>
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
            icon={IndianRupee}
            title="Total Revenue"
            value={`₹${statsData.totalRevenue.toLocaleString()}`}
            color="text-purple-500"
          />
        </div>

        <div className="w-full p-4">
          <div className="flex justify-between items-center border-b mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("liveAuctions")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
            ${
              activeTab === "liveAuctions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-black hover:text-gray-700"
            }`}
              >
                Live Auctions
                <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {liveAuctions.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("upcomingAuctions")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
            ${
              activeTab === "upcomingAuctions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-black hover:text-gray-700"
            }`}
              >
                Upcoming Auctions
                <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {scheduledAuctions.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("completedAuctions")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
            ${
              activeTab === "completedAuctions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-black hover:text-gray-700"
            }`}
              >
                Completed Auctions
                <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {completedAuctions.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("registrationRequests")}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
            ${
              activeTab === "registrationRequests"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-black hover:text-gray-700"
            }`}
              >
                Pending Registration Requests
                <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {requests.length}
                </span>
              </button>
            </div>

            <button
              onClick={() => setIsCreateAuctionModalOpen(true)}
              className="flex items-center bg-blue-600 text-white px-2 py-1 text-md mb-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Auction
            </button>
          </div>

          {/*  */}

          <div className="w-full">
            {activeTab === "liveAuctions" ? (
              <div className="space-y-6">
                {liveAuctions.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No live auctions
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveAuctions.map((auction) => (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        onViewDetails={handleViewDetails}
                        onEditAuction={handleEditAuction}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "upcomingAuctions" ? (
              <div className="space-y-6">
                {scheduledAuctions.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No upcoming auctions
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduledAuctions.map((auction) => (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        onViewDetails={handleViewDetails}
                        onEditAuction={handleEditAuction}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "completedAuctions" ? (
              <div className="space-y-6">
                {completedAuctions.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No completed auctions
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedAuctions.map((auction) => (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        onViewDetails={handleViewDetails}
                        onEditAuction={handleEditAuction}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {isFetchingReq ? (
                  <div className="flex flex-col gap-3 justify-center items-center h-full">
                    <RefreshCw
                      className="animate-spin text-gray-500"
                      size={36}
                    />
                    <p className="text-gray-500">Loading Requests...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    {requests.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requests.map((request) => (
                          <div
                            key={request.requestId}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-800">
                                  {request.user.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(request.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-700 font-semibold">
                                {request.auction.title}
                              </p>

                              <p className="text-xs text-gray-500">
                                Registration Fee: ${request.registrationFee}
                              </p>
                            </div>

                            <div className="flex justify-between items-center">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  request.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {request.status}
                              </span>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    approveRegistrationRequest(
                                      request.requestId
                                    )
                                  }
                                  className="bg-green-500 text-white text-xs px-3 py-1 rounded-md hover:bg-green-600 transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    declineRegistrationRequest(
                                      request.requestId
                                    )
                                  }
                                  className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No pending registration requests
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {isCreateAuctionModalOpen && (
          <CreateAuctionModal
            onClose={onClose}
            fetchAllAuctions={fetchAllAuctions}
          />
        )}

        {isEditAuctionModalOpen && editingAuction && (
          <EditAuctionModal
            auction={editingAuction}
            onClose={onEditClose}
            onUpdate={handleUpdateAuction}
          />
        )}
      </div>
    </AuctionContext.Provider>
  );
};

export default Auctions;
