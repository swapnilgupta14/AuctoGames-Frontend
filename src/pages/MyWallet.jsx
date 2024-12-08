import { useState, useEffect } from "react";
import {
  getWalletBalance,
  postRechargeRequest,
  postWithdrwalRequest,
  fetchTransactionHistory,
} from "../api/fetch";
import { useSelector } from "react-redux";
import { PlusCircle, MinusCircle, RefreshCw, X, Loader2 } from "lucide-react";
import Header from "../components/Header";
import toast from "react-hot-toast";

const TransactionCardList = ({
  isTransactionLoading,
  transactions,
  formatDate,
}) => {
  const getAmountClass = (amount) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  if (isTransactionLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
        <RefreshCw className="animate-spin text-gray-500" size={36} />
        <p>Loading...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No transactions yet</div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-full space-y-3 pr-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                {formatDate(transaction.createdAt)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded 
                  ${
                    transaction.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
              >
                {transaction.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-sm font-medium px-2 py-1 rounded
                  ${
                    transaction.type === "RECHARGE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {transaction.type}
              </span>
              <span
                className={`text-base font-semibold ${getAmountClass(
                  transaction.amount
                )}`}
              >
                ₹{Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MyWallet = () => {
  const { userId } = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      setIsTransactionLoading(true);
      setError(null);
      try {
        const balanceRes = await getWalletBalance(userId);
        setBalance(balanceRes.balance);

        const historyRes = await fetchTransactionHistory(userId);
        setTransactions(historyRes?.data?.transactions || []);
      } catch (error) {
        console.error("Failed to fetch wallet data", error);
        toast.error("Failed to load wallet information. Please try again.");
      } finally {
        setIsTransactionLoading(false);
      }
    };

    fetchWalletData();
  }, [userId]);

  const fetchTransaction = async (userId) => {
    setIsTransactionLoading(true);
    setError(null);
    try {
      const historyRes = await fetchTransactionHistory(userId);
      setTransactions(historyRes?.data?.transactions || []);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
      toast.error("Failed to load wallet information. Please try again.");
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const validateAndOpenRechargeModal = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) < 1) {
      toast.error("Invalid, recharge amount");
      return;
    }
    setShowRechargeModal(true);
  };

  const validateAndOpenWithdrawModal = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 1) {
      toast.error("Invalid, withdrawal amount");
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setShowWithdrawModal(true);
  };

  const handleRecharge = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await postRechargeRequest(userId, parseFloat(rechargeAmount));
      if (res) {
        setRechargeAmount("");
        setShowRechargeModal(false);
        fetchTransaction(userId);
      }
    } catch (error) {
      console.error("Recharge failed", error);
      toast.error(error.response?.data?.message || "Recharge request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await postWithdrwalRequest(
        userId,
        parseFloat(withdrawAmount)
      );
      if (res) {
        setWithdrawAmount("");
        setShowWithdrawModal(false);
        fetchTransaction(userId);
      }
    } catch (error) {
      console.error("Withdrawal failed", error);
      toast.error(error.response?.data?.message || "Withdrawal request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const RechargeModal = () => (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowRechargeModal(false)}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[90%] bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">
            Confirm Recharge
          </h2>
          <button
            onClick={() => setShowRechargeModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Are you sure you want to add ₹{rechargeAmount} to your wallet?
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowRechargeModal(false)}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleRecharge}
            disabled={isLoading}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );

  const WithdrawModal = () => (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowWithdrawModal(false)}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[90%] bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-800">
            Confirm Withdrawal
          </h2>
          <button
            onClick={() => setShowWithdrawModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Are you sure you want to withdraw ₹{withdrawAmount} from your wallet?
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowWithdrawModal(false)}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdrawal}
            disabled={isLoading}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-dvh w-full">
      <Header heading={"My Wallet"}></Header>

      <div className="container mx-auto p-4 space-y-6 relative flex-1 w-full flex flex-col">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-blue-800">My Wallet</h2>
            <div className="text-2xl font-semibold text-green-600">
              ₹{balance.toLocaleString()}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <PlusCircle className="mr-2 text-green-600" /> Add Money
              </h3>
              <div className="flex space-x-2 w-full">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-[74%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <button
                  onClick={validateAndOpenRechargeModal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <MinusCircle className="mr-2 text-red-600" /> Withdraw Money
              </h3>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-[60%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <button
                  onClick={validateAndOpenWithdrawModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white p-2 rounded-xl shadow-md flex flex-col max-h-[26rem]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Transaction History</h3>
            <button
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              onClick={() => fetchTransaction(userId)}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </button>
          </div>

          {/* <div className="flex-1"> */}
          <TransactionCardList
            isTransactionLoading={isTransactionLoading}
            transactions={transactions}
            formatDate={formatDate}
          />
          {/* </div> */}
        </div>

        {showRechargeModal && <RechargeModal />}
        {showWithdrawModal && <WithdrawModal />}
      </div>
    </div>
  );
};

export default MyWallet;
