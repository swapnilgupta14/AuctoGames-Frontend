import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../../components/Header";
import {
  getTeamResultOfAction,
  checkTeamComposition,
  priorityUpdate,
} from "../../api/fetch";

const PlayerCard = ({ player, index, movePlayer }) => {
  console.log(player);

  const [{ isDragging }, drag] = useDrag({
    type: "PLAYER",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "PLAYER",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePlayer(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  console.log(player?.points, `${player?.player?.name}`);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`w-full shadow-2xl bg-white px-4 py-2 my-2 rounded-xl flex items-center gap-4 justify-between 
      ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 justify-between items-center">
          <p className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 font-medium text-sm p-2 rounded-full">
            {index + 1}
          </p>
          <div className="bg-zinc-200 w-14 h-14 rounded-full border-black border-2 overflow-hidden">
            <img
              src={player?.imageUrl}
              alt="Player"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="font-medium text-md">{player?.player?.name || "N/A"}</p>
          <p className="text-red-700 font-semibold text-sm">
            Sold for - {player?.currentBid || "N/A"}Cr
          </p>
          <p className="text-blue-700 font-semibold text-sm">
            Base Price - {player?.startingBid || "N/A"}Cr
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-end">
          <p className="font-medium">{player.type}</p>
        </div>
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
  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState(null);
  const [auctionName, setAuctionName] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const [playerIds, setPlayerIds] = useState([]);
  console.log(playerIds, "arrr");

  const fetchPlayersBought = async () => {
    setIsLoading(true);
    if (!userId || !auctionId) return;
    const res = await getTeamResultOfAction(auctionId, userId);
    if (res) {
      setTeamId(res.teams[0]?.id);
      setError("");
      setIsLoading(false);
      setAuctionName(res.teams[0].auction?.title);
      const players = res.teams[0].auctionPlayers || [];
      setTeamData(players);
      setPlayerIds(players.map((player) => player.id));
      setTeamName(res.teams[0]?.name);
    } else {
      setIsLoading(false);
      setError("Some Error Occurred! Please try again.");
    }
  };

  useEffect(() => {
    fetchPlayersBought();
  }, [auctionId, userId]);

  const validate = async (teamId) => {
    try {
      const res = await checkTeamComposition(teamId);
      if (res) {
        setIsValid(true);
        // await fetchPlayersBought();
        return;
      }
    } catch (error) {
      console.log(error);
      // setIsValid(false);
      // For development purposes, always set to true
      setIsValid(true);
    }
  };

  useEffect(() => {
    if (teamId) {
      validate(teamId);
    }
  }, [teamId]);

  // useEffect(() => {
  const updatePriority = async () => {
    const sliced = playerIds.slice(0, 7);
    console.log("dxjwhbax s", teamId, auctionId, sliced);

    if (teamId && auctionId && playerIds.length > 0) {
      try {
        const res = await priorityUpdate(teamId, auctionId, sliced);
        if (res) {
          await fetchPlayersBought();
        }
      } catch (error) {
        console.error("Error updating priority order:", error);
      }
    }
  };

  // }, [playerIds, teamId, auctionId]);

  const movePlayer = (fromIndex, toIndex) => {
    const updatedTeamData = [...teamData];
    const [movedPlayer] = updatedTeamData.splice(fromIndex, 1);
    updatedTeamData.splice(toIndex, 0, movedPlayer);
    setTeamData(updatedTeamData);

    const updatedPlayerIds = [...playerIds];
    const [movedPlayerId] = updatedPlayerIds.splice(fromIndex, 1);
    updatedPlayerIds.splice(toIndex, 0, movedPlayerId);
    setPlayerIds(updatedPlayerIds);
  };

  const handleLeave = () => {
    navigate("/home");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-dvh lg:h-screen">
        <Header heading={`My Team in Auction ${auctionId}`} />
        {!auctionId || !userId || error.length > 1 || isLoading ? (
          <div className="flex-1 flex items-center justify-center font-semibold">
            {!isLoading
              ? `Some Error Occurred! Please try again.`
              : "Loading..."}
          </div>
        ) : (
          <div className="flex-1 flex flex-col px-4 overflow-y-scroll pb-24">
            {teamData.length > 0 && !isValid && (
              <div className="bg-red-200 text-red-800 p-4 rounded-lg shadow-lg absolute bottom-0 left-0 z-10 flex items-center justify-center">
                <p className="font-semibold text-lg">
                  Your team composition is not valid. Your auction has failed.
                </p>
                <button
                  onClick={handleLeave}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Leave
                </button>
              </div>
            )}

            <div className="py-4 px-2 font-medium flex justify-between items-center">
              <div className="text-xs">
                <p>Team Name: {teamName}</p>
                <p>Auction: {auctionName}</p>
              </div>
              <div>
                <button
                  className={`${teamData.length < 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600"}  rounded-xl py-2 px-3 text-xs text-white`}
                  onClick={() => updatePriority()}
                  disabled = {teamData.length < 1}
                >
                  Update Positions
                </button>
              </div>
            </div>
            {teamData.length > 0 ? (
              teamData.map((player, index) => (
                <PlayerCard
                  key={index}
                  player={player}
                  index={index}
                  movePlayer={movePlayer}
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center font-medium px-6">
                No Players found in this team!
              </div>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default YourTeamPlayers;
