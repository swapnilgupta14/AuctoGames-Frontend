import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAuctionsOfUser } from "../api/fetch";
import { useSelector } from "react-redux";
import { CalendarIcon, TimerIcon, UsersIcon, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-300 space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-gray-800 truncate pr-2 leading-tight">
          {auction.title}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center text-center">
          <CalendarIcon size={18} className="text-blue-700 mb-1.5" />
          <span className="text-xs text-blue-700 font-medium tracking-tight  mb-1">
            Start
          </span>
          <span className="text-xs text-gray-800 font-semibold">
            {auction.startTime}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <TimerIcon size={18} className="text-red-600 mb-1.5" />
          <span className="text-xs text-red-600 font-medium tracking-tight mb-1">
            End
          </span>
          <span className="text-xs text-gray-800 font-semibold">
            {auction.endTime}
          </span>
        </div>

        <div className="flex flex-col items-center text-center text-green-600">
          ₹
          <span className="text-xs text-green-600 font-medium tracking-tight mb-1">
            Budget
          </span>
          <span className="text-xs text-gray-800 font-semibold">
            ₹{auction.budgetLimit}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            auction.status === "SCHEDULED"
              ? "bg-yellow-100 text-yellow-900"
              : auction?.status === "COMPLETED"
              ? "bg-blue-100 text-blue-800"
              : auction?.status === "LIVE" && "bg-green-100 text-green-800"
          }`}
        >
          {auction.status}
        </div>

        {auction.status !== "SCHEDULED" && (
          <button
            className="flex items-center space-x-1.5 bg-gray-600 rounded-3xl text-white hover:text-gray-800 hover:bg-blue-50 px-2.5 py-1.5 transition-all duration-200 group"
            onClick={() => navigate(`/teamPage/${auction?.id}/${userId}`)}
          >
            <UsersIcon
              size={14}
              className="group-hover:rotate-6 transition-transform"
            />
            {auction?.status === "COMPLETED" ? (
              <span className="text-xs font-medium">View Result</span>
            ) : (
              <span className="text-xs font-medium">Live Standings</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const MyAuctions = () => {
  const { userId } = useSelector((state) => state.user);
  const [auctionsData, setAuctionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("COMPLETED");

  useEffect(() => {
    fetchAuctions(userId);
  }, [userId]);

  const fetchAuctions = async (userId) => {
    setIsLoading(true);
    try {
      const res = await getAuctionsOfUser(userId);
      if (res.participatedIn) {
        setAuctionsData(res.participatedIn);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuctions = auctionsData.filter(
    (auction) => auction.status === activeTab
  );

  const tabs = ["LIVE", "COMPLETED", "SCHEDULED"];

  return (
    <div className="h-dvh w-full bg-gray-100">
      <Header heading={"My Auctions"} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isError ? (
          <div className="flex flex-col gap-3 justify-center items-center h-full">
            <p className="text-red-600 font-medium">Some Error Occurred!</p>
          </div>
        ) : (
          <div className="h-full">
            {isLoading ? (
              <div className="flex flex-col gap-3 justify-center items-center h-full">
                <RefreshCw className="animate-spin text-gray-500" size={36} />
                <p>Loading...</p>
              </div>
            ) : filteredAuctions.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAuctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="h-full text-center font-medium flex items-center justify-center text-gray-600">
                No {activeTab.toLowerCase()} auctions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAuctions;
