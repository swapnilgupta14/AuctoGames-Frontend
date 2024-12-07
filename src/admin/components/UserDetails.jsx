import React, { useEffect, useState } from "react";
import { fetchTransactionHistory } from "../../api/fetch";
import {
  Mail,
  User,
  Award,
  Globe,
  Clock,
  Users,
  Briefcase,
  X,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

const UserDetails = ({ user, onClose }) => {
  const [userTransactions, setUserTransactions] = useState([]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchUserTransactions = async (userId) => {
    try {
      const res = await fetchTransactionHistory(userId);
      if (res?.status === 200) {
        setUserTransactions(res.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchUserTransactions(user.id);
  }, [user]);

  return (
    <div className="relative w-full h-[100%] bg-white overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 z-10 text-red-700 bg-red-100 rounded-full p-1 hover:bg-red-600 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-black p-4 ">
        <div className="flex items-center space-x-6">
          <div>
            <button onClick={onClose}>
              <ArrowLeft />
            </button>
          </div>
          <div className="bg-black/20 p-4 rounded-full">
            <User className="w-10 h-10 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-black/80 flex items-center">
              <Mail className="mr-2 w-5 h-5" /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <Award className="w-10 h-10 text-indigo-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-bold text-gray-800">{user.role}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <Briefcase className="w-10 h-10 text-green-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Teams</p>
            <p className="font-bold text-gray-800">{user.ownedTeams.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <Globe className="w-10 h-10 text-orange-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Auctions</p>
            <p className="font-bold text-gray-800">
              {user.participatedIn.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-1 gap-6 px-3">
        <div className="px-3">
          <h2 className="text-xl font-medium mb-8 flex items-center">
            <Calendar className="mr-3 text-gray-500" /> Participated Auctions
          </h2>
          {user.participatedIn.length > 0 ? (
            <div className="space-y-4 bg-gray-50 p-4">
              {user.participatedIn.map((auction) => (
                <div
                  key={auction.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {auction.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        auction.status === "SCHEDULED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {auction.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {auction.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="mr-2 w-4 h-4" />
                    {formatDate(auction.startTime)} -{" "}
                    {formatDate(auction.endTime)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 p-4">
              No auctions participated.
            </p>
          )}
        </div>

        <div className="px-3">
          <h2 className="text-xl font-medium mb-6 flex items-center">
            <Users className="mr-3 text-gray-500" /> Owned Teams
          </h2>
          {user.ownedTeams.length > 0 ? (
            <div className="space-y-4 bg-gray-50 p-4">
              {user.ownedTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{team.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        team.registrationFeePaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {team.registrationFeePaid ? "Registered" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <DollarSign className="mr-2 w-4 h-4" />
                    Budget Limit: {team.budgetLimit}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Tag className="mr-2 w-4 h-4" />
                    Mobile: {team.mobileNumber}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 p-4">No teams owned.</p>
          )}
        </div>
      </div>

      <div className="mt-8 px-6">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <CreditCard className="mr-3 text-gray-500" /> Transactions
        </h2>
        {userTransactions.length > 0 ? (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            {userTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {transaction.type.replace(/_/g, " ")}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {transaction.description}
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <DollarSign className="mr-2 w-4 h-4" />
                  Amount: ${transaction.amount}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="mr-2 w-4 h-4" />
                  Created At: {formatDate(transaction.createdAt)}
                </div>
                {transaction.approvedOrDeniedAt && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="mr-2 w-4 h-4" />
                    Processed At: {formatDate(transaction.approvedOrDeniedAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <p className="text-gray-500 bg-gray-50 p-4">
              No transactions found.
            </p>
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default UserDetails;
