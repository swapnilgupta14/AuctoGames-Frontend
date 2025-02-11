import { useState, useEffect } from "react";
import {
  getWalletBalance,
  postRechargeRequest,
  postWithdrwalRequest,
  fetchTransactionHistory,
} from "../api/fetch";
import { useSelector } from "react-redux";
import { truncateText } from "../utils/truncateText";
import {
  PlusCircle,
  MinusCircle,
  RefreshCw,
  X,
  CircleCheck,
  CircleAlert,
  ArrowRight,
} from "lucide-react";
import Header from "../components/Header";
import toast from "react-hot-toast";

import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
                className={`text-sm font-semibold px-2 py-1 rounded 
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

const WalletCard = ({
  balance,
  rechargeAmount,
  setRechargeAmount,
  withdrawAmount,
  setWithdrawAmount,
  validateAndOpenRechargeModal,
  validateAndOpenWithdrawModal,
  paymentInfo,
  viewPaymentInfo,
  setViewPaymentInfo,
  navigate,
  getAvailableMethod,
  getMissingMethods,
}) => (
  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl shadow-md">
    {!viewPaymentInfo ? (
      <>
        <div className="mb-4 ">
          <div className="flex justify-between items-center border-b border-blue-200 p-2">
            <h2 className="text-xl font-semibold text-blue-800">My Wallet</h2>
            <div className="text-xl font-semibold text-green-600">
              ₹{balance.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-2 overflow-hidden">
          <div className="bg-white bg-opacity-50 p-2 rounded-lg">
            <h3 className="font-medium flex items-center text-sm mb-2">
              <PlusCircle className="mr-2 h-4 w-4 text-green-600" /> Add Money
            </h3>
            <div className="flex gap-2 ">
              <input
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="w-[82%] px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
              />
              <button
                onClick={validateAndOpenRechargeModal}
                className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm font-medium whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 p-2 rounded-lg">
            <h3 className="font-medium flex items-center text-sm mb-2">
              <MinusCircle className="mr-2 h-4 w-4 text-red-600" /> Withdraw
              Money
            </h3>
            <div className="flex gap-2 max-w-full">
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-[70%] px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
              />
              <button
                onClick={validateAndOpenWithdrawModal}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-medium min-w-fit"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {getMissingMethods().length > 0 && (
            <div className="flex items-start p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-yellow-800">
                Missing Payment Info.
                <button
                  onClick={() => navigate("/profile")}
                  className="text-blue-600 hover:underline ml-1"
                >
                  Update profile
                </button>
              </div>
            </div>
          )}

          {getAvailableMethod() && getMissingMethods().length === 3 && (
            <div
              className="flex items-start p-2 bg-blue-50 border border-blue-200 rounded-md text-sm justify-between"
              onClick={() => setViewPaymentInfo(true)}
            >
              <div className="text-blue-800 flex">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                Using {getAvailableMethod()} for transactions.
              </div>
              <div>
                <ArrowRight className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="space-y-3">
        <div className="flex items-center justify-start border-b border-blue-200 pb-3">
          <button
            onClick={() => setViewPaymentInfo(false)}
            className="flex items-center text-blue-700 hover:text-blue-800 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
          </button>
          <h2 className="text-lg font-semibold text-blue-800">
            Payment Information
          </h2>
          <div className="w-8" />
        </div>

        {paymentInfo && getMissingMethods().length === 3 ? (
          <div className="flex items-start p-2 bg-red-50 border border-red-200 rounded-md text-sm">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-red-800">
              No payment methods configured.
              <button
                onClick={() => navigate("/profile")}
                className="text-blue-700 hover:underline ml-1"
              >
                Update profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <div className="flex md:flex-row gap-2">
                {paymentInfo?.qrCode && (
                  <div className="flex-shrink-0">
                    <img
                      src={paymentInfo.qrCode}
                      alt="QR Code"
                      className="h-32 w-32 border rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-start space-y-2">
                  {paymentInfo?.upiId && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-sm text-black">
                          {paymentInfo.upiId
                            ? truncateText(paymentInfo.upiId)
                            : "UPI ID"}
                        </span>
                        {paymentInfo.upiId ? (
                          <CircleCheck className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="flex items-center text-red-600">
                            <CircleAlert className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {paymentInfo?.mobileNumber && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-sm text-black">
                          {paymentInfo.mobileNumber
                            ? truncateText(paymentInfo.mobileNumber)
                            : "Mobile Number"}
                        </span>
                        {paymentInfo.mobileNumber ? (
                          <CircleCheck className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="flex items-center text-red-600">
                            <CircleAlert className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 w-full">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm mr-2">Aadhaar</span>
                      {paymentInfo.aadhaarNumber ? (
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="flex items-center text-red-600">
                          <CircleAlert className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm mr-2">PAN</span>
                      {paymentInfo.pan ? (
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="flex items-center text-red-600">
                          <CircleAlert className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {!paymentInfo?.upiId && !paymentInfo?.mobileNumber && (
                    <div className="text-md text-gray-500 italic">
                      No additional payment methods configured
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center justify-center gap-1 text-sm text-blue-700 hover:text-blue-800 bg-white bg-opacity-50 py-2 rounded-md mt-3"
        >
          Update Information in Profile{" "}
          <ExternalLink className="h-4 w-4 ml-2" />
        </button>
      </div>
    )}
  </div>
);

const MyWallet = () => {
  const { userId } = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [viewPaymentInfo, setViewPaymentInfo] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const navigate = useNavigate();

  const getAvailableMethod = () => {
    if (paymentInfo?.qrCode) return "QR Code";
    if (paymentInfo?.upiId) return "UPI ID";
    if (paymentInfo?.mobileNumber) return "Mobile Number";
    return null;
  };

  const getMissingMethods = () => {
    const missing = [];
    if (!paymentInfo?.qrCode) missing.push("QR Code");
    if (!paymentInfo?.upiId) missing.push("UPI ID");
    if (!paymentInfo?.mobileNumber) missing.push("Mobile Number");
    return missing;
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      setIsTransactionLoading(true);
      setError(null);
      try {
        const balanceRes = await getWalletBalance(userId);
        setBalance(balanceRes.balance);
        setPaymentInfo(balanceRes.paymentInfo);

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

    if (parseFloat(rechargeAmount) > 10000) {
      toast.error("Maximum recharge amount is ₹10,000");
      return;
    }

    if (parseFloat(rechargeAmount) < 1) {
      toast.error("Minimum recharge amount is ₹1");
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

    if (!paymentInfo?.upiId && !paymentInfo?.mobileNumber) {
      toast.error(
        "Please update your payment information in profile before withdrawing"
      );
      return;
    } else if (!paymentInfo?.aadhaarNumber || !paymentInfo?.pan) {
      toast.error(
        "Please update your Aadhaar & PAN in profile before withdrawing"
      );
      return;
    }

    setShowWithdrawModal(true);
  };

  const handleRecharge = async () => {
    setError(null);
    setIsLoading(true);

    if (!utrNumber.trim()) {
      toast.error("Please enter UTR/Reference number");
      setIsLoading(false);
      return;
    }

    if (parseFloat(rechargeAmount) > 10000) {
      toast.error("Maximum recharge amount is ₹10,000");
      setIsLoading(false);
      return;
    }

    try {
      const res = await postRechargeRequest(
        userId,
        parseFloat(rechargeAmount),
        utrNumber
      );
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
        className="fixed -inset-5 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={() => setShowRechargeModal(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out bg-white rounded-t-xl shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-green-800">
              Confirm Recharge
            </h2>
            <button
              onClick={() => setShowRechargeModal(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6 flex justify-center">
            <img
              src="/AuctoQRCode.jpg"
              alt="Payment QR Code"
              className="rounded-lg border border-gray-200"
            />
          </div>

          <div className="mb-6 text-center">
            <p className="text-gray-600 mb-2">Amount to be added</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{rechargeAmount}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UTR Number/Ref Number
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter UTR/Reference number"
              className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border border-2"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowRechargeModal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => handleRecharge(utrNumber)}
              disabled={isLoading || !utrNumber.trim()}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Send Request"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const WithdrawModal = ({ paymentInfo }) => (
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
        <WalletCard
          getAvailableMethod={getAvailableMethod}
          getMissingMethods={getMissingMethods}
          viewPaymentInfo={viewPaymentInfo}
          setViewPaymentInfo={setViewPaymentInfo}
          rechargeAmount={rechargeAmount}
          setRechargeAmount={setRechargeAmount}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          balance={balance}
          paymentInfo={paymentInfo}
          navigate={navigate}
          validateAndOpenRechargeModal={validateAndOpenRechargeModal}
          validateAndOpenWithdrawModal={validateAndOpenWithdrawModal}
        />

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

          <TransactionCardList
            isTransactionLoading={isTransactionLoading}
            transactions={transactions}
            formatDate={formatDate}
          />
        </div>

        {showRechargeModal && <RechargeModal paymentInfo={paymentInfo} />}
        {showWithdrawModal && <WithdrawModal paymentInfo={paymentInfo} />}
      </div>
    </div>
  );
};

export default MyWallet;
