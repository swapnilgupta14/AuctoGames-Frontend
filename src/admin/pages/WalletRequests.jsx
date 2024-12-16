import React, { useEffect, useState } from "react";
import { ClockIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  getAllPendingWithdrawlRequests,
  approveWithdrawlRequest,
  getAllPendingRechargeRequests,
} from "../../api/fetch";

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
    <div className="animate-spin">
      <svg
        className="w-10 h-10 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        ></path>
      </svg>
    </div>
  </div>
);

const WalletRequests = () => {
  const [withdrawlRequests, setWithdrawlRequests] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const fetchWithrawlRequests = async () => {
    try {
      const res = await getAllPendingWithdrawlRequests();
      if (res?.status === 200) {
        setWithdrawlRequests(res?.data?.walletRequests);
      } else {
        setError("Error fetching the Withdrawal requests");
      }
    } catch (err) {
      setError("Error fetching the Withdrawal requests");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRechargeRequests = async () => {
    try {
      const res = await getAllPendingRechargeRequests();
      if (res?.status === 200) {
        setRechargeRequests(res?.data?.walletRequests);
      } else {
        setError("Error fetching the Recharge requests");
      }
    } catch (err) {
      setError("Error fetching the Recharge requests");
    } finally {
      setIsLoading(false);
    }
  };

  const approverequest = async (transactionId) => {
    setIsApproving(true);
    try {
      const request = await approveWithdrawlRequest(transactionId);
      if (request?.status === 200) {
        await fetchRechargeRequests();
        await fetchWithrawlRequests();
      } else {
        setError("Sorry! Request cannot be approved");
      }
    } catch (err) {
      setError("Sorry! Request cannot be approved");
    } finally {
      setIsApproving(false);
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
    <div className="border rounded-lg shadow-md flex flex-col relative">
      {isLoading && <Loader />}
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

      {requests.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 py-4">
          No {type.toLowerCase()} requests
        </div>
      ) : (
        <div className="h-full">
          <div className=" overflow-y-auto">
            <ul className="divide-y">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="p-4 hover:bg-gray-200 transition-colors"
                >
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex-1 text-sm">
                      <span className="font-medium text-gray-800">
                        {request.wallet.user.username}
                      </span>
                      <p>
                        Amount:{" "}
                        <span
                          className={`font-medium ${
                            type === "Withdrawal"
                              ? "text-red-800"
                              : "text-green-700"
                          }`}
                        >
                          ₹
                          {type === "Withdrawal"
                            ? Math.abs(request.amount)
                            : request.amount}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onApprove(request.id)}
                        disabled={isApproving}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={isApproving}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4">
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
