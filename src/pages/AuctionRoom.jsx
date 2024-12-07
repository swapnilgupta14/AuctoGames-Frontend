import toast from "react-hot-toast";
import Header from "../components/Header";
import PlayerCard from "../components/PlayerCard";
import SocketService from "../socket/socketService";
import TimerComponent from "../components/TimerComponent";
import TeamsTab from "../components/teamTab";

import { Eye, LogOut, PersonStanding } from "lucide-react";
import {
  ArrowUpCircle,
  ChevronUp,
  X,
  Smile,
  Mic,
  Send,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  getAuctionPlayersByID,
  getAllPLayersInAuction,
  clearBids,
  getAllTeamsInAuction,
} from "../api/fetch";

const AuctionRoom = () => {
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auctionId = location?.state?.auction?.id;

  const { userId, token } = useSelector((state) => state.user);
  const auctionData = location?.state?.auction;
  const [error, setError] = useState(null);
  const [roomSize, setRoomSize] = useState(0);
  const [hasNewNotificationArrived, setNewNotification] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [expandPullBack, setExpandPullBack] = useState(false);
  // const [activePlayerName, setActivePlayerName] = useState("");
  const [remainingPlayers, setRemainingPlayers] = useState(0);

  const [auctionPlayers, setAuctionPlayers] = useState(
    auctionData?.auctionPlayers || []
  );

  const [activeTab, setActiveTab] = useState("My Team");
  const [expandChat, setExpandChat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [jump, setJump] = useState(2);
  const [editJump, setEditJump] = useState(false);
  // const [basePrice, setBasePrice] = useState(3);
  const [currentBid, setCurrentBid] = useState(0);

  const chatContainerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  // const [allTeams, setAllTeams] = useState([]);
  const [teamMap, setTeamMap] = useState(undefined);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!auctionId) return;
      const res = await getAllTeamsInAuction(auctionId);
      if (res) {
        const mapOwnerToTeams = (data) => {
          return data.reduce((acc, item) => {
            const ownerId = item.owner.id;
            if (!acc[ownerId]) {
              acc[ownerId] = [];
            }
            acc[ownerId].push(item.name);
            return acc;
          }, {});
        };
        const map = mapOwnerToTeams(res.teams);
        setTeamMap(map);
      }
    };
    fetchTeams(auctionId);
  }, [auctionId]);

  const handleJumpClick = () => {
    if (budget.remaining >= jump) {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const [participantMap, setParticipantMap] = useState({});
  useEffect(() => {
    const map = auctionData?.participants.reduce((acc, participant) => {
      acc[participant.id] = participant.username;
      return acc;
    }, {});
    setParticipantMap(map);
  }, [auctionData]);

  const [budget, setBudget] = useState(() => {
    const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || {};
    const idSaved = localStorage.getItem("userId");
    const compositeKey = `${idSaved}-${auctionId}`;
    return (
      savedBudgets[compositeKey] || {
        remaining: auctionData?.budgetLimit || 100,
        total: auctionData?.budgetLimit || 100,
      }
    );
  });

  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || {};
    const idSaved = localStorage.getItem("userId");
    const compositeKey = `${idSaved}-${auctionId}`;
    savedBudgets[compositeKey] = budget;
    localStorage.setItem("budgets", JSON.stringify(savedBudgets));
  }, [budget, auctionId]);

  const [pullCount, setPullCount] = useState(null);

  useEffect(() => {
    if (activePlayer?.id) {
      const savedPullCounts =
        JSON.parse(localStorage.getItem("pullCounts")) || {};
      setPullCount(
        savedPullCounts[activePlayer.id] || {
          total: 1,
          remaining: 1,
        }
      );
    }
  }, [activePlayer?.id]);

  useEffect(() => {
    const savedPullCounts =
      JSON.parse(localStorage.getItem("pullCounts")) || {};
    savedPullCounts[activePlayer?.id] = pullCount;
    localStorage.setItem("pullCounts", JSON.stringify(savedPullCounts));
  }, [pullCount, activePlayer?.id]);

  // const [jumpCount, setJumpCount] = useState(() => {
  //   const savedJumpCounts =
  //     JSON.parse(localStorage.getItem("jumpCounts")) || {};
  //   return (
  //     savedJumpCounts[activePlayerId] || {
  //       total: 5,
  //       remaining: 5,
  //     }
  //   );
  // });

  // useEffect(() => {
  //   const savedJumpCounts =
  //     JSON.parse(localStorage.getItem("jumpCounts")) || {};
  //   savedJumpCounts[activePlayerId] = jumpCount;
  //   localStorage.setItem("jumpCounts", JSON.stringify(savedJumpCounts));
  // }, [jumpCount, activePlayerId]);

  useEffect(() => {
    SocketService.emitGetPlayerCount();
    console.log(auctionPlayers, "auction players are");
    console.log(activePlayer, "active players are");
  }, [activePlayer, auctionPlayers]);

  const sendMessage = () => {
    if (message.trim()) {
      SocketService.sendChatMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const [currentBids, setCurrentBids] = useState([]);
  const [highestBidderId, sethighestBidderId] = useState(null);
  const [value, setValue] = useState(2);

  // const handleSliderChange = (e) => {
  //   setValue(Number(e.target.value));
  // };

  // const isEligibleForFetch = useMemo(
  //   () => roomSize >= 2 && !!activePlayer?.playerId,
  //   [roomSize, activePlayer?.playerId]
  // );

  useEffect(() => {
    const fetchPlayerById = async () => {
      setCurrentBid("N/A");
      try {
        if (roomSize >= 2 && remainingPlayers > 0 && activePlayer?.playerId) {
          const res = await getAuctionPlayersByID(
            activePlayer?.playerId,
            auctionId
          );

          if (res && auctionId && activePlayer?.id) {
            await clearBids(auctionId, activePlayer.id);
          }

          // console.log(res, "aaaaaaaaaaaaaaaaaaaaa");

          setActivePlayer((prevPlayer) => ({
            ...prevPlayer,
            ...res?.player,
            id: prevPlayer.id,
            imageUrl: res?.imageUrl,
          }));

          setCurrentBids([]);
          setActivePlayerId(res?.id);
          setCurrentBid(res.currentBid !== null ? res.currentBid : 0);
        }
      } catch (error) {
        console.error("Error fetching player by ID:", error);
      }
    };

    fetchPlayerById();
  }, [activePlayer?.playerId, auctionId, remainingPlayers, roomSize]);

  const fetchAllPlayerInAuction = useCallback(async () => {
    if (remainingPlayers < 1) return;
    try {
      const res = await getAllPLayersInAuction(auctionId);
      if (res?.players) {
        setAuctionPlayers(res?.players);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [auctionId, remainingPlayers]);

  useEffect(() => {
    fetchAllPlayerInAuction();
  }, [fetchAllPlayerInAuction]);

  // const fetchCurrentBids = useCallback(async (activePlayerId) => {
  //   if (!activePlayerId || remainingPlayers < 1) {
  //     return;
  //   }
  //   console.log(activePlayerId, "fetching current bids, if any on page render");
  //   const res = await getBidHistoryOfPlayers(activePlayerId);

  //   if (res?.bids.length > 1) {
  //     const sortedBids = (res?.bids || []).sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );
  //     const latestBids = sortedBids.slice(0, 2);
  //     console.log("sorted bids", sortedBids);
  //     setCurrentBids(latestBids);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (activePlayerId) {
  //     fetchCurrentBids(activePlayerId);
  //   }
  // }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    const numericValue = input
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    if (numericValue.startsWith(".")) {
      setValue("0" + numericValue);
    } else {
      setValue(numericValue);
    }
  };

  const handleSetClick = () => {
    if (value < 2 || value > 100) {
      toast.error("Please enter a value between 2 and 100.");
      return;
    }
    setEditJump(false);
    setJump(value);
    toast.success(`Jump amount updated to ${value}Cr!`);
  };

  const setupSocketListeners = useCallback(() => {
    SocketService.onRoomSize((data) => {
      setRoomSize(data.roomSize);
    });

    SocketService.onActivePlayer((data) => {
      sethighestBidderId(null);
      setActivePlayer(data);
      // setActivePlayerName(data?.player?.name);
    });

    SocketService.onPlayerCount((data) => setRemainingPlayers(data?.count));

    SocketService.onNewUserConnected("new user connected");
    SocketService.onBudgetUpdate((data) => console.log("Budget Update", data));

    SocketService.onPlayerReAdded((data) => {
      fetchAllPlayerInAuction(auctionId);
      SocketService.emitGetActivePlayer();
      SocketService.emitGetPlayerCount();
    });

    SocketService.onCurrentBids((data) => {
      if (!data?.bids || !Array.isArray(data.bids)) setCurrentBids([]);

      const sortedBids = data.bids.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      const sliced = sortedBids.slice(0, 2);
      console.log(sliced, sortedBids);
      setCurrentBids(sliced);
    });

    SocketService.onPlayerPulledBack((data) => {
      toast.success("Player Pulled Back Successfully!");
      SocketService.emitGetRoomSize();
      SocketService.emitGetActivePlayer();
      SocketService.emitGetPlayerCount();
    });

    SocketService.onUserDisconnected((data) =>
      console.log("user disconnected", data)
    );

    SocketService.onGetChatHistory((data) => {
      const user_id = localStorage.getItem("userId");
      const formattedChats = data.map((chat) => ({
        id: chat.id,
        sender: chat.userId === Number(user_id) ? "You" : chat.userId,
        text: chat.message,
        timestamp: new Date(chat.timestamp),
      }));
      setChats(formattedChats);
    });

    SocketService.onReceiveChatMessage((data) => {
      const user_id = localStorage.getItem("userId");
      const newChat = {
        id: data.id,
        sender: data.userId === Number(user_id) ? "You" : "Other",
        text: data.message,
        timestamp: new Date(data.timestamp),
      };
      // console.log(data, "message aaya hai...");
      if (data.userId !== userId) {
        setNewNotification(true);
      }
      setChats((prevChats) => [...prevChats, newChat]);
    });

    // SocketService.onGetPlayerPurchasedCount((data) => {
    //   console.log("got purchased players", data);
    // });

    SocketService.onNewBid((data) => {
      // if (timerRef.current) {
      //   timerRef.current.resetTimer();
      // }
      toast.success(`${data.amount}Cr Bid is Placed`);

      const remaining = data?.remainingPlayerCount;
      const highestBidder = data?.highestBidderId;

      const Id = localStorage.getItem("userId");
      if (data?.highestBidderId === Number(Id)) {
        setBudget((prev) => ({
          ...prev,
          remaining: prev.remaining - data.amount,
        }));
      }

      setRemainingPlayers(remaining);
      sethighestBidderId(highestBidder);
      setCurrentBid(data.amount);
    });

    SocketService.onAskNewPlayer(() => {
      fetchAllPlayerInAuction(auctionId);
      toast.success(`Current Player is successfully sold`);
      // if (timerRef.current) {
      //   timerRef.current.startTimer();
      // }
      SocketService.emitGetPlayerCount();
      // resetJumpForNewPlayer();
    });

    SocketService.onError((error) => {
      setError(error.message);
    });
  }, []);

  const handleJumpCount = () => {
    if (jump > currentBid && jump < budget.remaining) {
      // setJumpCount((prev) => ({
      //   ...prev,
      //   remaining: prev.remaining - 1,
      // }));
      placeBid(jump, "jump");
    } else {
      jump < currentBid &&
        toast.error("Bid amount cannot be less than current bid!");
      jump > budget.remaining &&
        toast.error("Your purse is less than bid amount!");
    }
  };

  // const resetJumpForNewPlayer = () => {
  //   setJumpCount({
  //     total: 5,
  //     remaining: 5,
  //   });
  // };

  const setupSocketConnection = async (token, auctionId) => {
    console.log("Auction", token, auctionId);
    try {
      const response = await SocketService.connect(token, auctionId);
      console.log("Socket connection established:", response);
      if (response.connected) {
        SocketService.emitGetChatHistory();
        return response;
      }
    } catch (error) {
      console.error("Failed to connect socket:", error);
      return false;
    }
  };

  const handleTimerEnd = () => {
    console.log("Timer has run out!");
  };

  useEffect(() => {
    // const timerRefrence = timerRef.current;
    const initializeSocket = async () => {
      try {
        // const token = userId;
        const response = await setupSocketConnection(token, auctionId);

        if (response.connected) {
          setupSocketListeners();
          setIsConnected(true);
          SocketService.emitGetRoomSize();
          SocketService.emitGetActivePlayer();
          SocketService.emitGetPlayerCount();
          SocketService.emitGetBudget();
          SocketService.emitGetPlayerPurchasedCount();

          // if (timerRefrence) {
          //   timerRefrence.startTimer();
          // }
        }
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initializeSocket();

    return () => {
      console.log("Cleaning up socket connection...");
      SocketService.disconnect();
      setIsConnected(false);

      // if (timerRefrence) {
      //   timerRefrence.resetTimer();
      // }
    };
  }, [auctionId, userId, setupSocketListeners, token]);

  const placeBid = (amount, type) => {
    if (!isConnected || !activePlayer || roomSize < 2 || remainingPlayers < 1) {
      return;
    }
    if (type === "increment") {
      if (amount > budget.remaining) {
        toast.error(
          `Cannot place bid! not enough money in purse - ${amount} and ${currentBid}`
        );
      }
      if (activePlayerId) {
        SocketService.emitBid(activePlayerId, amount + currentBid);
      }
    } else if (type === "jump") {
      if (budget.remaining < amount) {
        toast.error("Cannot place bid! not enough money in purse");
        return;
      }
      if (activePlayerId) {
        SocketService.emitBid(activePlayerId, amount);
      }
    }
  };

  const ConnectionStatus = () => (
    <div
      className={`px-4 py-2 rounded-full text-sm ${
        isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );

  // console.log("activePLare", activePlayer);

  return (
    <div className="flex flex-col h-dvh lg:h-screen">
      <Header heading={`Auction Room #${auctionId}`}>
        <ConnectionStatus />
      </Header>

      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
          {error}
        </div>
      )} */}

      {remainingPlayers > 0 && roomSize >= 2 ? (
        <div className="flex-1 w-full font-sans flex flex-col items-center justify-between relative">
          <div className="rounded-lg p-4 mt-4 w-full flex justify-center relative">
            <div className="absolute top-0 left-10">
              <img
                src={activePlayer?.imageUrl}
                alt="Player Image"
                className="w-36 h-36 rounded-full border-4 border-gray-200 bg-zinc-300"
              />
            </div>

            <div className="text-xs text-gray-600 w-[70%]">
              <p className="border-2 border-t-zinc-200 py-1 px-2 text-end">
                Type: {activePlayer?.stats?.type || "N/A"}
              </p>
              {/* <p className="border-2 border-b-zinc-200 py-1 px-2 text-end">
                Matches: {activePlayer?.matches || 0}
              </p> */}
              <p className="border-2 border-b-zinc-200 py-1 px-2 text-end">
                Points: {800}
              </p>
              <p className="border-2 border-b-zinc-200 py-1 px-2 text-end">
                Base Price: {currentBid || "N/A"}
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mt-10 text-center">
            {activePlayer?.name || "Fetching player..."}
          </h2>

          <div className="bg-white shadow-2xl mt-0 m-3 py-4 px-12 rounded-3xl text-center w-fit">
            <p className="text-blue-600 text-5xl font-bold mb-2">
              {currentBid}
              <span className="text-2xl"> Cr</span>
            </p>
            <h3 className="text-black text-xl font-semibold">Current Bid</h3>
          </div>

          <div className="bg-white shadow mt-6 rounded-lg w-[95%] overflow-hidden">
            <h3 className="text-black font-bold bg-zinc-300 py-2 px-4 text-start text-sm">
              PREVIOUS BIDS
            </h3>

            {currentBids.length > 0 ? (
              <table className="w-full text-center py-4 px-4">
                <thead>
                  <tr className="font-bold text-sm">
                    <th className="py-2 px-2"></th>
                    <th className="py-2 px-2">Bid</th>
                    <th className="py-2 px-2">Player ID</th>
                    <th className="py-2 px-2">User ID</th>
                  </tr>
                </thead>

                <tbody className="font-bold">
                  {currentBids.map((bid, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4 flex items-center justify-start space-x-3">
                        <img
                          src={bid?.logo || "https://via.placeholder.com/50"}
                          // alt={`${bid?.team} logo`}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-sm">
                            {bid?.team || "Team - N/A"}
                          </span>
                          <span className="text-black text-sm font-bold">
                            {bid?.user?.username}
                          </span>
                        </div>
                      </td>

                      <td className="py-1 px-2 text-sm">{bid?.amount}Cr</td>
                      <td className="py-1 px-2 text-sm">
                        {bid?.auctionPlayerId}
                      </td>
                      <td className="py-1 px-2 text-sm">{bid?.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-medium text-center py-2 text-red-500">
                No Bids for this Player Yet
              </p>
            )}
          </div>

          <div className="bg-white mt-4 p-4 rounded-lg w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-500 font-bold text-xl">
                {budget.remaining}Cr Left
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-5 rounded-full"
                style={{ width: `${(budget.remaining / budget.total) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-2 font-bold text-md">
              <span>Budget</span>
              <span>
                <span className="text-red-500">{budget.remaining}/</span>{" "}
                {budget.total} Cr
              </span>
            </div>
          </div>

          {expandChat && <div className="min-h-[8%]"></div>}

          <div
            className={`${isExpanded && "h-[71%] fixed bottom-0 "} ${
              expandPullBack && "h-[71%] fixed bottom-0"
            } ${expandChat && ` h-[42%]  fixed bottom-0`} ${
              editJump && ` h-[20%]  fixed bottom-0`
            } w-full bg-white z-40`}
          >
            <div className="w-full p-2 py-3 border-t-[3px] border-black rounded-3xl relative">
              <div className="absolute -top-9 left-[50vw] -translate-x-1/2">
                <button
                  onClick={() => {
                    if (expandPullBack) {
                      setExpandPullBack(false);
                      setIsExpanded(false);
                      return;
                    }
                    if (expandChat) {
                      setExpandChat(false);
                      setIsExpanded(false);
                      return;
                    }

                    if (editJump) {
                      setEditJump(false);
                      setIsExpanded(false);
                      return;
                    }
                    setIsExpanded(!isExpanded);
                  }}
                  className={`
                    text-black 
                    flex items-center 
                    justify-center 
                    transition-transform 
                    duration-600 
                    ease-in-out 
                    transform 
                    ${
                      isExpanded || expandChat || expandPullBack || editJump
                        ? "rotate-180"
                        : "rotate-0"
                    }
                    rounded-full 
                    p-2
                  `}
                >
                  <ChevronUp className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>
              <div className="flex justify-between items-center font-medium text-md">
                <button
                  className="flex-1/4  bg-blue-700 text-white py-[0.6rem] px-2 rounded-3xl text-center text-sm sm:text-base font-semibold"
                  onClick={() => {
                    setIsExpanded(false);
                    setExpandPullBack(!expandPullBack);
                    setExpandChat(false);
                    setEditJump(false);
                  }}
                >
                  {expandPullBack ? "CLOSE MENU" : "PULL BACK"}
                </button>

                <button
                  onClick={handleJumpClick}
                  // disabled={budget.remaining < jump}
                  className={`flex-1/4 mx-1 ${
                    budget.remaining < jump ? `bg-blue-400` : `bg-blue-700`
                  }   text-white py-2 px-3 rounded-3xl flex items-center justify-between gap-1 text-center text-sm sm:text-base font-semibold`}
                >
                  <span
                    className="inline-block text-[0.7rem] w-6 h-6 border-2 border-blue-950 rounded-full bg-white text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditJump(!editJump);
                      setExpandChat(false);
                      setIsExpanded(false);
                      setExpandPullBack(false);
                    }}
                  >
                    {jump}Cr
                  </span>
                  JUMP
                </button>

                {showPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-6 border border-gray-200">
                      <div className="flex flex-col items-center justify-center mb-4">
                        <AlertCircle className="text-yellow-500 w-12 h-12 mb-3" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          Confirm Your Bid
                        </h2>
                      </div>

                      <p className="text-center text-gray-600 mb-6">
                        You are placing a bid of{" "}
                        <strong className="text-blue-600">{jump}Cr</strong>
                      </p>

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={closePopup}
                          className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <XCircle className="mr-2 w-5 h-5 text-gray-500" />
                          Discard
                        </button>

                        <button
                          onClick={() => {
                            handleJumpCount();
                            closePopup();
                          }}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="mr-2 w-5 h-5" />
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() =>
                    placeBid(
                      currentBid < 5 && currentBid >= 0 ? 0.25 : 0.5,
                      "increment"
                    )
                  }
                  disabled={budget.remaining < 1}
                  className="flex-1/4 mx-1 bg-blue-700 text-white py-2 px-3 rounded-3xl text-center text-sm sm:text-base flex items-center justify-between gap-1 font-semibold"
                >
                  <span className="inline-block text-[0.7rem] w-6 h-6 border-2 border-blue-950 rounded-full bg-white text-blue-700">
                    {currentBid < 5 && currentBid >= 0
                      ? "25L"
                      : currentBid > 5 && "50L"}
                  </span>
                  INCREASE BID
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="flex w-full gap-2 justify-center pb-2 rounded-lg px-4 py-2">
                {["My Team", "Teams", "Upcoming"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-1 py-2 rounded-sm font-semibold bg-white text-black border-b-4
                    ${
                      activeTab === tab
                        ? "border-b-4 border-b-black"
                        : "border-b-white hover:border-b-4 hover:border-b-blue-950"
                    } transition-all duration-300`}
                  >
                    <span className="font-bold">{tab}</span>
                  </button>
                ))}
              </div>
            )}

            {isExpanded && (
              <div className="h-full my-2 py-4">
                {activeTab === "My Team" && (
                  <div className="overflow-y-auto h-[75%] rounded-lg">
                    {(() => {
                      const yourTeamPlayers = auctionPlayers
                        .filter(
                          (item) =>
                            item?.status === "sold" &&
                            item?.highestBidderId === userId
                        )
                        .sort((a, b) => a.order - b.order);

                      if (yourTeamPlayers.length === 0) {
                        return (
                          <div className="text-center py-4">
                            No players in your team yet.
                          </div>
                        );
                      }

                      return yourTeamPlayers.map((item, index) => (
                        <div key={item.auctionPlayerId} className="px-4">
                          <PlayerCard
                            tabType={"My Team"}
                            item={item}
                            index={index}
                            ongoingPlayerID={activePlayerId}
                            currentUserID={userId}
                            idToUsernameMap={participantMap}
                            pullCount={pullCount}
                            setPullCount={setPullCount}
                            teamMap={teamMap}
                          />
                        </div>
                      ));
                    })()}
                  </div>
                )}

                {activeTab === "Teams" && (
                  <TeamsTab
                    auctionPlayers={auctionPlayers}
                    activePlayerId={activePlayerId}
                    userId={userId}
                    participantMap={participantMap}
                    pullCount={pullCount}
                    setPullCount={setPullCount}
                    teamMap={teamMap}
                  />
                )}

                {activeTab === "Upcoming" && (
                  <div className="overflow-y-auto h-[75%] rounded-lg">
                    {auctionPlayers
                      .filter((it) => it.status === "available")
                      .map((item, index) => {
                        return (
                          <div key={item.auctionID} className="px-4">
                            <PlayerCard
                              tabType={"Upcoming"}
                              item={item}
                              index={index}
                              ongoingPlayerID={activePlayerId}
                              currentUserID={userId}
                              idToUsernameMap={participantMap}
                              pullCount={pullCount}
                              setPullCount={setPullCount}
                              teamMap={teamMap}
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {expandPullBack && (
              <div className="h-full py-4 ">
                <div className="w-full px-4 pb-3 font-semibold flex justify-between items-center">
                  <p>
                    Player that can be pulled back (
                    {auctionPlayers.filter(
                      (it) => it.status === "unsold" && activePlayerId !== it.id
                    ).length || 0}
                    )
                  </p>
                  <span
                    className="h-fit w-fit bg-black rounded-full p-1"
                    onClick={() => {
                      setIsExpanded(false);
                      setExpandPullBack(!expandPullBack);
                      setExpandChat(false);
                    }}
                  >
                    <X className="w-2 h-2 text-white" strokeWidth={3} />
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-red-700 font-medium px-6">
                  {" "}
                  {auctionPlayers.filter(
                    (it) => it.status === "unsold" && activePlayerId !== it.id
                  ).length < 1 && "No players to pull back"}
                </div>

                {/* {activeTab === "Your Team" && ( */}
                <div className="overflow-y-auto h-[82%] rounded-lg">
                  {auctionPlayers.map((item, index) => {
                    if (item.status !== "unsold" || activePlayerId === item.id)
                      return;
                    console.log(item);
                    return (
                      <div key={item.auctionID} className="px-4">
                        <PlayerCard
                          tabType={"pullback"}
                          item={item}
                          index={index}
                          ongoingPlayerID={activePlayerId}
                          currentUserID={userId}
                          idToUsernameMap={participantMap}
                          pullCount={pullCount}
                          setPullCount={setPullCount}
                          teamMap={teamMap}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* )} */}
              </div>
            )}

            {expandChat && (
              <div className="h-full py-4 w-full">
                <div className="h-[85%] flex flex-col justify-between">
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-4"
                  >
                    {chats.map((chat, index) => (
                      <div
                        key={chat.id || index}
                        className={`flex ${
                          chat.sender === "You"
                            ? "justify-end"
                            : "justify-start"
                        } mb-2`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2 rounded-lg ${
                            chat.sender === "You"
                              ? "bg-blue-800 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {chat.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-4 shadow-lg h-fit">
                    <button>
                      <Smile className="w-6 h-6 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      className="flex-grow px-4 py-2 border border-zinc-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button>
                      <Mic className="w-6 h-6 text-gray-600" />
                    </button>
                    <button onClick={sendMessage}>
                      <Send className="w-6 h-6 text-blue-700" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {editJump && (
              <div className="h-full w-full">
                <div className="flex items-start justify-center gap-4 mt-5 px-6">
                  <div className="flex-1 flex flex-col items-start w-full max-w-md">
                    <div className="relative flex items-center w-full">
                      <input
                        id="jumpAmount"
                        type="number"
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                        placeholder="Enter amount"
                      />
                      <span className="absolute right-4 text-gray-500">Cr</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter a value between 2 and 100.
                    </p>
                  </div>

                  <div className="flex justify-center w-fit">
                    <button
                      className="w-fit flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
                      onClick={handleSetClick}
                    >
                      <CheckCircle size={16} className="text-white" />
                      Set
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="fixed right-2 top-[40%] transform -translate-y-1/2 flex flex-col items-center space-y-4">
            <button
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={() => console.log("Button 3 clicked")}
            >
              <TimerComponent ref={timerRef} onTimerEnd={handleTimerEnd} />
            </button>
            <button
              className="w-10 h-10 bg-yellow-100 text-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-200 border-yellow-400 border text-xs"
              onClick={() => {
                SocketService.emitMarkPlayerUnsold(activePlayer?.id, auctionId);
              }}
            >
              New
            </button>
            <button
              className="w-10 h-10 relative bg-green-100 text-green-400 rounded-full flex items-center justify-center hover:bg-green-200 border-green-400 border text-xs"
              onClick={() => {
                setExpandChat(!expandChat);
                setIsExpanded(false);
                setExpandPullBack(false);
                setEditJump(false);
                setNewNotification(false);
              }}
            >
              Chat
              {hasNewNotificationArrived && (
                <span className="inline-block absolute -top-1 left-0 bg-red-600 w-3 h-3 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="p-6 text-center max-w-sm">
            <div className="flex justify-center items-center mb-4">
              <ArrowUpCircle className="h-10 w-10 text-blue-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Room Status</h1>
            {isConnected ? (
              remainingPlayers < 1 ||
              remainingPlayers === null ||
              remainingPlayers === undefined ? (
                <p className="text-gray-600 mt-2 font-medium my-4">
                  <span className="block font-bold text-3xl">
                    Auction is Ended
                  </span>
                  <span className="block">No remaining players to be sold</span>
                </p>
              ) : (
                <p className="text-gray-600 mt-2 font-medium my-4">
                  <span className="block font-bold text-xl">
                    Waiting for other players to join
                  </span>
                  <span className="block">
                    {" "}
                    The room size is currently less than 2. Please wait or check
                    back later.
                  </span>
                </p>
              )
            ) : !isConnected || remainingPlayers > 1 ? (
              <p className="text-gray-600 mt-2 font-medium">
                Connecting to auction room...
              </p>
            ) : (
              <p className="text-gray-600 mt-2 font-medium my-4">
                <span className="block font-bold text-3xl">
                  Auction is Ended
                </span>
                <span className="block">No remaining players to be sold</span>
              </p>
            )}

            {remainingPlayers < 1 && isConnected ? (
              <div className="flex gap-2">
                <button
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-900 focus:ring-2 focus:ring-blue-300 focus:outline-none flex items-center justify-center gap-2"
                  onClick={() => navigate(`/result/${auctionId}`)}
                >
                  <Eye size={20} />
                  Auction Result
                </button>
                <button
                  className="mt-4 bg-white text-blue-600 py-2 px-4 rounded-lg border-2 border-blue-600 hover:bg-gray-400 focus:ring-2 focus:ring-blue-900 focus:outline-none flex items-center justify-center gap-2"
                  onClick={() =>
                    navigate(`/yourTeamPlayers/${auctionId}/${userId}`)
                  }
                >
                  <PersonStanding size={20} />
                  My Team
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-900 focus:ring-2 focus:ring-red-300 focus:outline-none flex items-center justify-center gap-2"
                  onClick={() => navigate("/home")}
                >
                  Leave Room
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionRoom;
