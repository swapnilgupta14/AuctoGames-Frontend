import React from "react";
import { XCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { convertTo12HourFormat } from "../../utils/TimeConversion";
import { banUnbanUsers } from "../../api/fetch";
import { useAuctionContext } from "../pages/Auctions";

const AuctionDetails = ({ onClose }) => {
  const { selectedAuction, fetchAllAuctions } = useAuctionContext();

  const handleBanUnbanUsers = async (participantId, type) => {
    try {
      const res = await banUnbanUsers(participantId);
      if (res) {
        fetchAllAuctions();
      }
    } catch (err) {
      console.error("Error Ban/Unban User", err);
    }
  };

  // If no current auction, return null or a loading state
  if (!selectedAuction) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading auction details...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="mx-auto w-full px-10 py-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex gap-2 justify-center items-center">
            <button onClick={onClose}>
              <ArrowLeft />
            </button>
            <h1 className="text-xl text-slate-800 font-semibold">
              {selectedAuction.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <XCircle size={24} />
          </button>
        </div>

        {selectedAuction.imageUrl && (
          <div className="mb-6">
            <img
              src={selectedAuction.imageUrl}
              alt={`${selectedAuction.title} auction image`}
              className="w-full h-40 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        <div className="space-y-6">
          <section>
            <h2 className="text-md text-black font-medium mb-3">
              Auction Details
            </h2>
            <div className="bg-white shadow-sm rounded-lg p-4 border">
              <div className="grid md:grid-cols-4 grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all group">
                  <div className="flex items-center mb-1">
                    <span className="text-slate-500 text-xs mr-2">Status</span>
                    <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Current
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold text-base flex items-center">
                    {selectedAuction.status}
                    <span className="ml-2 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all group">
                  <div className="flex items-center mb-1">
                    <span className="text-slate-500 text-xs mr-2">Budget</span>
                    <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Total
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold text-base flex items-center">
                    ₹{selectedAuction.budgetLimit}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22v-7l-2-2m8 4v3H4v-3m16-7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9h16Z" />
                    </svg>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all group">
                  <div className="flex items-center mb-1">
                    <span className="text-slate-500 text-xs mr-2">
                      Start Time
                    </span>
                    <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Scheduled
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold text-base flex items-center">
                    {convertTo12HourFormat(
                      new Date(selectedAuction.startTime)
                        .toISOString()
                        .split("T")[1]
                        .split(".")[0]
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all group">
                  <div className="flex items-center mb-1">
                    <span className="text-slate-500 text-xs mr-2">
                      End Time
                    </span>
                    <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Expected
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold text-base flex items-center">
                    {new Date(selectedAuction.endTime).toLocaleString()}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-md text-black font-medium mb-3">
              Participants ({selectedAuction.participants.length})
            </h2>
            <div className="bg-white shadow-sm rounded-lg border">
              {selectedAuction.participants.length === 0 ? (
                <p className="text-sm text-slate-500 p-4 text-center">
                  No participants registered
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {selectedAuction.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition"
                    >
                      <div className="flex gap-2 items-center justify-between w-fit">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                          {participant.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-700 text-xs font-medium">
                            {participant.username}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        {participant?.banned ? (
                          <button
                            onClick={() =>
                              handleBanUnbanUsers(participant.id, 1)
                            }
                            className="bg-green-600 text-xs py-2 px-3 rounded-xl font-medium text-white"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleBanUnbanUsers(participant.id, 0)
                            }
                            className="bg-red-600 py-2 text-xs rounded-xl px-3 font-medium text-white"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-md text-black font-medium mb-3">
              Auction Players ({selectedAuction.auctionPlayers.length})
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selectedAuction.auctionPlayers.length === 0 ? (
                <div className="bg-white shadow-sm border rounded-lg p-4 text-center text-sm text-slate-500">
                  No players in the auction
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {selectedAuction.auctionPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="bg-white shadow-sm border rounded-lg p-3 flex flex-col items-center hover:bg-slate-50 transition-colors"
                    >
                      <img
                        src={player.imageUrl}
                        alt={player.player.name}
                        className="w-16 h-16 rounded-full object-cover mb-2 bg-zinc-500"
                      />
                      <div className="text-center w-full">
                        <p className="text-sm text-slate-700 font-medium">
                          {player.player.name}
                        </p>
                        <p className="text-xs text-slate-500 mb-1">
                          {player.type}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              player.status === "sold"
                                ? "bg-green-50 text-green-600"
                                : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {player.status.toUpperCase()}
                          </span>
                          <p className="text-xs text-green-600">
                            ₹{player.currentBid}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
