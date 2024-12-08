import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAuctionsOfUser } from "../api/fetch";
import { useSelector } from "react-redux";
import {
  CalendarIcon,
  DollarSignIcon,
  TimerIcon,
  UsersIcon,
  EyeIcon,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-300 space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-gray-800 truncate pr-2 leading-tight">
          {auction.title}
        </h2>
        <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1">
          <EyeIcon size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center text-center">
          <CalendarIcon size={18} className="text-blue-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Start
          </span>
          <span className="text-xs text-gray-800 font-semibold">
            {formatDate(auction.startTime)}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <TimerIcon size={18} className="text-red-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            End
          </span>
          <span className="text-xs text-gray-800 font-semibold">
            {formatDate(auction.endTime)}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
        ₹
          <span className="text-xs text-gray-600 font-medium tracking-tight">
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
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {auction.status}
        </div>

        <button
          className="flex items-center space-x-1.5 bg-gray-600 rounded-3xl text-white hover:text-gray-800 hover:bg-blue-50 px-2.5 py-1.5 transition-all duration-200 group"
          onClick={() => navigate(`/teamPage/${auction?.id}/${userId}`)}
        >
          <UsersIcon
            size={14}
            className="group-hover:rotate-6 transition-transform"
          />
          <span className="text-xs font-medium">View Result</span>
        </button>
      </div>
    </div>
  );
};

const MyAuctions = () => {
  const { userId } = useSelector((state) => state.user);
  const [auctionsData, setAuctionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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

  return (
    <div className="h-dvh w-full bg-gray-100 ">
      <Header heading={"My Auctions"} />

      {isError ? (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <p className="text-red-600 font-medium">Some Error Occured!</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 h-full">
          {isLoading ? (
            <div className="flex flex-col gap-3 justify-center items-center h-full">
              <RefreshCw className="animate-spin text-gray-500" size={36} />
              <p>Loading...</p>
            </div>
          ) : auctionsData.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {auctionsData.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="h-full text-center font-medium flex items-center justify-center text-red-600">
              You have not participated in any auction yet!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
