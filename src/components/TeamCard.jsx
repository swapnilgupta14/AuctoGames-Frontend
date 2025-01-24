import { useNavigate } from "react-router-dom";
import {
  Users,
  Medal,
  Wallet,
  Star,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

const TeamCard = ({ item, auctionId, userId, totalPlayerCount, rank }) => {
  const navigate = useNavigate();

  const getRankSuffix = (rank) => {
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
  };

  const truncateText = (text = "", maxLength = 24) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const calculateMoneySpend = (item) => {
    const total = item?.auctionPlayers?.reduce(
      (acc, player) => acc + player?.currentBid,
      0
    );

    return total;
  };

  const isDisbarred = !item.isTeamCompositionValid;

  return (
    <div className="w-full bg-white shadow-xl rounded-xl border border-gray-300 space-y-4">
      <div className="flex justify-between items-start px-5 pt-4 pb-3 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
            <img
              src={
                item.imageUrl ||
                "https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
              }
              alt={`${item.name} team logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 truncate leading-tight">
              {truncateText(item.name)}
            </h2>
            {item?.owner?.id == userId ? (
              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                My Team
              </span>
            ) : (
              <p className="text-xs text-gray-600">
                Owner: {item.owner.username}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() =>
            navigate(`/yourTeamPlayers/${auctionId}/${item?.owner?.id}`)
          }
          className="text-red-600 hover:text-red-600 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-all duration-200"
        >
          <Users size={16} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 p-2">
        <div className="flex flex-col items-center text-center">
          <Medal size={21} className={` mb-1.5`} />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Team Rank
          </span>
          <span
            className={`text-sm font-semibold ${
              isDisbarred ? "text-red-600" : ""
            }`}
          >
            {isDisbarred ? "N/A" : rank}
            {!isDisbarred && (
              <sup className="text-xs ml-0.5">{getRankSuffix(rank)}</sup>
            )}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Star size={21} className="text-blue-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Points
          </span>
          <span
            className={`text-sm font-semibold ${
              isDisbarred ? "text-red-600" : "text-gray-800"
            }`}
          >
            {isDisbarred
              ? "N/A"
              : (item?.totalPoints || 0) + (item?.totalBonus || 0)}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Wallet size={21} className="text-green-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            {item.budgetLimit ? "Purse Left" : "Purse Used"}
          </span>
          <span className="text-sm text-gray-800 font-semibold">
            ₹{item.budgetLimit ? "N/A" : calculateMoneySpend(item) + "Cr"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Users size={21} className="text-purple-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Players
          </span>
          <span className="text-sm text-gray-800 font-semibold">
            {item?.auctionPlayers?.length ?? "0"}/11
          </span>
        </div>
      </div>

      {isDisbarred && (
        <div className="bg-red-100 text-red-800 p-2 rounded-b-xl flex items-center justify-center">
          <AlertTriangle className="mr-2" size={16} />
          <span className="text-sm font-medium">{item.validationMessage}</span>
        </div>
      )}

      {!isDisbarred && item?.prize !== null && (
        <div className="bg-green-100 text-green-800 p-2 rounded-b-xl flex items-center justify-center">
          <span className="text-sm font-medium"> Winnings: </span>{" "}
          <IndianRupee className="ml-2" size={16} />
          <span className="text-sm font-medium">{item.prize}</span>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
