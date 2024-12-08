import axiosInstance from "./axiosInstance";

export const fetchAuctionPlayers = async (playerId, auctionId) => {
  try {
    const response = await axiosInstance.get("/auction-players", {
      params: { playerId, auctionId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching auction players:", error);
    throw error;
  }
};

export const fetchplayers = async () => {
  try {
    const response = await axiosInstance.get("/players");
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Auction not found");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users/getAll");
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Auction not found");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getBidHistoryOfPlayers = async (activePlayerId) => {
  try {
    const response = await axiosInstance.get(
      `/auction-players/${activePlayerId}/bids`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Auction not found");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAuctionPlayersByID = async (playerId, auctionId) => {
  try {
    const response = await axiosInstance.get(
      `auction-players?playerId=${playerId}&auctionId=${auctionId}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Auction not found");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllPLayersInAuction = async (auctionID) => {
  try {
    const response = await axiosInstance.get(`auctions/${auctionID}/players`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Auction not found");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const clearBids = async (auctionId, auctionPlayerId) => {
  try {
    const payload = {
      auctionId,
      auctionPlayerId,
    };

    const response = await axiosInstance.post("bids/clear", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Endpoint not found");
      } else if (error.response.status === 400) {
        throw new Error("Bad request - invalid input data");
      } else if (error.response.status === 500) {
        throw new Error("Server error");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getTeamResultOfAction = async (auctionId, userId) => {
  try {
    const num_auctionId = Number(auctionId);
    const num_userId = Number(userId);

    const payload = {
      auctionId: num_auctionId,
      userId: num_userId,
    };

    const response = await axiosInstance.post(
      "teams/by-user-and-auction",
      payload
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Endpoint not found");
      } else if (error.response.status === 400) {
        throw new Error("Bad request - invalid input data");
      } else if (error.response.status === 500) {
        throw new Error("Server error");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

// Wallet

export const getWalletBalance = async (userId) => {
  try {
    const response = await axiosInstance.post("/wallet/balance", {
      userId: userId,
    });
    if (response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Endpoint not found");
      } else if (error.response.status === 400) {
        throw new Error("Bad request - invalid input data");
      } else if (error.response.status === 500) {
        throw new Error("Server error");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postRechargeRequest = async (userId, amount) => {
  try {
    const response = await axiosInstance.post("/wallet/recharge-request", {
      userId: userId,
      amount: amount,
    });
    if (response?.status === 201) {
      return response?.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Endpoint not found");
      } else if (error.response.status === 400) {
        throw new Error("Bad request - invalid input data");
      } else if (error.response.status === 500) {
        throw new Error("Server error");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postWithdrwalRequest = async (userId, amount) => {
  try {
    const response = await axiosInstance.post("/wallet/withdraw-request", {
      userId: userId,
      amount: amount,
    });
    if (response?.status === 201) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Endpoint not found");
      } else if (error.response.status === 400) {
        throw new Error("Bad request - invalid input data");
      } else if (error.response.status === 500) {
        throw new Error("Server error");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchTransactionHistory = async (userId) => {
  try {
    const response = await axiosInstance.post("/wallet/transaction-history", {
      userId: userId,
    });
    if (response) return response;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
  }
};

// Admin API

export const getAllAuctions = async () => {
  try {
    const response = await axiosInstance.get("/auctions/getall");
    if (response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching auction players:", error);
    throw error;
  }
};

export const getTransactionHistory = async () => {
  try {
    const response = await axiosInstance.get("/admin/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching auction players:", error);
    throw error;
  }
};

export const getAllPendingWithdrawlRequests = async () => {
  try {
    const response = await axiosInstance.post("/admin/wallet-requests", {
      status: "PENDING",
      type: "WITHDRAWAL",
    });
    if (response) return response;
  } catch (error) {
    console.error("Error fetching getAllPendingWithdrawalRequests:", error);
    throw error;
  }
};

export const getAllPendingRechargeRequests = async () => {
  try {
    const response = await axiosInstance.post("/admin/wallet-requests", {
      status: "PENDING",
      type: "RECHARGE",
    });
    if (response) return response;
  } catch (error) {
    console.error("Error fetching getAllPending Recharge Requests:", error);
    throw error;
  }
};

export const approveWithdrawlRequest = async (id) => {
  try {
    const response = await axiosInstance.post("/admin/update/wallet-requests", {
      transactionId: id,
      action: "APPROVED",
    });
    if (response) return response;
  } catch (error) {
    console.error("Error fetching getAllPendingWithdrawalRequests:", error);
    throw error;
  }
};

export const getStaticData = async (type) => {
  try {
    const response = await axiosInstance.get(`/static-content/${type}`);
    if (response) return response?.data;
  } catch (error) {
    console.error("Error fetching Static Data:", error);
    throw error;
  }
};

export const updateStaticData = async (type, content) => {
  try {
    const response = await axiosInstance.post("/static-content", {
      type: type,
      content: content,
    });
    if (response) return response;
  } catch (error) {
    console.error("Error updating static data:", error);
    throw error;
  }
};

export const validateAuctionRegistration = async (auctionId, userId) => {
  try {
    const response = await axiosInstance.post(
      "/auctions/validate-registration",
      {
        auctionId: auctionId,
        userId: userId,
      }
    );
    if (response) return response?.data;
  } catch (error) {
    console.error("Error Validating User", error);
    throw error;
  }
};

// mew

export const getAuctionsOfUser = async (userId) => {
  try {
    const response = await axiosInstance.post("/users/auction-registered", {
      userId: userId,
    });
    if (response) return response?.data;
  } catch (error) {
    console.error("Error Validating User", error);
    throw error;
  }
};

export const getAllTeamsInAuction = async (auctionId) => {
  try {
    const response = await axiosInstance.get(`/auction/${auctionId}/teams`);
    if (response) return response?.data;
  } catch (error) {
    console.error("Error Validating User", error);
    throw error;
  }
};

export const checkTeamComposition = async (teamId) => {
  try {
    const response = await axiosInstance.post(`/teams/validate-composition`, {
      teamId: teamId,
    });
    if (response) return response?.data;
  } catch (error) {
    console.error("Error Validating User", error);
    throw error;
  }
};

export const priorityUpdate = async (teamId, auctionId, arr) => {
  try {
    const response = await axiosInstance.post(`/teams/set-priority`, {
      teamId: teamId,
      auctionId: Number(auctionId),
      priorityOrder: arr,
    });
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error("Error Validating User", error);
    throw error;
  }
};
