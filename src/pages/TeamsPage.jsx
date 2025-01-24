import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllTeamsInAuction } from "../api/fetch";

const TeamsPage = () => {
  const [data, setData] = useState([]);
  const { auctionId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalPlayerCount, setTotalPlayerCount] = useState(null);
  const [auctionName, setAuctionName] = useState("");
  const [prizeDistribution, setPrizeDistribution] = useState(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

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
          message: `Team composition is Invalid.`,
        };
      }
      for (const [playerType, count] of Object.entries(teamComposition)) {
        const rule = rules[playerType];
        if (rule && (count < rule.min || count > rule.max)) {
          return {
            valid: false,
            message: `Team composition is Invalid.`,
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
          setAuctionName(res?.auctionName);
          setTotalPlayerCount(res?.totalPlayerCount);
          setPrizeDistribution(res?.prizeDistribution);

          const prize = {
            firstPrize: res?.prizeDistribution?.firstPrize || 0,
            secondPrize: res?.prizeDistribution?.secondPrize || 0,
            thirdPrize: res?.prizeDistribution?.thirdPrize || 0,
          };

          const teamComposition = getTeamComposition(res.teams || {});

          const teamsWithPrizes = Object.values(teamComposition).map(
            (team) => ({
              ...team,
              prize:
                team.id === res.prizeDistribution?.firstPrizeTeamId
                  ? prize.firstPrize
                  : team.id === res.prizeDistribution?.secondPrizeTeamId
                  ? prize.secondPrize
                  : team.id === res.prizeDistribution?.thirdPrizeTeamId
                  ? prize.thirdPrize
                  : 0,
            })
          );

          const sortedTeams = teamsWithPrizes.sort((a, b) => {
            if (a.isTeamCompositionValid !== b.isTeamCompositionValid) {
              return a.isTeamCompositionValid ? -1 : 1;
            }
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

  if (!auctionId || !userId) {
    return (
      <div>
        <p>Some Error has Occurred! Try again.</p>
      </div>
    );
  }

  const truncateText = (text = "", maxLength = 18) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const openAuctionDetailModal = () => {
    setShowPrizeModal(true);
  };

  const PrizeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Winning Distribution</h2>
        <div className="space-y-3">
          {prizeDistribution?.firstPrize && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">1st Prize:</span>
              <span>₹{prizeDistribution?.firstPrize || 0}</span>
            </div>
          )}
          {prizeDistribution?.secondPrize && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">2nd Prize:</span>
              <span>₹{prizeDistribution?.secondPrize || 0}</span>
            </div>
          )}
          {prizeDistribution?.thirdPrize && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">3rd Prize:</span>
              <span>₹{prizeDistribution?.thirdPrize || 0}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Prize Pool:</span>
            <span>₹{prizeDistribution?.prizePool || 0}</span>
          </div>
        </div>
        <button
          onClick={() => setShowPrizeModal(false)}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );

  const TeamSkeleton = () => (
    <div className="w-full bg-white shadow-xl rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-300 w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 w-16"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 py-2 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-5 w-5 bg-gray-300 mb-1.5"></div>
            <div className="h-3 w-12 bg-gray-200 mb-1"></div>
            <div className="h-4 w-8 bg-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-dvh flex flex-col w-full overflow-hidden">
      <Header
        heading={`${truncateText(auctionName)}`}
        showPrizeIcon={true}
        openAuctionDetailModal={openAuctionDetailModal}
      />

      {showPrizeModal && <PrizeModal />}
      {isError ? (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <p className="text-red-600 font-medium">Some Error Occurred!</p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 w-full pt-4 overflow-y-scroll py-5 mt-2">
          <div className="flex flex-col gap-5 w-full justify-center items-center px-3">
            {[...Array(4)].map((_, index) => (
              <TeamSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full pt-4 overflow-y-scroll py-5 mt-2">
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