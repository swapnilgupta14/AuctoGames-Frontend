import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  RefreshCw,
} from "lucide-react";
import {
  getAllPendingWithdrawlRequests,
  approveWithdrawlRequest,
  getAllPendingRechargeRequests,
} from "../../api/fetch";

const WalletRequests = () => {
  const [withdrawlRequests, setWithdrawlRequests] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const fetchWithrawlRequests = async () => {
    setIsLoading(true);
    const res = await getAllPendingWithdrawlRequests();
    if (res?.status === 200) {
      setIsLoading(false);
      setWithdrawlRequests(res?.data?.walletRequests);
    } else {
      setError("Error fetching the Withdrawal requests");
      setIsLoading(false);
    }
  };

  const fetchRechargeRequests = async () => {
    setIsLoading(true);
    const res = await getAllPendingRechargeRequests();
    if (res?.status === 200) {
      setIsLoading(false);
      setRechargeRequests(res?.data?.walletRequests);
    } else {
      setError("Error fetching the Recharge requests");
      setIsLoading(false);
    }
  };

  const approverequest = async (transactionId) => {
    setIsApproving(true);
    const request = await approveWithdrawlRequest(transactionId);
    if (request?.status === 200) {
      setIsApproving(false);
      await fetchRechargeRequests();
      await fetchWithrawlRequests();
    } else {
      setIsApproving(false);
      setError("Sorry! Request cannot be approved");
    }
  };

  useEffect(() => {
    fetchWithrawlRequests();
    fetchRechargeRequests();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const RequestCard = ({ requests, title, type, onApprove }) => (
    <div className="bg-white border rounded-lg shadow-md flex flex-col h-full">
      <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg tracking-tight text-gray-900 font-semibold flex items-center">
          {type === "Withdrawal" ? (
            <ArrowDownIcon className="w-5 h-5 mr-2 text-red-500" />
          ) : (
            <ArrowUpIcon className="w-5 h-5 mr-2 text-green-500" />
          )}
          {title}
          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
            {requests.length}
          </span>
        </h2>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <RefreshCw className="animate-spin text-gray-500" size={36} />
          <p>Loading...</p>
        </div>
      )}
      {requests.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 py-4">
          No {type.toLowerCase()} requests
        </div>
      ) : (
        <div className="min-h-[calc(100vh-100px)] overflow-y-auto flex-grow">
          <ul className="divide-y">
            {requests.map((request) => (
              <li
                key={request.id}
                className="p-4 hover:bg-gray-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-900 font-medium truncate">
                        {request.wallet.user.username}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        Amount:
                        <span
                          className={`ml-1 ${
                            type === "Withdrawal"
                              ? "text-red-800"
                              : "text-green-700"
                          } font-medium`}
                        >
                          ₹
                          {type === "Withdrawal"
                            ? Math.abs(request.amount)
                            : request.amount}
                        </span>
                      </p>
                      <p>Wallet Balance: ₹{request.wallet.balance}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 mr-3">
                    <button
                      onClick={() => onApprove(request.id)}
                      disabled={isApproving}
                      className="w-full px-3 py-1.5 bg-green-50 border border-green-500 text-green-600 
                    rounded-md text-xs hover:bg-green-100 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      disabled={isApproving}
                      className="w-full px-3 py-1.5 bg-red-50 border border-red-400 text-red-600 
                    rounded-md text-xs hover:bg-red-100 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          <RequestCard
            requests={rechargeRequests}
            title="Recharge Requests"
            type="Recharge"
            onApprove={approverequest}
          />
          <RequestCard
            requests={withdrawlRequests}
            title="Withdrawal Requests"
            type="Withdrawal"
            onApprove={approverequest}
          />
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletRequests;
