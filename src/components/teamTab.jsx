import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PlayerCard from "./PlayerCard";

const TeamsTab = ({ auctionPlayers, activePlayerId, userId, participantMap, pullCount, setPullCount, teamMap }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);

  const handleToggleDropdown = (teamId) => {
    setExpandedTeam((prevTeam) => (prevTeam === teamId ? null : teamId));
  };

  const soldPlayers = auctionPlayers.filter((item) => item?.status === "sold");

  if (soldPlayers.length === 0) {
    return <div className="text-center py-4">No sold players</div>;
  }

  const teamPlayersMap = soldPlayers.reduce((acc, player) => {
    const teamId = player.highestBidderId;
    if (teamId && teamMap[teamId]) {
      if (!acc[teamId]) acc[teamId] = [];
      acc[teamId].push(player);
    }
    return acc;
  }, {});

  return (
    <div className="overflow-y-auto h-[75%] rounded-lg">
      {Object.keys(teamMap).map((teamId) => (
        <div key={teamId} className="px-4 my-3">
          <button
            className="bg-gray-200 w-full py-3 px-5 rounded-lg text-left font-semibold flex justify-between items-center shadow-md transition-all hover:bg-gray-200"
            onClick={() => handleToggleDropdown(teamId)}
          >
            <span className="text-lg text-black">{teamMap[teamId][0]}</span>
            {expandedTeam === teamId ? (
              <ChevronUp className="text-gray-500" size={20} />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </button>

          {expandedTeam === teamId && (
            <div className="bg-white mt-3 rounded-lg shadow-lg p-4 border border-gray-200">
              {teamPlayersMap[teamId]?.map((player, index) => (
                <PlayerCard
                  key={player.auctionPlayerId}
                  tabType={"Teams"}
                  item={player}
                  index={index}
                  ongoingPlayerID={activePlayerId}
                  currentUserID={userId}
                  idToUsernameMap={participantMap}
                  pullCount={pullCount}
                  setPullCount={setPullCount}
                  teamMap={teamMap}
                />
              )) || <div className="text-center p-4">No players in this team</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamsTab;
