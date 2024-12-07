import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";
let socket = null;

const connect = (token, auctionId) => {
  if (socket?.connected) {
    console.log("Socket already connected");
    return Promise.resolve(socket);
  }

  console.log("Attempting socket connection...", { auctionId });

  return new Promise((resolve, reject) => {
    socket = io(SOCKET_URL, {
      auth: {
        token,
        roomId: auctionId.toString()
      }
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully!", {
        socketId: socket.id,
        auctionRoom: auctionId,
      });
      resolve(socket);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message || error);
      reject(error);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });
  });
};

const disconnect = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};

const emit = (eventName, data = {}, callback = () => {}) => {
  if (!socket?.connected) {
    console.warn(`Cannot emit event "${eventName}": Socket not connected.`);
    return;
  }
  console.log(`Emitting event "${eventName}" with data:`, data);

  socket.emit(eventName, data, (response) => {
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
};

const on = (eventName, callback) => {
  if (!socket) {
    console.warn(
      `Cannot listen for event "${eventName}": Socket not initialized.`
    );
    return;
  }
  console.log(`Listening for event "${eventName}"`);
  socket.on(eventName, callback);
};

const SocketService = {
  connect,
  disconnect,
  emit,
  on,
  
  joinAuctionRoom: (auctionId) => emit('joinAuctionRoom', { auctionId }),
  
  placeBid: (auctionPlayerId, biddingAmount) => 
    emit('bid', { auctionPlayerId, biddingAmount }),
  
  onNewBid: (callback) => on('newBid', callback),
  onActivePlayer: (callback) => on('activePlayerDetail', callback),
  onRoomUpdate: (callback) => on('roomUpdate', callback),
  onError: (callback) => on('error', callback),
  
  getActivePlayer: () => {
    emit('getActivePlayer');
  },
  
  isConnected: () => !!socket?.connected,
};

export default SocketService;