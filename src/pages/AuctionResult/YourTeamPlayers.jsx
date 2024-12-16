import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { RefreshCw } from "lucide-react";
import {
  getTeamResultOfAction,
  checkTeamComposition,
  priorityUpdate,
} from "../../api/fetch";
import { useSelector } from "react-redux";

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
  return (
    <div
      data-player-index={index}
      onTouchStart={isAuthorizedUser ? onTouchStart : undefined}
      onTouchMove={isAuthorizedUser ? onTouchMove : undefined}
      onTouchEnd={isAuthorizedUser ? onTouchEnd : undefined}
      className={`
        w-full shadow-2xl bg-white select-none px-4 py-2 my-2 rounded-xl flex items-center gap-4 justify-between 
        transition-all duration-200 ease-in-out
        ${!isValid ? "cursor-not-allowed opacity-70" : ""}
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
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [teamData, setTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamName, setTeamName] = useState(null);
  const [auction, setAuction] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [playerIds, setPlayerIds] = useState([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

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
        console.log(res);
        const team = res.teams[0];
        setTeamId(team.id);
        setAuction(team?.auction);
        const players_beforeSorting = team.auctionPlayers || [];
        const players = players_beforeSorting.sort(
          (a, b) => (a?.order || 0) - (b?.order || 0)
        );

        console.log(players, "players");
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

  const validateTeamComposition = async (teamId) => {
    try {
      const res = await checkTeamComposition(teamId);
      setIsValid(!!res);
    } catch (error) {
      console.error("Validation error:", error);
      setIsValid(true);
    }
  };

  const updatePriority = async () => {
    const sliced = playerIds.slice(0, 7);

    if (teamId && auctionId && playerIds.length > 0) {
      try {
        const res = await priorityUpdate(teamId, auctionId, sliced);
        if (res) {
          await fetchPlayersBought();
          setIsOrderChanged(false);
        }
      } catch (error) {
        console.error("Error updating priority order:", error);
        setError("Failed to update player priority");
      }
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

  useEffect(() => {
    console.log(playerIds);
  }, [playerIds]);

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

  const handleLeave = () => {
    navigate("/home");
  };

  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (!auction?.endTime) return;

    const endTime = new Date(auction.endTime);

    const updateCountdown = () => {
      const currentTime = new Date();
      const timeDiff = endTime - currentTime;

      if (timeDiff <= 0) {
        setRemainingTime(null); // Auction has ended
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

    updateCountdown(); // Run immediately to avoid delay

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  const handleAuctionTime = (auctionEndTime) => {
    if (!auctionEndTime) return null;
    const endTime = new Date(auctionEndTime);
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh lg:h-screen">
        <Header heading={`My Team in Auction ${auctionId}`} />
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
        <Header heading={`My Team in Auction ${auctionId}`} />

        <div className="flex-1 flex items-center justify-center text-red-600 font-semibold">
          {error}
        </div>
      </div>
    );
  }

  const auctionDetails = handleAuctionTime(auction?.endTime);

  return (
    <div className="flex flex-col h-dvh lg:h-screen relative">
      <Header heading={`My Team in Auction ${auctionId}`} />

      <div
        ref={listContainerRef}
        className="flex-1 flex flex-col px-4 overflow-y-scroll pb-16"
      >
        <div>
          {auctionDetails.isAuctionEnded ? (
            <div className="text-red-500">
              Auction has ended. You cannot change priority now.
            </div>
          ) : remainingTime ? (
            <div className="py-2">
              You can change & set positions!
              <div className="text-gray-600">
                Auction will end in <span className="font-medium text-red-500"> {remainingTime.days}d {remainingTime.hours}h{" "}
                {remainingTime.minutes}m {remainingTime.seconds}s </span>
              </div>
            </div>
          ) : (
            <div className="text-red-500">
              Auction has ended. You cannot change priority now.
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

      {!isValid && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg absolute bottom-0 left-0 right-0 m-4 z-10 flex items-center justify-between">
          <p className="font-semibold">
            Your team composition is not valid. Your auction has failed.
          </p>
          <button
            onClick={handleLeave}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      )}

      {isOrderChanged && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-20">
          <button
            className={`${
              !isValid ? "bg-gray-500 cursor-not-allowed" : "bg-blue-800"
            } rounded-xl py-3 px-6 text-white w-screen`}
            onClick={updatePriority}
            disabled={!isValid}
          >
            Update Positions
          </button>
        </div>
      )}
    </div>
  );
};

export default YourTeamPlayers;
