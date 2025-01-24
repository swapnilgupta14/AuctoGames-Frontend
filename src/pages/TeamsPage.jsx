import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllTeamsInAuction } from "../api/fetch";
import { RefreshCw } from "lucide-react";

const TeamsPage = () => {
  const [data, setData] = useState([]);
  const { auctionId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalPlayerCount, setTotalPlayerCount] = useState(null);
  const [auctionName, setAuctionName] = useState("");
  const [prizeDistribution, setPrizeDistribution] = useState(null);
  const [teamComposition, setTeamComposition] = useState({});

  function getTeamComposition(teams) {
    const result = {};

    const MAX_PLAYERS = 11;
    const rules = {
      Batter: { min: 3, max: 4 },
      Bowler: { min: 4, max: 4 },
      "Wicket-Keeper": { min: 1, max: 2 },
      "All-Rounder": { min: 1, max: 2 },
    };

    function validatePlayerTypeCount(teamComposition) {
      const totalPlayers = Object.values(teamComposition).reduce(
        (sum, count) => sum + count,
        0
      );
      if (totalPlayers !== MAX_PLAYERS) {
        return {
          valid: false,
          message: `Total players should be exactly ${MAX_PLAYERS}. Current count: ${totalPlayers}`,
        };
      }
      for (const [playerType, count] of Object.entries(teamComposition)) {
        const rule = rules[playerType];
        if (rule && (count < rule.min || count > rule.max)) {
          return {
            valid: false,
            message: `${playerType}: Count should be between ${rule.min} and ${rule.max}. Current count: ${count}`,
          };
        }
      }

      return { valid: true, message: "Team composition is valid." };
    }

    for (const teamKey in teams) {
      const team = teams[teamKey];
      const teamComposition = {
        Batter: 0,
        Bowler: 0,
        "All-Rounder": 0,
        "Wicket-Keeper": 0,
      };

      team.auctionPlayers.forEach((player) => {
        const playerType = player.type;
        teamComposition[playerType]++;
      });

      const validationResult = validatePlayerTypeCount(teamComposition);

      result[teamKey] = {
        ...team,
        teamComposition,
        isTeamCompositionValid: validationResult.valid,
        validationMessage: validationResult.message,
      };
    }

    return result;
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        if (!userId || !auctionId) return;
        const res = await getAllTeamsInAuction(auctionId);
        if (res) {
          setIsLoading(false);
          setAuctionName(res?.auctionName);
          setTotalPlayerCount(res?.totalPlayerCount);
          setPrizeDistribution(res?.prizeDistribution);

          // Ensure teams exists and is an object
          const teamComposition = getTeamComposition(res.teams || {});

          const sortedTeams = Object.values(teamComposition).sort((a, b) => {
            // First, prioritize teams with valid composition
            if (a.isTeamCompositionValid !== b.isTeamCompositionValid) {
              return a.isTeamCompositionValid ? -1 : 1;
            }

            // If both have same composition validity, sort by total points
            const pointsA = a?.totalPoints + (a?.totalBonus || 0) || 0;
            const pointsB = b?.totalPoints + (b?.totalBonus || 0) || 0;
            return pointsB - pointsA;
          });

          setData(sortedTeams);
        }
      } catch (error) {
        console.error("Error fetching teams", error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchTeams();
  }, [auctionId, userId]);

  console.log(teamComposition, "TEAM_COMposition");

  if (!auctionId || !userId) {
    return (
      <div>
        <p>Some Error has Occured! Try again.</p>
      </div>
    );
  }

  const truncateText = (text = "", maxLength = 24) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="h-dvh flex flex-col w-full">
      <Header heading={`${truncateText(auctionName)}`} />

      {isError ? (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <p className="text-red-600 font-medium">Some Error Occured!</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <RefreshCw className="animate-spin text-gray-500" size={36} />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="flex-1 w-full pt-4">
          <div className="flex flex-col gap-5 w-full justify-center items-center px-3">
            {data?.map((item, index) => (
              <TeamCard
                key={item?.id}
                item={item}
                auctionId={auctionId}
                userId={userId}
                totalPlayerCount={totalPlayerCount}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
