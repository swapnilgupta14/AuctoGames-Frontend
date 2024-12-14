import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/fetch";
import {
  User,
  Mail,
  Award,
  Users as UsersIcon,
  Briefcase,
  Clock,
  Search,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import UserDetails from "../components/UserDetails";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUsers();
      if (res) {
        setAllUsers(res.filter((it) => it.role !== "ADMIN"));
        setIsLoading(false);
        setError(null);
      }
    } catch (error) {
      setError("Error fetching the Users");
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserActivityLevel = (user) => {
    const auctionCount = user.participatedIn.length;
    const teamCount = user.ownedTeams.length;

    if (auctionCount > 3 && teamCount > 1) return "High";
    if (auctionCount > 1 && teamCount > 0) return "Medium";
    return "Low";
  };

  const getActivityColor = (level) => {
    switch (level) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
        <RefreshCw className="animate-spin text-gray-500" size={36} />
        <p>Loading...</p>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="h-screen p-6 overflow-y-scroll">
      <div className="w-full mx-auto">
        {!selectedUser && (
          <div className="mb-8 flex flex-wrap justify-between items-center">
            <h1 className="flex-1 text-xl font-semibold text-gray-800 mb-4 md:mb-0 pb-3 flex flex-col ">
              All Users
              <p className="text-xs font-normal">
                Total Users: {allUsers.length}
              </p>
            </h1>

            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email"
                className="text-sm w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {!selectedUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredUsers.map((user) => {
              const activityLevel = getUserActivityLevel(user);
              return (
                <div
                  key={user.id}
                  className="bg-gray-50 border border-gray-300 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-indigo-100 p-3 mr-4">
                        <User className="text-indigo-600 w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-md font-medium text-gray-800">
                          {user.username}
                        </h2>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="flex items-center bg-white px-2 rounded-full border border-gray-400">
                            <Briefcase className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-xs font-semibold text-gray-600">
                              Teams: {user.ownedTeams.length}
                            </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getActivityColor(
                            activityLevel
                          )}`}
                        >
                          {activityLevel} Activity
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedUser && (
          <UserDetails
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
