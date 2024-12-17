import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.SOCKET_URL =
      // "https://zany-couscous-76pvggx996xfr9gw-3009.app.github.dev/";
      // this.SOCKET_URL = "https://expressbackend-production-b19c.up.railway.app";
      // this.SOCKET_URL = "http://98.130.54.69:3009/";
      this.SOCKET_URL = "https://cricket.skmishra.me/";

  }

  // ------------------------------------------------
  connect(token, auctionId) {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return Promise.resolve(this.socket);
    }

    console.log("Attempting socket connection...", { auctionId, token });

    return new Promise((resolve, reject) => {
      this.socket = io(this.SOCKET_URL, {
        auth: {
          token: token,
          "x-room-lobby": auctionId,
        },
        transports: ["websocket"],
        reconnection: true,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected successfully!", {
          socketId: this.socket.id,
          auctionRoom: auctionId,
        });
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message || error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
      });
    });
  }

  // -----------------------------------------------------

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(eventName, data = {}, callback = () => {}) {
    if (!this.socket?.connected) {
      console.warn(`Cannot emit event "${eventName}": Socket not connected.`);
      return;
    }
    console.log(`Emitting event "${eventName}"...`);
    // console.log(this.socket.emit, "thisss");

    this.socket.emit(eventName, data, (response) => {
      if (response?.success) {
        console.log(`Event "${eventName}" successfully handled by the server.`);
      } else {
        console.error(
          `Failed to handle event "${eventName}" on the server.`,
          response?.error
        );
      }
      callback(response);
    });
  }

  on(eventName, callback) {
    if (!this.socket) {
      console.warn(
        `Cannot listen for event "${eventName}": Socket not initialized.`
      );
      return;
    }
    console.log(`Listening for event "${eventName}...."`);
    this.socket.on(eventName, callback);
  }

  // ------------------------------------------------

  emitGetRoomSize() {
    this.emit("getAuctionRoomSize");
  }

  emitGetActivePlayer() {
    this.socket.emit("getActivePlayer");
  }

  emitGetPlayerCount() {
    this.emit("playerCount");
  }

  // ---------------------------------------------------

  onCurrentBids(callback) {
    this.on("currentPlayerBids", (data) => {
      callback(data);
    });
  }

  playerSold(callback) {
    this.on("playerSold", (data) => {
      callback(data);
    });
  }

  onPlayerReAdded(callback) {
    this.on("playerReAdded", (data) => {
      callback(data);
    });
  }

  // --------------------------------------------------

  onNewUserConnected() {
    this.on("newUserConnected", () => {
      console.log("New user connected................");
      this.emitGetRoomSize();
    });
  }

  onUserDisconnected() {
    this.on("userDisconnected", () => {
      console.log("userDisconnected....socketService");
      this.emitGetRoomSize();
    });
  }

  // -----------------------

  emitBid(auctionPlayerId, biddingAmount) {
    console.log("Emitting bid:", { auctionPlayerId, biddingAmount });
    this.emit("bid", { auctionPlayerId, biddingAmount });
  }

  onNewBid(callback) {
    this.on("newBid", (data) => {
      callback(data);
    });
  }

  // ----------------------------

  emitMarkPlayerUnsold(auctionPlayerId, auctionID) {
    if (auctionID && auctionPlayerId) {
      this.emit("reAddPlayer", { auctionPlayerId, auctionID });
    }
  }

  emitPullBackPlayer(auctionID, auctionPlayerId) {
    if (auctionID && auctionPlayerId) {
      this.emit("pullBackPlayer", { auctionID, auctionPlayerId });
    } else {
      console.error("Provide auctionID && auctionPlayerId");
    }
  }

  onPlayerPulledBack(callback) {
    this.on("playerPulledBack", (data) => {
      callback(data);
    });
  }

  sendChatMessage(text) {
    if (text && text.length > 1) {
      this.emit("sendChatMessage", {
        message: text,
      });
    }
  }

  onReceiveChatMessage(callback) {
    this.on("receiveChatMessage", (data) => {
      callback(data);
    });
  }

  emitGetChatHistory() {
    this.emit("getChatHistory");
  }

  onGetChatHistory(callback) {
    this.on("chatHistory", (data) => {
      callback(data);
    });
  }

  //------------------------------------------

  onError(callback) {
    this.on("error", (error) => {
      console.error("Socket error received:", error);
      callback(error);
    });
  }

  // ---------------------------

  onAskNewPlayer(callback) {
    this.on("askNewPlayer", (data) => {
      callback(data);
    });
  }

  onRoomSize(callback) {
    this.on("auctionRoomSize", (data) => {
      if (data.roomSize >= 2) {
        this.emitGetActivePlayer();
        callback(data);
      } else {
        callback(data);
      }

      console.log("Received room size:", data);
    });
  }

  onActivePlayer(callback) {
    this.on("activePlayerDetail", (data) => {
      callback(data);
    });
  }

  onPlayerCount(callback) {
    this.on("playerCount", (data) => {
      callback(data);
    });
  }

  // ----------------------------

  emitGetBudget() {
    this.emit("getBudget");
  }

  onBudgetUpdate(callback) {
    this.on("budgetUpdate", (data) => {
      callback(data);
    });
  }

  // --------------------------------

  isConnected() {
    return !!this.socket?.connected;
  }
}

export default new SocketService();
