import { useNavigate } from "react-router-dom";
import { Users, Medal, Wallet, Star } from "lucide-react";

const TeamCard = ({ item, auctionId, userId, totalPlayerCount, rank }) => {
  const navigate = useNavigate();

  // Function to get ordinal suffix for rank
  const getRankSuffix = (rank) => {
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
  };

  // // Function to get rank color
  // const getRankColor = (rank) => {
  //   if (rank === 1) return "text-yellow-600";
  //   if (rank === 2) return "text-gray-600";
  //   if (rank === 3) return "text-orange-600";
  //   return "text-gray-800";
  // };

  // // Function to get medal color
  // const getMedalColor = (rank) => {
  //   if (rank === 1) return "text-yellow-500";
  //   if (rank === 2) return "text-gray-400";
  //   if (rank === 3) return "text-orange-500";
  //   return "text-gray-400";
  // };

  const truncateText = (text = "", maxLength = 24) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-xl p-5 border border-gray-300 space-y-4">
      <div className="flex justify-between items-start">
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

      <div className="grid grid-cols-4 gap-3 py-2">
        <div className="flex flex-col items-center text-center">
          <Medal size={21} className={` mb-1.5`} />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Team Rank
          </span>
          <span className={`text-sm font-semibold`}>
            {rank}
            <sup className="text-xs ml-0.5">{getRankSuffix(rank)}</sup>
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Star size={21} className="text-blue-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Points
          </span>
          <span className="text-sm text-gray-800 font-semibold">
            {(item?.totalPoints || 0) + (item?.totalBonus || 0)}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Wallet size={21} className="text-green-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Purse Left
          </span>
          <span className="text-sm text-gray-800 font-semibold">
            ₹{item.budgetLimit ?? "N/A"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <Users size={21} className="text-purple-500 mb-1.5" />
          <span className="text-xs text-gray-600 font-medium tracking-tight">
            Players
          </span>
          <span className="text-sm text-gray-800 font-semibold">
            {item?.auctionPlayers?.length ?? "0"}/{totalPlayerCount ?? "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
