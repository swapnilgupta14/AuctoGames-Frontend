import React, { useEffect, useState } from "react";
import SocketService from "../socket/socketService";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const PlayerCard = ({
  tabType,
  item,
  index,
  ongoingPlayerID,
  currentUserID,
  idToUsernameMap,
  pullCount,
  setPullCount,
  teamMap,
}) => {
  const location = useLocation();
  const auctionId = location?.state?.auction?.id;

  console.log(idToUsernameMap)

  return (
    <div className="w-full shadow-2xl bg-white px-4 py-2 my-2 rounded-xl flex items-center gap-4 justify-between border border-gray-200">
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

      {tabType === "Your Team" && (
        <div>
          <p className="font-medium">{item.type}</p>
          <p className="text-xs">({item.order})</p>
        </div>
      )}

      {/* {item?.points !== null ||
        (item?.points !== undefined && (
          <div>
            <p className="text-sm font-semibold text-gray-600">Points</p>
            <p className="font-semibold">{item?.points || "N/A"}</p>
          </div>
        ))} */}

      {tabType === "pullback" &&
        item.status === "unsold" &&
        item.highestBidderId === null && (
          // (true && (
          <div>
            <button
              className="bg-blue-700 py-1 px-3 rounded-2xl text-white flex items-center justify-center w-full"
              onClick={() => {
                const getPullCount = localStorage.getItem("pullCounts");
                const data = JSON.parse(getPullCount);

                if (data && data[item?.auctionPlayerId].remaining < 1) {
                  toast.error("Player can be pulled back only once!");
                  return;
                }

                SocketService.emitPullBackPlayer(
                  auctionId,
                  item?.auctionPlayerId
                );

                if (data) {
                  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                  const auctionPlayerId = item?.auctionPlayerId;
                  if (data[auctionPlayerId]) {
                    if (data[auctionPlayerId].remaining > 0) {
                      data[auctionPlayerId].remaining -= 1;
                      localStorage.setItem("pullCounts", JSON.stringify(data));
                    }
                  } else {
                    console.log(
                      `auctionPlayerId ${auctionPlayerId} not found.`
                    );
                  }
                }
              }}
            >
              PULL
            </button>
          </div>
        )}
    </div>
  );
};

export default PlayerCard;
