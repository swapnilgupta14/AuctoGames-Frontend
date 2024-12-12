import { useNavigate } from "react-router-dom";

const TeamCard = ({ item, auctionId, userId, totalPlayerCount }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-300 border-2 border-black">
      <div className="p-3">
        <div className="flex items-center space-x-3  p-2 overflow-hidden">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-black">
            <img
              src={item.imageUrl || "/default-team-image.png"}
              alt={`${item.name} team logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <h2 className="text-lg font-semibold text-gray-800 truncate max-w-full">
              {item.name}
            </h2>
            {item?.owner?.id == userId ? (
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                My Team
              </span>
            ) : (
              <p className="text-sm text-gray-600 truncate max-w-full">
                Owner: {item.owner.username}
              </p>
            )}
          </div>
        </div>

        <div className=" mt-2 grid grid-cols-3 gap-2 bg-gray-100 rounded-xl p-2">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-500">
            <p className="text-xs text-blue-500 font-medium mb-1">Total Points</p>
            <p className="font-semibold text-gray-800">
              {item?.totalPoints + item?.totalBonus ?? "N/A"}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-500">
            <p className="text-xs text-blue-500 font-medium mb-1">Purse Left</p>
            <p className="font-semibold text-gray-800">
              {item.budgetLimit ?? "N/A"}
            </p>
          </div>

          <div
            className="bg-white rounded-lg p-2 text-center shadow-sm cursor-pointer hover:bg-gray-50 transition-colors border border-gray-500"
            onClick={() =>
              navigate(`/yourTeamPlayers/${auctionId}/${item?.owner?.id}`)
            }
          >
            <p className="text-xs text-blue-500 font-medium mb-1">Players Bought</p>
            <p className="font-semibold text-gray-800">
              {item?.auctionPlayers?.length ?? "_"}/{totalPlayerCount ?? "_"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
