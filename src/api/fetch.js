import { axiosInstance } from "./axiosInstance";
import { axiosInstanceAdmin } from "./axiosInstance";

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
    // const response = await axiosInstance.get("/auctions/getall");
    const response = await axiosInstance.get("/auctions/getallstatus");

    if (response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching auction players:", error);
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
    console.error("Error getAuctionsOfUser", error);
    throw error;
  }
};

export const getAllTeamsInAuction = async (auctionId) => {
  try {
    const response = await axiosInstance.get(`/auction/${auctionId}/teams`);
    if (response) return response?.data;
  } catch (error) {
    console.error("Error getAllTeamsInAuction", error);
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
    return error?.response?.data;
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
    console.error("Error updating priority", error);
    throw error;
  }
};

export const RegisterPlayerToIndividualAuction = async (data) => {
  try {
    const response = await axiosInstance.post(`/players/register-to-auctions-2`, {
      playerData: data?.playerData,
      auctionIds: data?.auctionIds,
    });
    if (response?.status === 200) {
      console.log(response?.data);
      return response?.data;
    }
    console.log(response?.data);
  } catch (error) {
    console.error("Error Admin", error);
    throw error;
  }
};

// ----------------------------------ADMIN----Routes-------------------------------------------------

export const getTransactionHistory = async () => {
  try {
    const response = await axiosInstanceAdmin.get("/admin/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching auction players:", error);
    throw error;
  }
};

export const getAllPendingWithdrawlRequests = async () => {
  try {
    const response = await axiosInstanceAdmin.post("/admin/wallet-requests", {
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
    const response = await axiosInstanceAdmin.post("/admin/wallet-requests", {
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
    const response = await axiosInstanceAdmin.post(
      "/admin/update/wallet-requests",
      {
        transactionId: id,
        action: "APPROVED",
      }
    );
    if (response) return response;
  } catch (error) {
    console.error("Error fetching getAllPendingWithdrawalRequests:", error);
    throw error;
  }
};

export const getRegistrationrequest = async () => {
  try {
    const response = await axiosInstanceAdmin.get(
      `/admin/registration-requests`
    );
    if (response) return response?.data;
  } catch (error) {
    console.error("Error getRegistrationrequest", error);
    throw error;
  }
};

export const updateRegistrationRequest = async (requestId, type) => {
  try {
    const response = await axiosInstanceAdmin.post(
      `/admin/update-registration-request`,
      {
        requestId: requestId,
        action: type === 1 ? "APPROVED" : "DENIED",
      }
    );
    if (response) return response?.data;
  } catch (error) {
    console.error("Error updateRegistrationRequest of User", error);
    throw error;
  }
};

export const Admin_Login = async (data) => {
  try {
    const response = await axiosInstanceAdmin.post(`/admin-login`, {
      data: JSON.stringify(data),
    });
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.error("Error Login Admin", error);
    throw error;
  }
};

export const banUnbanUsers = async (userId, type) => {
  try {
    const response = await axiosInstanceAdmin.post(`/admin/users/ban-unban`, {
      userId,
    });
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.error("Error Login Admin", error);
    throw error;
  }
};

export const updateEndTime = async (auctionId) => {
  try {
    const response = await axiosInstance.patch(`auction/${auctionId}/endtime`);
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.error("Error Login Admin", error);
    throw error;
  }
};

export const updateAuctionDetails = async (formData) => {
  try {
    const {
      title,
      registrationFee,
      description,
      startTime,
      scheduledDate,
      image,
      budgetLimit,
      auctionId,
      status,
    } = formData;

    if (!auctionId) {
      console.error("Error! auctionId not received");
      return;
    }

    const response = await axiosInstanceAdmin.put(`/auctions/update`, {
      title,
      registrationFee: Number(registrationFee),
      description,
      status,
      startTime,
      scheduledDate,
      image,
      auctionId,
      budgetLimit: Number(budgetLimit),
      token: localStorage.getItem("adminToken") || "",
    });

    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error("Error updating auction", error);
    throw error;
  }
};

// -------------------------------------------------------------------------------

export const createNewAuction = async ({ formData, imagePreview }) => {
  try {
    const {
      title,
      registrationFee,
      description,
      startTime,
      scheduledDate,
      budgetLimit,
    } = formData;

    const response = await axiosInstanceAdmin.post(`/auctions/register`, {
      title,
      registrationFee: Number(registrationFee),
      description,
      startTime,
      scheduledDate,
      budgetLimit: Number(budgetLimit),
      token: localStorage.getItem("adminToken") || "",
    });

    if (response?.data?.auction?.id && imagePreview) {
      const auctionId = response.data.auction.id;

      const imageBlob = await (await fetch(imagePreview)).blob();

      const formData = new FormData();
      formData.append("auctionId", auctionId);
      formData.append("file", imageBlob, "auction-image.jpg");

      const imageRes = await axiosInstanceAdmin.post(
        "upload/auctionImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image upload response", imageRes);
    }

    return response?.data;
  } catch (error) {
    console.error("Error creating auction", error);
    throw error;
  }
};

export const submitRegistrationRequest = async (formData, imagePreview) => {
  try {
    if (imagePreview) {
      const imageBlob = await (await fetch(imagePreview)).blob();
      formData.append("file", imageBlob, "team-icon.jpg");
    }

    const response = await axiosInstance.post(
      `/auctions/registration-2`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error creating auction", error);
    throw error;
  }
};

// ----------------------------------OTHER---NEW-------------------------

export const fetchAnalyticsData = async () => {
  try {
    const endpoints = [
      "/admin/analytics/total-auctions",
      "/admin/analytics/bids-per-user",
      "/admin/analytics/successful-registrations",
      "/admin/analytics/registrations-per-auction",
      "/admin/analytics/all-registration-requests",
      "/admin/analytics/event-completion-rate",
      "/admin/analytics/financial-summary",
    ];

    const responses = await Promise.all(
      endpoints.map((endpoint) => axiosInstanceAdmin.get(endpoint))
    );

    const data = responses.map((response) => response.data);
    return {
      totalAuctions: data[0],
      bidsPerUser: data[1],
      successfulRegistrations: data[2],
      registrationsPerAuction: data[3],
      allRegistrationRequests: data[4],
      eventCompletionRate: data[5],
      financialSummary: data[6],
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

export const getTeamByTeamId = async (teamId) => {
  try {
    const response = await axiosInstanceAdmin.post(`/team/details`, {
      teamId,
    });
    if (response?.status === 200) {
      console.log(response?.data);
      return response?.data;
    }
    console.log(response?.data);
  } catch (error) {
    console.error("Error fetching team by teamId", error);
    throw error;
  }
};
