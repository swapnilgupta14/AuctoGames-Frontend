import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../api/fetch";
import {
  Clock,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
} from "lucide-react";

const TransactionBadge = ({ type }) => {
  const badgeStyles = {
    RECHARGE: "bg-green-100 text-green-800",
    WITHDRAWAL: "bg-red-100 text-red-800",
    REGISTRATION_FEE: "bg-blue-100 text-blue-800",
  };

  const icons = {
    RECHARGE: <ArrowUpCircle className="w-4 h-4 mr-2 text-green-600" />,
    WITHDRAWAL: <ArrowDownCircle className="w-4 h-4 mr-2 text-red-600" />,
    REGISTRATION_FEE: <CreditCard className="w-4 h-4 mr-2 text-blue-600" />,
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center ${
        badgeStyles[type] || "bg-gray-100 text-gray-800"
      }`}
    >
      {icons[type] || null}
      {type?.replace("_", " ")}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    DENIED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  console.log(transactions)

  const fetchAllTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await getTransactionHistory();
      setTransactions(res?.transactions || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
      <RefreshCw className="animate-spin text-gray-500" size={36} />
      <p>Loading...</p>
    </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="p-6 bg-white overflow-y-scroll h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex-1 text-xl font-semibold text-gray-800 mb-4 md:mb-0 pb-3 flex flex-col ">
          Transaction History
          <p className="text-xs font-normal">
            Total Transactions: {transactions.length}
          </p>
        </h1>
        <button
          onClick={fetchAllTransactions}
          className="text-blue-600 bg-blue-50 hover:bg-gray-200 p-2.5 rounded-full transition-colors duration-200 mr-5 w-fit flex gap-3 items-center justify-center"
        >
          Refresh <RefreshCw size={20} />
        </button>
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <TransactionBadge type={transaction.type} />
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <p className="text-gray-800 font-medium text-base">
                  {transaction.description}
                </p>
                {transaction.approvedOrDeniedAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Approved/Denied At:{" "}
                    {formatDate(transaction.approvedOrDeniedAt)}
                  </p>
                )}
              </div>
              <div className="text-right flex flex-col lg:flex-row lg:items-center lg:gap-8">
                <StatusBadge status={transaction.status} />
                <div className="mt-3 lg:mt-0">
                  <p
                    className={`font-bold text-lg ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} Rs
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    User: {transaction.wallet.user.username}
                  </p>
                </div>
                {/* <div className="mt-3 lg:mt-0 text-sm text-gray-600">
                  <p>Email: {transaction.wallet.user.email}</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
