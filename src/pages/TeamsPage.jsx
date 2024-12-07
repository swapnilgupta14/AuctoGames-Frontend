import TeamCard from "../components/TeamCard";
import Header from "../components/Header";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamResultOfAction } from "../api/fetch";

const TeamsPage = () => {
  const [data, setData] = useState([]);
  const { auctionId, userId } = useParams();

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userId || !auctionId) return;
      const res = await getTeamResultOfAction(auctionId, userId);
      if (res) {
        setData(res.teams || []);
      }
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

  console.log(data, "dataaaaa");

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Header heading={`My Teams in Auction ${auctionId}`} />
      <div className="flex-1 w-full pt-4">
        <div className="flex flex-col gap-5 w-full justify-center items-center">
          {data?.map((item) => (
            <TeamCard
              key={item?.id}
              item={item}
              auctionId={auctionId}
              userId={userId}
            ></TeamCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
