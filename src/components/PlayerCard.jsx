import { useLocation } from "react-router-dom";

const PlayerCard = ({
  tabType,
  item,
  ongoingPlayerID,
  currentUserID,
  idToUsernameMap,
  handlePullBackPlayer,
  pulling,
}) => {
  const location = useLocation();
  const auctionId = location?.state?.auction?.id;

  return (
    <div className="w-full shadow-2xl bg-white px-4 py-2 my-2 rounded-xl flex  gap-4 justify-between border border-gray-200">
      <div className="flex gap-3 items-center">
        <div>
          <div className="bg-zinc-200 w-14 h-14 rounded-full border-black border-2 overflow-hidden">
            <img
              src={item?.imageUrl}
              alt="Player"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">{item?.playerName || "N/A"}</p>
          <p className="text-red-700 font-semibold text-sm">
            {item.status === "sold"
              ? `Sold for - ${item?.currentBid || "N/A"} ${
                  item.currentBid ? "Cr" : ""
                }`
              : `Base Price - ${item?.currentBid || "N/A"} ${
                  item.currentBid ? "Cr" : ""
                }`}
          </p>
          <div
            className={`font-semibold text-sm ${
              ongoingPlayerID === item?.auctionPlayerId
                ? "text-orange-600"
                : item?.status === "available"
                ? "text-green-700"
                : item?.status === "sold"
                ? "text-blue-700"
                : "text-black"
            }`}
          >
            {item?.status === "sold" ? (
              <p>
                Sold to{" "}
                {item?.highestBidderId === currentUserID
                  ? "Me"
                  : idToUsernameMap[item?.highestBidderId]}{" "}
              </p>
            ) : item?.status === "available" ? (
              ongoingPlayerID === item?.auctionPlayerId ? (
                <p>Ongoing...</p>
              ) : (
                <p>Available</p>
              )
            ) : item?.status === "unsold" &&
              ongoingPlayerID === item?.auctionPlayerId ? (
              <p>Bid Ongoing...</p>
            ) : (
              item?.status === "unsold" &&
              item?.highestBidderId === null && <p>Unsold</p>
            )}
          </div>
        </div>
      </div>

      {(tabType === "My Team" ||
        tabType === "Upcoming" ||
        tabType === "Teams") && (
        <div className="flex self-end h-full">
          <p className="font-medium text-xs text-right">
            {item?.type === "Batter" ? "Batsmen" : item?.type} {item?.order}
          </p>
          {/* <p className="text-xs">({item.order})</p> */}
        </div>
      )}

      {tabType === "pullback" &&
        item.status === "unsold" &&
        item.highestBidderId === null && (
          <div className="self-center flex flex-col justify-evenly items-center gap-2">
            <button
              className={` py-1 px-3 rounded-2xl text-white flex items-center justify-center w-full ${
                pulling.get(item?.auctionPlayerId)
                  ? "bg-gray-600"
                  : "bg-blue-700"
              }`}
              onClick={() => {
                handlePullBackPlayer(
                  auctionId,
                  item?.auctionPlayerId,
                  item?.playerName
                );
              }}
            >
              {pulling.get(item?.auctionPlayerId) ? "WAIT.." : "PULL"}
            </button>
            <p className="font-medium text-xs text-right">
              {item?.type === "Batter" ? "Batsmen" : item?.type} {item?.order}
            </p>
          </div>
        )}
    </div>
  );
};

export default PlayerCard;
