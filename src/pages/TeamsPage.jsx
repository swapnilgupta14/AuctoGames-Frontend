import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamResultOfAction, getAllTeamsInAuction } from "../api/fetch";
import { RefreshCw } from "lucide-react";

const TeamsPage = () => {
  const [data, setData] = useState([]);
  const { auctionId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalPlayerCount, setTotalPlayerCount] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        if (!userId || !auctionId) return;
        const res = await getAllTeamsInAuction(auctionId);
        if (res) {
          setIsLoading(false);
          setTotalPlayerCount(res?.totalPlayerCount);
          setData(res.teams || []);
        }
      } catch (error) {
        console.log("dkeknden", error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchTeams();
  }, [auctionId, userId]);

  if (!auctionId || !userId) {
    return (
      <div>
        <p>Some Error has Occured! Try again.</p>
      </div>
    );
  }


  return (
    <div className="h-dvh flex flex-col w-full">
      <Header heading={`Teams in Auction ${auctionId}`} />

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
            {data?.map((item) => (
              <TeamCard
                key={item?.id}
                item={item}
                auctionId={auctionId}
                userId={userId}
                totalPlayerCount = {totalPlayerCount}
              ></TeamCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
