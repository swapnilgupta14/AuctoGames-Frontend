import toast from "react-hot-toast";
import Header from "../components/Header";
import PlayerCard from "../components/PlayerCard";
import SocketService from "../socket/socketService";
import TeamsTab from "../components/teamTab";
import { syncTime } from "../api/fetch";

import {
  Calendar,
  Clock,
  Eye,
  LogOut,
  PersonStanding,
  Radio,
  Users,
} from "lucide-react";
import {
  ArrowUpCircle,
  ChevronUp,
  X,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  getAuctionPlayersByID,
  getAllPLayersInAuction,
  getAllTeamsInAuction,
  checkTeamComposition,
  updateEndTime,
  // updateEndTime,
  // getTeamResultOfAction,
} from "../api/fetch";
import RulesModal from "../admin/components/RulesModal";

const AuctionRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bidPromiseRef = useRef(null);
  const delayRef = useRef({ time: null, delay: null });
  const latestHighestBidderRef = useRef(null);
  const { auction } = location.state;

  const serverTimeRef = useRef();

  const syncTimeWithServer = async (clientTime) => {
    const res = await syncTime(clientTime);
    if (res) {
      const timestamp = res?.timestamp;
      const clientTime = res?.clientTime;
      serverTimeRef.current = timestamp - clientTime;
      console.log("Server time offset:", serverTimeRef.current);
      return timestamp - clientTime;
    }
  };

  const truncateText = (text = "", maxLength = 24) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

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
  const [remainingPlayers, setRemainingPlayers] = useState(0);

  const [auctionPlayers, setAuctionPlayers] = useState(
    auctionData?.auctionPlayers || []
  );

  const [activeTab, setActiveTab] = useState("My Team");
  const [expandChat, setExpandChat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [jump, setJump] = useState(2);
  const [currentBid, setCurrentBid] = useState(0);

  const chatContainerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [teamMap, setTeamMap] = useState(undefined);

  const [currentBids, setCurrentBids] = useState([]);
  const [value, setValue] = useState(2);
  const [teamComposition, setTeamComposition] = useState(null);

  // const [auctionStarted, setAuctionStarted] = useState(false);

  const auctionStarted = useRef(false);
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const typeOrder = ["Batter", "Bowler", "Wicket-Keeper", "All-Rounder"];

  const getComposition = async (teamId) => {
    try {
      const res = await checkTeamComposition(teamId);
      if (res) {
        return res?.playerTypeCount;
      }
      return {
        "All Rounder": 0,
        Batsman: 0,
        Bowler: 0,
        "Wicket Keeper": 0,
      };
    } catch (error) {
      console.log("Error fetching team composition", error);
      return {
        "All Rounder": 0,
        Batsman: 0,
        Bowler: 0,
        "Wicket Keeper": 0,
      };
    }
  };

  const handleJumpClick = () => {
    if (budget.remaining >= jump) {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setJump(2);
    setValue(2);
    setShowPopup(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const participantMapRef = useRef({});

  useEffect(() => {
    if (auctionData?.participants) {
      participantMapRef.current = auctionData.participants.reduce(
        (acc, participant) => {
          acc[participant.id] = participant.username;
          return acc;
        },
        {}
      );
    }
  }, [auctionData]);

  const [budget, setBudget] = useState(() => {
    return {
      remaining: auctionData?.budgetLimit,
      total: auctionData?.budgetLimit,
    };
  });

  const [pullCount, setPullCount] = useState(null);

  const sendMessage = () => {
    if (message.trim()) {
      SocketService.sendChatMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const [arePlayerRegistered, setArePlayerRegistered] = useState(null);
  const [teamImageMap, setTeamImageMap] = useState(null);

  useEffect(() => {
    const fetchTeams = async (auctionId) => {
      if (!auctionId || !userId) return;
      const res = await getAllTeamsInAuction(auctionId);
      if (res) {
        if (res?.totalPlayerCount && res?.totalPlayerCount === 0) {
          setArePlayerRegistered(0);
          return;
        }
        setArePlayerRegistered(res?.totalPlayerCount);
        const mapOwnerToTeams = (data) => {
          return data.reduce((acc, item) => {
            const ownerId = item.owner.id;

            if (!acc[ownerId]) {
              acc[ownerId] = [];
            }
            if (ownerId === userId) {
              localStorage.setItem(
                `ownTeamId-${userId}-${auctionId}`,
                item?.id
              );
            }
            acc[ownerId].push(item.name);
            return acc;
          }, {});
        };

        const mapOwnerToTeamsImage = (data) => {
          return data.reduce((acc, item) => {
            const ownerId = item.owner.id;
            if (!acc[ownerId]) {
              acc[ownerId] = [];
            }
            acc[ownerId].push(item.imageUrl === null ? "#" : item?.imageUrl);
            return acc;
          }, {});
        };

        const teamImageMap = mapOwnerToTeamsImage(res.teams);
        const map = mapOwnerToTeams(res.teams);
        setTeamImageMap(teamImageMap);
        setTeamMap(map);
      }
    };

    fetchTeams(auctionId);
  }, [auctionId, userId]);

  const [timeLeft, setTimeLeft] = useState(20);
  const intervalRef = useRef(null);
  const endTime = useRef(null);

  const callTimeAsync = async (time) => {
    await syncTimeWithServer(time);
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    console.log("HII_!");

    intervalRef.current = setInterval(() => {
      let currentTime = new Date().getTime();
      console.log(currentTime, "CURRENT_TIME 1");
      callTimeAsync(currentTime);
      const syncOffset = serverTimeRef.current;
      currentTime += syncOffset;
      console.log(currentTime, "CURRENT_TIME 2");

      if (!endTime.current) {
        clearInterval(intervalRef.current);
        return;
      }
      const remainingTime = Math.round((endTime.current - currentTime) / 1000);

      if (remainingTime >= 0) {
        setTimeLeft(remainingTime);
      } else {
        clearInterval(intervalRef.current);
        setTimeLeft(0);
      }
    }, 1000);
  };

  useEffect(() => {
    if (delayRef.current.time && delayRef.current.delay) {
      try {
        const refTime = new Date(delayRef.current.time).getTime();
        if (isNaN(refTime)) {
          console.error("Invalid reference time");
          return;
        }
        const delay = delayRef.current.delay;
        endTime.current = refTime + delay;
        startTimer();
      } catch (error) {
        console.error("Error starting timer:", error);
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        endTime.current = null;
      };
    }
  }, [delayRef.current.time, delayRef.current.delay, activePlayer]);

  const prevPlayerId = useRef(null);
  const fetchPlayerById = async (dataToGet) => {
    try {
      if (
        dataToGet.roomSize < 2 &&
        remainingPlayers <= 0 &&
        !dataToGet?.playerId
      ) {
        return;
      }

      if (
        prevPlayerId.current != null &&
        dataToGet.playerId === prevPlayerId.current
      )
        return;

      setCurrentBid(0);
      setCurrentBids([]);

      const fetchTeamComposition = async () => {
        try {
          const idSaved = localStorage.getItem("userId");
          const ownTeamId =
            localStorage.getItem(`ownTeamId-${idSaved}-${auctionId}`) || "";

          const composition = await getComposition(Number(ownTeamId));
          setTeamComposition(composition);
        } catch (error) {
          console.error("Error fetching team composition", error);
          setTeamComposition({
            "All Rounder": 0,
            Batsman: 0,
            Bowler: 0,
            "Wicket Keeper": 0,
          });
        }
      };

      fetchTeamComposition();

      const [playerDetails] = await Promise.all([
        getAuctionPlayersByID(dataToGet?.playerId, auctionId),
      ]);

      if (playerDetails) {
        setIsDisabled(false);

        const newActivePlayer = {
          highestBidderId: playerDetails?.highestBidderId,
          ...playerDetails?.player,
          ...dataToGet,
          imageUrl: playerDetails?.imageUrl,
          bonusPoints: playerDetails?.points?.bonus,
          currentBid: playerDetails?.currentBid,
        };

        console.log("newActivePlayer", newActivePlayer);
        console.log("playerDetails", playerDetails);

        if (playerDetails?.highestBidderId === null) {
          latestHighestBidderRef.current = null;
        } else if (playerDetails?.highestBidderId === userId) {
          latestHighestBidderRef.current = userId;
        }

        setActivePlayer(newActivePlayer);
        setActivePlayerId(playerDetails?.id);
        setCurrentBid(playerDetails.currentBid ?? 0);

        prevPlayerId.current = dataToGet.playerId;
      }
    } catch (error) {
      console.error("Error fetching player details:", error);
      toast.error("Some Erorr Occured! Please refresh.");
    }
  };

  function validatePlayerTypeCount(playerTypeCount) {
    const ActivePlayerType = activePlayer?.stats?.type;
    let playerType = ActivePlayerType.split(" ")?.[0];

    if (playerType === "Wicket-Keeper") {
      playerType = "Wicket Keeper";
    } else if (playerType === "All-Rounder") {
      playerType = "All Rounder";
    } else if (playerType === "Batsmen") {
      playerType = "Batsman";
    }

    const MAX_PLAYERS = 11;
    const rules = {
      Batsman: { min: 3, max: 4 },
      Bowler: { min: 4, max: 4 },
      "Wicket Keeper": { min: 1, max: 2 },
      "All Rounder": { min: 1, max: 2 },
    };

    const totalPlayers = Object.values(playerTypeCount).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalPlayers >= MAX_PLAYERS) {
      return {
        valid: false,
        message: "Total players exceed the maximum allowed limit of 11.",
      };
    }

    if (rules[playerType]) {
      const { max } = rules[playerType];
      const currentCount = playerTypeCount[playerType] || 0;

      if (currentCount >= max) {
        return {
          valid: false,
          message: `You cannot have more than ${max} ${playerType}(s).`,
        };
      }
    }

    return { valid: true, message: "Player selection is valid." };
  }

  const fetchAllPlayerInAuction = useCallback(
    async (p_id = undefined) => {
      if (remainingPlayers < 1) return;
      try {
        const res = await getAllPLayersInAuction(auctionId);
        if (res?.players) {
          setAuctionPlayers(res?.players);

          const purseLeft = res?.players.reduce((acc, player) => {
            if (
              player?.highestBidderId !== null &&
              player?.highestBidderId === userId
            ) {
              return acc + player.currentBid;
            }
            return acc;
          }, 0);

          setBudget((prev) => ({
            ...prev,
            remaining: budget.total - purseLeft,
          }));

          if (p_id) {
            setIsPulling((prev) => {
              const newMap = new Map(prev);
              newMap.set(p_id, false);
              return newMap;
            });
          }
        }
      } catch (error) {
        console.error("error", error);
      }
    },
    [auctionId, remainingPlayers, userId, budget.total]
  );

  useEffect(() => {
    fetchAllPlayerInAuction();
  }, [fetchAllPlayerInAuction]);

  // ----------------------------------------------------------

  const handleInputChange = (e) => {
    const input = e.target.value;
    const numericValue = input
      ?.replace(/[^0-9.]/g, "")
      ?.replace(/(\..*?)\..*/g, "$1");
    if (numericValue.startsWith(".")) {
      setValue("0" + numericValue);
    } else {
      setValue(numericValue);
    }
  };

  const handleJumpCount = () => {
    if (jump > currentBid && jump <= budget.remaining) {
      handlePlaceBid(jump, "jump");
    } else {
      jump < currentBid &&
        toast.error("Bid amount cannot be less than current bid!");
      jump > budget.remaining &&
        toast.error("Your purse is less than bid amount!");
    }
  };

  const [isPulling, setIsPulling] = useState(new Map());

  const handlePullBackPlayer = (auctionId, item) => {
    setIsPulling((prev) => new Map(prev).set(item, true));
    SocketService.emitPullBackPlayer(auctionId, item);
  };

  const setupSocketListeners = () => {
    SocketService.onRoomSize((data) => {
      if (data.roomSize >= 2 && auctionStarted.current === true) {
        SocketService.emitGetActivePlayer();
      }
      setRoomSize(data.roomSize);
    });

    SocketService.onActivePlayer((data) => {
      delayRef.current.time = data?.time;
      if (data?.delay === 15) {
        delayRef.current.delay = 16 * 1000;
      } else {
        delayRef.current.delay = 21 * 1000;
      }
      fetchPlayerById(data);
      fetchAllPlayerInAuction();
    });

    SocketService.onPlayerStatusChanged((data) => {
      toast.success("One Player is Pulled Back!");
      const p_id = data?.auctionPlayerId;
      fetchAllPlayerInAuction(p_id);

      SocketService.emitGetActivePlayer();
      SocketService.emitGetPlayerCount();
    });

    SocketService.onAskNewPlayer((data) => {
      if (data?.status === "SOLD") {
        SocketService.emitGetActivePlayer();
        let name = auctionPlayers?.find((it) => it.id == data?.auctionPlayerId)
          ?.player.name;
        if (!name) name = data?.auctionPlayerId;
        toast.success(
          `${name} is Sold Successfully to ${
            participantMapRef.current[data?.userId] || data?.userId
          }`
        );
      } else if (data?.status === "UNSOLD") {
        SocketService.emitGetActivePlayer();
        let name = auctionPlayers?.find((it) => it.id == data?.auctionPlayerId)
          ?.player.name;
        if (!name) name = data?.auctionPlayerId;
        toast.error(`${name} is unsold!`);
      }
      SocketService.emitGetPlayerCount();
    });

    SocketService.onPlayerCount((data) => {
      setRemainingPlayers(data?.count);
    });

    SocketService.onNewUserConnected(() => {
      SocketService.emitGetRoomSize();
      SocketService.emitGetPlayerCount();
      if (auctionStarted.current === true) {
        SocketService.emitGetActivePlayer();
      }
    });

    SocketService.onPlayerReAdded((data) => {
      toast.error(`${data?.message}`);
      fetchAllPlayerInAuction();
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
      setCurrentBids(sliced);
    });

    // SocketService.onPlayerPulledBack((data) => {
    //   toast.success("Player Pulled Back Successfully!");
    //   const p_id = data?.auctionPlayerId;
    //   fetchAllPlayerInAuction(p_id);

    //   SocketService.emitGetActivePlayer();
    //   SocketService.emitGetPlayerCount();
    // });

    SocketService.onUserDisconnected(() => {
      prevPlayerId.current = null;
      SocketService.emitGetRoomSize();
      SocketService.emitGetPlayerCount();
      if (auctionStarted.current === true && timeUntilStart === null) {
        SocketService.emitGetActivePlayer();
      }
    });

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
      if (data.userId !== userId) {
        setNewNotification(true);
      }
      setChats((prevChats) => [...prevChats, newChat]);
    });

    SocketService.onNewBid((data) => {
      if (!data) return;

      if (bidPromiseRef.current) {
        if (data.amount && data.timestamp && data.delay) {
          bidPromiseRef.current.resolve(data);

          delayRef.current.time = data?.timestamp;
          delayRef.current.delay = data.delay - 500;
        } else {
          bidPromiseRef.current.reject(new Error("Invalid bid response"));
        }
        bidPromiseRef.current = null;
      } else {
        if (data.timestamp && data.delay) {
          delayRef.current.time = data?.timestamp;
          delayRef.current.delay = data.delay - 500;
        }
        setIsDisabled(false);
        toast.success(`${data.amount}Cr Bid is placed`);
      }

      latestHighestBidderRef.current = data?.highestBidderId;

      const remaining = data?.remainingPlayerCount;
      setRemainingPlayers(remaining);

      setCurrentBid(data.amount);
    });

    SocketService.onError((error) => {
      if (bidPromiseRef.current) {
        bidPromiseRef.current.reject(
          new Error(error.message || "Bid placement failed")
        );
        bidPromiseRef.current = null;
      }
      console.error(error);
      setError(error.message);
    });

    return () => {
      SocketService.removeAllListeners();
    };
  };

  const setupSocketConnection = async (token, auctionId) => {
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

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const response = await setupSocketConnection(token, auctionId);

        if (response.connected) {
          setIsConnected(true);
          if (error !== "Previous session not terminated!") {
            SocketService.emitGetPlayerCount();
            setupSocketListeners();
          }
        }
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    const parseCustomDate = (dateString) => {
      const [datePart, timePart] = dateString.split(", ");
      const [day, month, year] = datePart.split("/");
      const date = new Date(year, month - 1, day);
      if (timePart) {
        const [hours, minutes, seconds] = timePart.split(":");
        date.setHours(hours, minutes, seconds);
      }

      return date;
    };

    const checkAuctionStart = () => {
      if (!auctionData?.startTime) return;

      const startTime = parseCustomDate(auctionData?.startTime);
      const bufferTime = 5 * 60 * 1000;
      let now = new Date();

      console.log("NOW_!", now);
      syncTimeWithServer(now.getTime()).then((serverTime) => {
        console.log(now.getTime(), now.getTime() + serverTime, "NOW_____((");
        now = new Date(now.getTime() + serverTime);
      });

      console.log("NOW_@!", now);
      if (now >= new Date(startTime.getTime() + bufferTime)) {
        auctionStarted.current = true;
        SocketService.emitGetActivePlayer();
        SocketService.emitGetBudget();
        SocketService.emitGetRoomSize();
      } else {
        const timeLeft =
          new Date(startTime.getTime() + bufferTime) - now.getTime();
        setTimeUntilStart(Math.max(0, timeLeft));

        const countdownInterval = setInterval(() => {
          setTimeUntilStart((prevTime) => {
            const newTime = Math.max(0, prevTime - 1000);

            if (newTime === 0) {
              clearInterval(countdownInterval);
              auctionStarted.current = true;
              SocketService.emitGetActivePlayer();
              SocketService.emitGetBudget();
            }

            return newTime;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      }
    };

    initializeSocket();
    checkAuctionStart();

    return () => {
      console.log("Cleaning up socket connection...");
      setIsConnected(false);
      SocketService.disconnect();
    };
  }, [auctionId, token, auctionData?.startTime]);

  const isUserHighestBidder = () => {
    if (latestHighestBidderRef.current === userId) {
      setIsDisabled(true);
      return true;
    }

    if (activePlayer?.highestBidderId === userId) {
      setIsDisabled(true);
      return true;
    }

    return false;
  };

  const handlePlaceBid = (amount, type) => {
    if (timeLeft < 1) {
      toast.error("Time is up! Cannot place bid now.");
      return;
    }

    setIsDisabled(true);
    if (isUserHighestBidder()) {
      setIsDisabled(false);
      toast.error("You are already the highest bidder!");
      return;
    }

    const isCompositionValid = validatePlayerTypeCount(teamComposition);
    if (isCompositionValid?.valid !== true) {
      setIsDisabled(false);
      toast.error(`${isCompositionValid?.message}`);
      return;
    }

    if (type == "increment" && amount + currentBid > budget.remaining) {
      toast.error("Not enough money in purse");
      setIsDisabled(false);
      return;
    }

    const promise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (bidPromiseRef.current) {
          bidPromiseRef.current = null;
          reject(new Error("Bid request timed out. Please try again."));
        }
      }, 10000);

      bidPromiseRef.current = {
        resolve: (data) => {
          clearTimeout(timeoutId);
          resolve(data);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      };

      if (type == "increment") {
        placeBid(amount, "increment");
      } else if (type == "jump") {
        placeBid(amount, "jump");
      }
    });

    toast.promise(
      promise,
      {
        loading: "Placing your bid...",
        success: (data) => {
          setIsDisabled(false);
          return `${data.amount}Cr Bid is Placed!`;
        },
        error: (err) => {
          setIsDisabled(false);
          return err.message || "Bid placement failed!";
        },
      },
      {
        success: { duration: 4000 },
        error: { duration: 4000 },
      }
    );

    promise.catch((err) => {
      setIsDisabled(false);
      console.error("Bid placement failed:", err);
    });
  };

  const placeBid = (amnt, type) => {
    const amount = !isNaN(Number(amnt)) ? Number(amnt) : 0;

    if (!isConnected || !activePlayer || roomSize < 2 || remainingPlayers < 1) {
      return;
    }

    if (activePlayer?.highestBidderId === userId) {
      toast.error("You are already the highest bidder!");
      return;
    }

    console.log("placing bid....", amount, type, currentBid);

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
      if (amount <= currentBid) {
        toast.error("Cannot Jump! Amount Error");
        return;
      }
      if (activePlayerId) {
        SocketService.emitBid(activePlayerId, amount);
      }
    }
  };

  const updateAuctionEndTime = async (auctionId) => {
    try {
      const response = await updateEndTime(auctionId);
      if (response) {
        console.log("EndTime Updated", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const handleOpenRulesModal = () => {
    setRulesModalOpen(true);
  };

  const closeRulesModal = () => {
    setRulesModalOpen(false);
  };

  useEffect(() => {
    if (
      auctionId &&
      arePlayerRegistered !== 0 &&
      remainingPlayers <= 1 &&
      isConnected &&
      auctionData?.isEndTimeUpdated === false
    ) {
      updateAuctionEndTime(auctionId);
    }
  }, [
    arePlayerRegistered,
    remainingPlayers,
    isConnected,
    auctionId,
    auctionData?.isEndTimeUpdated,
  ]);

  if (auctionStarted.current !== true && timeUntilStart !== null) {
    const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return (
      <div className="flex flex-col h-dvh lg:h-screen">
        <Header
          heading={`${truncateText(auction?.title)}`}
          showRules={true}
          handleOpenRulesModal={handleOpenRulesModal}
        ></Header>

        {rulesModalOpen && <RulesModal closeRulesModal={closeRulesModal} />}

        <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-blue-900">
            Auction Lobby
          </h2>

          <div className="flex flex-col items-center space-y-3 bg-zinc-100/80 rounded-2xl px-12 py-4 shadow-sm border border-zinc-200 hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center text-blue-800">
              <Clock className="w-6 h-6 mr-2 animate-pulse text-blue-600" />
              <span className="font-medium text-lg">Auction starts in</span>
            </div>

            <div className="flex items-center space-x-2 text-5xl font-bold text-blue-900 p-2">
              <span>{formattedHours}</span>
              <span className="text-blue-400">:</span>
              <span>{formattedMinutes}</span>
              <span className="text-blue-400">:</span>
              <span>{formattedSeconds}</span>
            </div>

            <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                {auctionData?.startTime}
              </span>
            </div>
          </div>

          <div className="flex items-center text-gray-900 font-semibold">
            <Radio
              className={`w-6 h-6 mr-2 ${
                isConnected ? "text-green-500" : "text-gray-400"
              }`}
            />
            <span className="text-md">
              {isConnected ? "Connected to auction room" : "Connecting..."}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-md">Room Size: {roomSize}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh lg:h-screen">
      <Header
        heading={`${truncateText(auction?.title)}`}
        showRules={true}
        handleOpenRulesModal={handleOpenRulesModal}
      ></Header>{" "}
      {rulesModalOpen && <RulesModal closeRulesModal={closeRulesModal} />}
      {remainingPlayers > 0 && roomSize >= 2 ? (
        <div className="flex-1 w-full font-sans flex flex-col items-center justify-between relative">
          <div className="flex flex-col justify-end items-center w-full">
            <div className="rounded-lg p-4 mt-4 w-full flex justify-center relative">
              <div className="absolute top-0 left-10">
                <img
                  src={activePlayer?.imageUrl}
                  alt="Player Image"
                  className="w-36 h-36 rounded-full border-4 border-gray-200 bg-zinc-300"
                />
              </div>

              <div className="text-xs text-gray-600 w-[70%] font-medium">
                <p className="border-2 border-b-zinc-200 py-1 px-2 text-end text-red-600 ">
                  {teamComposition != null
                    ? `B${teamComposition?.Batsman ?? 0} | WK${
                        teamComposition["Wicket Keeper"] ?? 0
                      } | AR${teamComposition["All Rounder"] ?? 0} | BOW${
                        teamComposition?.Bowler
                      }`
                    : `B0 | WK0 | AR0 | BOW0`}
                </p>
                <p className="border-2 border-t-zinc-200 py-1 px-2 text-end">
                  {activePlayer?.stats?.type || "N/A"}
                </p>

                <p className="border-2 border-b-zinc-200 py-1 px-2 text-end">
                  Points: {activePlayer?.bonusPoints ?? 0}
                </p>
                <p className="border-2 border-b-zinc-200 py-1 px-2 text-end">
                  Base Price: {activePlayer?.currentBid || "N/A"} {}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <h2 className="text-2xl font-semibold mt-5 text-center">
                {activePlayer?.name || "Fetching player..."}
              </h2>

              <div className="bg-white border border-gray-300 shadow-xl mt-0 m-3 py-4 px-12 rounded-2xl text-center w-fit">
                <h3 className="text-blue-700 text-xl font-semibold">
                  Current Bid
                </h3>
                <p className="text-blue-600 text-3xl font-bold mb-2">
                  {currentBid}

                  <span className="text-xl"> Cr</span>
                </p>

                <p className="text-sm font-semibold">
                  <span>
                    {latestHighestBidderRef.current
                      ? "Highest Bidder: "
                      : "Base Price"}
                  </span>
                  <br />
                  <span className="text-blue-700">
                    {latestHighestBidderRef.current === userId
                      ? "You"
                      : participantMapRef.current[
                          latestHighestBidderRef.current
                        ] ?? latestHighestBidderRef.current}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow mt-4 rounded-lg w-[95%] overflow-hidden">
            <h3 className="text-black font-bold bg-zinc-300 py-2 px-4 text-start text-sm">
              LAST TWO BIDS
            </h3>

            {currentBids.length > 0 ? (
              <table className="w-full text-center py-4 px-4">
                <thead>
                  <tr className="font-bold text-sm">
                    <th className="py-1 px-2"></th>
                    <th className="py-1 px-2">Bid</th>
                    <th className="py-1 px-2">User</th>
                  </tr>
                </thead>

                <tbody className="font-bold">
                  {currentBids.map((bid, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-1 px-4 flex items-center justify-start space-x-3">
                        <img
                          src={
                            teamImageMap[bid?.userId.toString()]?.[0] !== "#"
                              ? teamImageMap[bid?.userId.toString()]?.[0]
                              : "https://placehold.co/600x400"
                          }
                          // alt={`${bid?.team} logo`}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-sm">
                            {teamMap[bid?.userId.toString()]?.[0]}
                          </span>
                        </div>
                      </td>

                      <td className="py-1 px-2 text-sm">{bid?.amount}Cr</td>
                      {/* <td className="py-1 px-2 text-sm">
                        {bid?.User?.username}
                      </td> */}
                      <td className="py-1 px-2 text-sm">
                        {bid?.User?.username}
                      </td>
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

          <div className="bg-white mt-2 p-4 rounded-lg w-full">
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
            } ${expandChat && ` h-[42%]  fixed bottom-0`} w-full bg-white z-40`}
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

                    // if (editJump) {
                    //   setEditJump(false);
                    //   setIsExpanded(false);
                    //   return;
                    // }
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
                      isExpanded || expandChat || expandPullBack
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
                    // setEditJump(false);
                  }}
                >
                  {expandPullBack ? "CLOSE MENU" : "PULL BACK"}
                </button>

                <button
                  onClick={() => {
                    // handleClick();
                    handleJumpClick();
                  }}
                  disabled={
                    isDisabled === true ||
                    budget.remaining < jump ||
                    isUserHighestBidder()
                  }
                  className={`flex-1/4 mx-1 ${
                    isDisabled ||
                    budget.remaining < jump ||
                    isUserHighestBidder()
                      ? `bg-blue-400 cursor-not-allowed`
                      : `bg-blue-700`
                  } text-white py-2 px-3 rounded-3xl flex items-center justify-between gap-1 text-center text-sm sm:text-base font-semibold`}
                >
                  <span className="inline-block text-[0.7rem] w-6 h-6 border-2 border-blue-950 rounded-full bg-white text-blue-700">
                    {jump}Cr
                  </span>
                  JUMP
                </button>

                {showPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-[88%] p-4 border border-gray-200 relative">
                      <button
                        onClick={closePopup}
                        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>

                      <div className="flex flex-col items-center justify-center mb-4">
                        <AlertCircle className="text-yellow-500 w-12 h-12 mb-3" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          Set Jump Amount
                        </h2>
                      </div>

                      <div className="mb-2">
                        <div className="min-h-[40px] text-sm">
                          {value < currentBid && (
                            <p className="text-red-500 text-center">
                              Amount cannot be less than current bid (
                              {currentBid} Cr)
                            </p>
                          )}
                          {value > budget.remaining && (
                            <p className="text-red-500 text-center">
                              Amount cannot exceed your remaining purse (
                              {budget.remaining} Cr)
                            </p>
                          )}
                          {value > currentBid && value <= budget.remaining ? (
                            <p className="text-gray-500 text-center">
                              Enter a value between {currentBid} and{" "}
                              {budget.remaining} Cr
                            </p>
                          ) : (
                            value < budget.remaining && (
                              <p className="text-red-500 text-center">
                                Invalid Jump Amount
                              </p>
                            )
                          )}
                          {value == currentBid && (
                            <p className="text-red-500 text-center">
                              Jump amount should be greater than current bid
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => {
                              handleInputChange(e);
                              setJump(e.target.value);
                            }}
                            className={`w-full px-3 py-2 border ${
                              value < currentBid || value > budget.remaining
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-700"
                            } rounded-lg focus:outline-none focus:ring-2 text-black text-base`}
                            placeholder="Enter amount"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            Cr
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (
                              value >= currentBid &&
                              value <= budget.remaining
                            ) {
                              handleJumpCount();
                              closePopup();
                            } else {
                              toast.error("Invalid jump amount!");
                            }
                          }}
                          className={`px-4 py-2 ${
                            value > currentBid && value <= budget.remaining
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-blue-300 cursor-not-allowed"
                          } text-white rounded-lg transition-colors flex items-center gap-2`}
                        >
                          <CheckCircle className="w-5 h-5" />
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    // handleClick();
                    handlePlaceBid(
                      currentBid < 5 && currentBid >= 0 ? 0.25 : 0.5,
                      "increment"
                    );
                  }}
                  disabled={
                    isDisabled === true ||
                    budget.remaining < 1 ||
                    isUserHighestBidder()
                  }
                  className={`flex-1/4 mx-1 ${
                    isDisabled === true ||
                    budget.remaining < 1 ||
                    isUserHighestBidder()
                      ? `bg-blue-400 cursor-not-allowed`
                      : `bg-blue-700`
                  } text-white py-2 px-3 rounded-3xl text-center text-sm sm:text-base flex items-center justify-between gap-1 font-semibold`}
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
                            idToUsernameMap={participantMapRef.current}
                            pullCount={pullCount}
                            setPullCount={setPullCount}
                            teamMap={teamMap}
                            handlePullBackPlayer={handlePullBackPlayer}
                            pulling={isPulling}
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
                    participantMap={participantMapRef.current}
                    pullCount={pullCount}
                    setPullCount={setPullCount}
                    teamMap={teamMap}
                  />
                )}

                {activeTab === "Upcoming" && (
                  <div className="overflow-y-auto h-[75%] rounded-lg">
                    {auctionPlayers
                      .filter((player) => player.status === "available")
                      .sort((a, b) => {
                        if (a.order !== b.order) {
                          return a.order - b.order;
                        }
                        return (
                          typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
                        );
                      })
                      .map((item, index) => (
                        <div key={item.auctionPlayerId} className="px-4">
                          <PlayerCard
                            tabType={"Upcoming"}
                            item={item}
                            index={index}
                            ongoingPlayerID={activePlayerId}
                            currentUserID={userId}
                            idToUsernameMap={participantMapRef.current}
                            pullCount={pullCount}
                            setPullCount={setPullCount}
                            teamMap={teamMap}
                            handlePullBackPlayer={handlePullBackPlayer}
                            pulling={isPulling}
                          />
                        </div>
                      ))}
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
                      (it) =>
                        it.status === "unsold" &&
                        activePlayerId !== it.id &&
                        !it?.isPullBackOnce
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
                    (it) =>
                      it.status === "unsold" &&
                      activePlayerId !== it.id &&
                      !it?.isPullBackOnce
                  ).length < 1 && "No players to pull back"}
                </div>

                <div className="overflow-y-auto h-[82%] rounded-lg">
                  {auctionPlayers.map((item, index) => {
                    if (
                      item.status !== "unsold" ||
                      activePlayerId === item.id ||
                      item?.isPullBackOnce === true
                    )
                      return;
                    return (
                      <div key={item.id} className="px-4">
                        <PlayerCard
                          tabType={"pullback"}
                          item={item}
                          index={index}
                          ongoingPlayerID={activePlayerId}
                          currentUserID={userId}
                          idToUsernameMap={participantMapRef.current}
                          pullCount={pullCount}
                          setPullCount={setPullCount}
                          teamMap={teamMap}
                          handlePullBackPlayer={handlePullBackPlayer}
                          pulling={isPulling}
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
                    <input
                      type="text"
                      className="flex-grow px-4 py-2 border border-zinc-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />

                    <button onClick={sendMessage}>
                      <Send className="w-6 h-6 text-blue-700" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* {editJump && (
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
            )} */}
          </div>

          <div className="fixed right-2 top-[40%] transform -translate-y-1/2 flex flex-col items-center space-y-4">
            <button className="text-xs w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
              {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
            </button>
            <button
              className="w-10 h-10 relative bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 border-green-600 border text-xs"
              onClick={() => {
                setExpandChat(!expandChat);
                setIsExpanded(false);
                setExpandPullBack(false);
                // setEditJump(false);
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
              <ArrowUpCircle
                className={`h-10 w-10 ${
                  arePlayerRegistered === 0 ? "text-red-500" : "text-blue-500"
                }`}
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Room Status</h1>
            {isConnected ? (
              remainingPlayers < 1 ||
              remainingPlayers === null ||
              remainingPlayers === undefined ? (
                <p className="text-gray-600 mt-2 font-medium my-4">
                  <span className="block font-bold text-3xl">
                    {arePlayerRegistered === 0
                      ? "No Player Found"
                      : error === "Previous session not terminated!"
                      ? ""
                      : "Auction is Ended"}
                  </span>
                  <span className="block">
                    {arePlayerRegistered === 0
                      ? "No player found in this auction!"
                      : error === "Previous session not terminated!"
                      ? "You are already connected from another device to this auction"
                      : "All players have been sold"}
                  </span>
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
                  {arePlayerRegistered === 0
                    ? "No Player Found"
                    : "Auction is Ended"}
                </span>
                <span className="block">
                  {arePlayerRegistered === 0
                    ? "No player found in this auction!"
                    : "All players have been sold"}
                </span>
              </p>
            )}

            {arePlayerRegistered !== 0 &&
            remainingPlayers < 1 &&
            isConnected &&
            error !== "Previous session not terminated!" ? (
              <div className="flex gap-2">
                <button
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-900 focus:ring-2 focus:ring-blue-300 focus:outline-none flex items-center justify-center gap-2"
                  onClick={() => navigate(`/teamPage/${auctionId}/${userId}`)}
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
