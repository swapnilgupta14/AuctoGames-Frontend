import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { RefreshCw, X, AlertTriangle } from "lucide-react";
import {
  getTeamResultOfAction,
  checkTeamComposition,
  priorityUpdate,
} from "../../api/fetch";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PlayerCard = ({
  player,
  index,
  isValid,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDragging,
  draggedIndex,
  isAuthorizedUser,
}) => {
  // console.log(isAuthorizedUser, "hiii")
  return (
    <div
      data-player-index={index}
      onTouchStart={isAuthorizedUser ? onTouchStart : undefined}
      onTouchMove={isAuthorizedUser ? onTouchMove : undefined}
      onTouchEnd={isAuthorizedUser ? onTouchEnd : undefined}
      className={`
        w-full shadow-2xl bg-white select-none px-4 py-2 my-2 rounded-xl flex items-center gap-4 justify-between 
        transition-all duration-200 ease-in-out
        ${!isValid ? "cursor-not-allowed" : ""}
        ${
          isDragging && draggedIndex === index
            ? "transform scale-105 opacity-70 shadow-xl z-50 relative"
            : "scale-100 opacity-100"
        }
      `}
    >
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 justify-between items-center">
          <p className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 font-medium text-sm p-2 rounded-full">
            {index + 1}
          </p>
          <div className="bg-zinc-200 w-12 h-12 rounded-full border-black border-2 overflow-hidden">
            <img
              src={player?.imageUrl}
              alt="Player"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="font-medium text-md">{player?.player?.name || "N/A"}</p>
          <p className="text-red-700 font-semibold text-xs">
            Sold for - {player?.currentBid || "N/A"}Cr
          </p>
          <p className="text-blue-700 font-semibold text-xs">
            Base Price - {player?.startingBid || "N/A"}Cr
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-red-700">
          <p className="text-sm font-semibold text-gray-600">Points</p>
          <p className="font-semibold">
            {player?.points?.positions[index + 1] || "0"}
          </p>
        </div>
      </div>
    </div>
  );
};

const YourTeamPlayers = () => {
  const { auctionId, userId } = useParams();
  const [error, setError] = useState("");
  const [teamData, setTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamName, setTeamName] = useState(null);
  const [auction, setAuction] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [playerIds, setPlayerIds] = useState([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [loading, isStillLoading] = useState(false);

  const myId = useSelector((state) => state.user).userId;
  const isAuthorizedUser = myId == userId;

  const [dragState, setDragState] = useState({
    isDragging: false,
    startIndex: null,
    startY: null,
    holdTimeout: null,
    touchMoveStarted: false,
    draggedIndex: null,
  });

  const listContainerRef = useRef(null);
  const touchStartTimerRef = useRef(null);

  const fetchPlayersBought = async () => {
    try {
      if (!userId || !auctionId) {
        setError("Missing user or auction ID");
        setIsLoading(false);
        return;
      }

      const res = await getTeamResultOfAction(auctionId, userId);

      if (res && res.teams && res.teams.length > 0) {
        const team = res.teams[0];
        setTeamId(team.id);
        // console.log("szdxfcghjklkjh", team?.auction);
        setAuction(team?.auction);
        const players_beforeSorting = team.auctionPlayers || [];
        const players = players_beforeSorting.sort(
          (a, b) => (a?.order || 0) - (b?.order || 0)
        );

        // console.log(players);
        setTeamData(players);
        setPlayerIds(players.map((player) => player.id));
        setTeamName(team?.name);

        await validateTeamComposition(team.id);
      } else {
        setError("No team data found");
      }
    } catch (err) {
      setError("Error fetching team data");
    } finally {
      setIsLoading(false);
    }
  };

  const [teamComposition, setTeamComposition] = useState(null);
  const validateTeamComposition = async (teamId) => {
    try {
      const res = await checkTeamComposition(teamId);
      // console.log(res?.playerTypeCount);
      if (res?.status === "INVALID_COMPOSITION") {
        setIsValid(false);
        setTeamComposition(res?.playerTypeCount);
        return;
      }
      setTeamComposition(res?.playerTypeCount);
      setIsValid(true);
    } catch (error) {
      console.error("Validation error:", error);
      setIsValid(false);
    }
  };

  const updatePriority = async () => {
    if (teamId && auctionId && playerIds.length > 0) {
      isStillLoading(true);
      try {
        const res = await priorityUpdate(teamId, auctionId, playerIds);
        if (res) {
          await fetchPlayersBought();
          setIsOrderChanged(false);
          toast.success("Position(s) updated successfully");
          isStillLoading(false);
        }
      } catch (error) {
        isStillLoading(false);
        console.error("Error updating priority order:", error);
        setError("Failed to update player priority");
      }
    } else {
      toast.error(
        "Invalid Update Request! Check team composition or try again!"
      );
    }
  };

  useEffect(() => {
    fetchPlayersBought();
  }, [auctionId, userId]);

  const handleTouchStart = useCallback(
    (e) => {
      if (!isValid || !isAuthorizedUser) return;
      if (touchStartTimerRef.current) {
        clearTimeout(touchStartTimerRef.current);
      }

      const playerIndex = parseInt(
        e.currentTarget.getAttribute("data-player-index"),
        10
      );
      const touch = e.touches[0];

      touchStartTimerRef.current = setTimeout(() => {
        setDragState((prev) => ({
          isDragging: true,
          startIndex: playerIndex,
          startY: touch.clientY,
          touchMoveStarted: false,
          holdTimeout: null,
          draggedIndex: playerIndex,
        }));
      }, 300);
    },
    [isValid]
  );

  // useEffect(() => {
  //   console.log(playerIds);
  // }, [playerIds]);

  const handleTouchMove = useCallback(
    (e) => {
      if (!dragState.isDragging || !isAuthorizedUser) return;
      const touch = e.touches[0];
      const containerRect = listContainerRef.current.getBoundingClientRect();
      const touchY = touch.clientY;

      const playerCards = Array.from(
        listContainerRef.current.querySelectorAll("[data-player-index]")
      );
      const targetCard = playerCards.find((card) => {
        const rect = card.getBoundingClientRect();
        return touchY >= rect.top && touchY <= rect.bottom;
      });

      if (targetCard) {
        const toIndex = parseInt(
          targetCard.getAttribute("data-player-index"),
          10
        );
        const fromIndex = dragState.startIndex;

        if (toIndex !== fromIndex) {
          const updatedTeamData = [...teamData];
          const [movedPlayer] = updatedTeamData.splice(fromIndex, 1);
          updatedTeamData.splice(toIndex, 0, movedPlayer);
          setTeamData(updatedTeamData);

          const updatedPlayerIds = [...playerIds];
          const [movedPlayerId] = updatedPlayerIds.splice(fromIndex, 1);
          updatedPlayerIds.splice(toIndex, 0, movedPlayerId);
          setPlayerIds(updatedPlayerIds);

          setDragState((prev) => ({
            ...prev,
            startIndex: toIndex,
            touchMoveStarted: true,
            draggedIndex: toIndex,
          }));

          setIsOrderChanged(true);
        }
      }

      const scrollThreshold = 50;
      if (touchY <= containerRect.top + scrollThreshold) {
        listContainerRef.current.scrollTop -= 10;
      } else if (touchY >= containerRect.bottom - scrollThreshold) {
        listContainerRef.current.scrollTop += 10;
      }
    },
    [dragState, teamData, playerIds]
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStartTimerRef.current) {
      clearTimeout(touchStartTimerRef.current);
    }

    setDragState({
      isDragging: false,
      startIndex: null,
      startY: null,
      touchMoveStarted: false,
      holdTimeout: null,
      draggedIndex: null,
    });
  }, []);

  useEffect(() => {
    const preventScroll = (e) => {
      // console.log(dragState.isDragging, dragState.touchMoveStarted);
      if (dragState.isDragging || dragState.touchMoveStarted) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [dragState]);

  useEffect(() => {
    const preventScroll = (e) => {
      if (dragState.isDragging && dragState.touchMoveStarted) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [dragState]);

  // const handleLeave = () => {
  //   navigate(-1);
  // };

  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    // console.log(auction?.endTime)
    if (!auction?.endTime) return;

    const time = auction.endTime;
    const adjustedDate = new Date(time);
    const subtractMilliseconds = (5 * 60 + 30) * 60 * 1000; // 5:30 hours in milliseconds
    const newTimestamp = new Date(
      adjustedDate.getTime() - subtractMilliseconds
    ).toISOString();

    const endTime = new Date(newTimestamp);
    console.log(time, newTimestamp, "hiii", endTime);

    const updateCountdown = () => {
      const currentTime = new Date();
      // console.log(endTime, currentTime)
      const timeDiff = endTime - currentTime;

      if (timeDiff <= 0) {
        setRemainingTime(null);
        clearInterval(interval);
      } else {
        setRemainingTime({
          days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
      }
    };

    const interval = setInterval(updateCountdown, 1000);

    updateCountdown();

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  function isTimeLessThanTenMinutes(remainingTime) {
    if (!remainingTime) return false;
    const { days, hours, minutes } = remainingTime;
    const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
    return totalMinutes < 10;
  }

  const handleAuctionTime = (auctionEndTime) => {
    if (!auctionEndTime) return null;
    const currentTime = new Date();

    const formatTime = (date) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      };

      return date.toLocaleString("en-US", options);
    };

    const time = auctionEndTime;
    const adjustedDate = new Date(time);
    const subtractMilliseconds = (5 * 60 + 30) * 60 * 1000;
    const newTimestamp = new Date(
      adjustedDate.getTime() - subtractMilliseconds
    ).toISOString();

    const endTime = new Date(newTimestamp);

    const isAuctionEnded = currentTime > endTime;

    return {
      formattedEndTime: formatTime(endTime),
      originalEndTime: auctionEndTime,
      isAuctionEnded,
      remainingTime: !isAuctionEnded
        ? {
            days: Math.floor((endTime - currentTime) / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              ((endTime - currentTime) % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            ),
            minutes: Math.floor(
              ((endTime - currentTime) % (1000 * 60 * 60)) / (1000 * 60)
            ),
            seconds: Math.floor(((endTime - currentTime) % (1000 * 60)) / 1000),
          }
        : null,
    };
  };

  const truncateText = (text = "", maxLength = 20) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  function formatToIST(dateString) {
    if (!dateString) return "Invalid date";

    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "UTC",
      dateStyle: "long",
      timeStyle: "short",
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh lg:h-screen">
        <Header heading={`${truncateText(teamName)}`} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin text-gray-500" size={36} />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-dvh lg:h-screen">
        <Header heading={`${truncateText(teamName)}`} />

        <div className="flex-1 flex items-center justify-center text-red-600 font-semibold">
          {error}
        </div>
      </div>
    );
  }

  const auctionDetails = handleAuctionTime(auction?.endTime);

  return (
    <div className="flex flex-col h-dvh lg:h-screen relative">
      <Header heading={`${truncateText(teamName)}`} />

      <div
        ref={listContainerRef}
        className="flex-1 flex flex-col px-4 overflow-y-scroll pb-16 py-3"
      >
        <div>
          {remainingTime ? (
            <div className="py-2 test-sm">
              {isAuthorizedUser && (
                <span className="text-sm">
                  {isValid
                    ? "You can change positions of players in your team!"
                    : null}
                </span>
              )}
              <div className="text-gray-600">
                Auction will end in{" "}
                <span className="font-medium text-red-500">
                  {" "}
                  {remainingTime.days}d {remainingTime.hours}h{" "}
                  {remainingTime.minutes}m {remainingTime.seconds}s{" "}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-red-500 text-sm">
              Auction ended at {formatToIST(auction?.endTime)}. <br />
              {isAuthorizedUser && (
                <span className="text-black font-medium">
                  You cannot change positions of your players now.
                </span>
              )}
            </div>
          )}
        </div>
        {teamData.length > 0 ? (
          teamData.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={index}
              isValid={isValid}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              isDragging={dragState.isDragging}
              draggedIndex={dragState.draggedIndex}
              isAuthorizedUser={
                isAuthorizedUser && !auctionDetails.isAuctionEnded
              }
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center font-medium px-6">
            No Players found in this team!
          </div>
        )}
      </div>

      {isValid === false && isAuthorizedUser && (
        <>
          {showBanner ? (
            <div
              className={`
              fixed bottom-0 left-0 right-0 m-4 z-10
              ${
                auctionDetails.isAuctionEnded === true ||
                auction?.status === "COMPLETED"
                  ? "bg-red-50 border border-red-200"
                  : auction?.isEndTimeUpdated === true &&
                    isTimeLessThanTenMinutes(remainingTime)
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-blue-50 border border-blue-200"
              } 
              p-4 rounded-xl shadow-lg
              transition-all duration-300 ease-in-out
            `}
            >
              <div className="flex gap-3">
                {/* {auctionDetails.isAuctionEnded === true ||
                auction?.status === "COMPLETED" ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                )} */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900">
                      {auctionDetails.isAuctionEnded === true ||
                      auction?.status === "COMPLETED"
                        ? "Auction is Ended!"
                        : "Invalid Team Composition!"}
                    </p>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors bg-white"
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  {!auctionDetails.isAuctionEnded && (
                    <div className="text-gray-600">
                      Auction will end in{" "}
                      <span className="font-medium text-red-500">
                        {" "}
                        {remainingTime?.days ?? "0"}d{" "}
                        {remainingTime?.hours ?? "0"}h{" "}
                        {remainingTime?.minutes ?? "0"}m{" "}
                        {remainingTime?.seconds ?? "0"}s{" "}
                      </span>
                    </div>
                  )}

                  <p
                    className={`text-sm mt-1 ${
                      auctionDetails.isAuctionEnded === true ||
                      auction?.status === "COMPLETED"
                        ? "text-red-600"
                        : auction?.isEndTimeUpdated === true &&
                          isTimeLessThanTenMinutes(remainingTime)
                        ? "text-yellow-700"
                        : "text-blue-600"
                    }`}
                  >
                    {auctionDetails.isAuctionEnded === true ||
                    auction?.status === "COMPLETED"
                      ? "Your team composition is not valid. Your auction has failed."
                      : auction?.isEndTimeUpdated === false &&
                        !isTimeLessThanTenMinutes(remainingTime)
                      ? `Go to Auction and buy players to make it valid.`
                      : "10 minute window is open to update the player's position in your team"}
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-medium text-gray-700">
                      Total Player in Team: {teamData.length} /11
                    </div>
                    {teamComposition && (
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-md bg-white text-xs font-medium text-gray-600">
                          B: {teamComposition?.Batsman ?? 0}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-white text-xs font-medium text-gray-600">
                          WK: {teamComposition?.["Wicket Keeper"] ?? 0}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-white text-xs font-medium text-gray-600">
                          AR: {teamComposition?.["All Rounder"] ?? 0}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-white text-xs font-medium text-gray-600">
                          B: {teamComposition?.Bowler ?? 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowBanner(true)}
              className={`
                fixed bottom-4 right-4 z-10
                w-12 h-12 rounded-full shadow-lg
                ${
                  auctionDetails.isAuctionEnded === true ||
                  auction?.status === "COMPLETED"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }
                flex items-center justify-center
                transition-all duration-300 ease-in-out
                hover:scale-105
              `}
            >
              <AlertTriangle className="h-5 w-5 text-white" />
            </button>
          )}
        </>
      )}

      {!isValid && showBanner && isAuthorizedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[5] transition-opacity duration-300"></div>
      )}

      {isOrderChanged && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-20">
          <button
            className={`${
              !isValid ? "bg-gray-500 cursor-not-allowed" : "bg-blue-800"
            } rounded-xl py-3 px-6 text-white w-screen disabled:opacity-95`}
            onClick={updatePriority}
            disabled={!isValid || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating Positions...
              </span>
            ) : (
              "Positions modified, Update"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default YourTeamPlayers;
