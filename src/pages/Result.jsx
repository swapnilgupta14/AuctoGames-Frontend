import { getAuctionPlayersByID, getAllUsers, fetchplayers } from "../api/fetch";
import { MoreHorizontal, Users, GitCompare } from "lucide-react";
import Header from "../components/Header";
import { useEffect } from "react";

const dummyData = [
  {
    id: 1,
    teamName: "Kanpuriya Daredevils",
    username: "@rishabh",
    points: 5670,
    position: "1st",
    logo: "/api/placeholder/48/48",
  },
  {
    id: 2,
    teamName: "Bangalore",
    username: "@anikets",
    points: 2341,
    position: "2nd",
    logo: "/api/placeholder/48/48",
  },
  {
    id: 3,
    teamName: "Bangalore",
    username: "@anikets",
    points: 2341,
    position: "3rd",
    logo: "/api/placeholder/48/48",
  },
  {
    id: 4,
    teamName: "Bangalore",
    username: "@anikets",
    points: 2341,
    position: "4th",
    logo: "/api/placeholder/48/48",
  },
];

const ResultCard = ({ team }) => (
  <div className="bg-white rounded-xl shadow mb-3 w-full max-w-md border-2 border-blue-600 overflow-hidden">
    <div className="min-h-[2vh] bg-blue-600"></div>
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <img
          src={team.logo}
          alt={team.teamName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
          <p className="text-gray-500 text-sm">{team.username}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-500 text-sm">Total Points</p>
        <p className="font-semibold text-gray-900">{team.points} pts</p>
      </div>
    </div>

    <div className="flex items-center justify-between mt-4 py-2 border-t border-gray-400">
      <div className="flex-1 text-center">
        <p className="text-blue-600 font-medium">{team.position}</p>
        <p className="text-gray-500 text-sm">Position</p>
      </div>

      <div className="flex-1 text-center border-l border-r border-gray-100">
        <div className="flex justify-center">
          <Users size={20} className="text-blue-600" />
        </div>
        <p className="text-gray-500 text-sm">Players</p>
      </div>

      <div className="flex-1 text-center border-r border-gray-100">
        <div className="flex justify-center">
          <GitCompare size={20} className="text-blue-600" />
        </div>
        <p className="text-gray-500 text-sm">Compare</p>
      </div>

      <div className="flex-1 text-center">
        <div className="flex justify-center">
          <MoreHorizontal size={20} className="text-blue-600" />
        </div>
        <p className="text-gray-500 text-sm">More</p>
      </div>
    </div>
  </div>
);

import { useParams } from "react-router-dom";

const ResultPage = () => {
  const { auctionId, userId } = useParams();

  // useEffect(() => {
  //   const test1 = async () => {
  //     try {
  //       const response = await getAllUsers();
  //       console.log(response.data, "test1");
  //     } catch (error) {
  //       console.error("Error fetching bid history:", error);
  //     }
  //   };

  //   const test3 = async () => {
  //     try {
  //       const response = await fetchplayers();
  //       console.log(response.data, "test3");
  //     } catch (error) {
  //       console.error("Error fetching bid history:", error);
  //     }
  //   };

  //   test1();
  //   test3();
  // }, []);

  return (
    <>
      <div>
        <Header heading={`Results for Auction ${auctionId} and ${userId}`} />
      </div>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-md mx-auto">
          {dummyData.map((team) => (
            <ResultCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultPage;
