import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  CalendarIcon, 
  TimerIcon, 
  UsersIcon, 
  RefreshCw, 
  ArrowUpDown 
} from "lucide-react";
import Header from "../components/Header";
import { getAuctionsOfUser } from "../api/fetch";

const AuctionCard = ({ auction }) => {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const truncateText = (text = "", maxLength = 35) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-300 space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800 truncate pr-2 leading-tight">
          {truncateText(auction.title)}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center text-center">
          <CalendarIcon size={18} className="text-blue-700 mb-1.5" />
          <span className="text-xs text-blue-700 font-medium tracking-tight mb-1">
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
  const [sortOption, setSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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

  const parseDateTime = (dateTimeString) => {
    // Parse DD/MM/YYYY, HH:MM:SS format
    const [datePart, timePart] = dateTimeString.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const getSortedAuctions = (auctions) => {
    const filteredAuctions = auctions.filter(
      (auction) => auction.status === activeTab
    );

    return filteredAuctions.sort((a, b) => {
      const timeKey = activeTab === "COMPLETED" ? "endTime" : "startTime";
      
      switch (sortOption) {
        case "newest":
          return parseDateTime(b[timeKey]) - parseDateTime(a[timeKey]);
        case "oldest":
          return parseDateTime(a[timeKey]) - parseDateTime(b[timeKey]);
        default:
          return 0;
      }
    });
  };

  const tabs = ["LIVE", "COMPLETED", "SCHEDULED"];
  const sortedAuctions = getSortedAuctions(auctionsData);

  return (
    <div className="h-dvh w-full flex flex-col bg-gray-100">
      <Header heading={"My Auctions"} />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6 px-4 pt-4 border-b border-gray-200">
          <div className="flex space-x-6">
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
          
          <div className="relative">
            <button 
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 pb-2 px-1 text-sm font-medium border-b-2 border-transparent"
            >
              <span className="flex items-center gap-1">
              <ArrowUpDown size={16} />
              <span className="text-sm">Sort</span></span>
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      setSortOption("newest");
                      setIsSortDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("oldest");
                      setIsSortDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Oldest First
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
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
              ) : sortedAuctions.length > 0 ? (
                <div className="h-full overflow-y-auto px-4">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
                    {sortedAuctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
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
    </div>
  );
};

export default MyAuctions;