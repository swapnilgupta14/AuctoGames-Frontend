import { useEffect, useState } from "react";
import { fetchTransactionHistory } from "../../api/fetch";
import {
  Mail,
  User,
  Award,
  Globe,
  Users,
  X,
  Calendar,
  ArrowLeft,
  Wallet,
  CreditCard as PaymentIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

const UserDetails = ({ user, onClose }) => {
  const [userTransactions, setUserTransactions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllAuctions, setShowAllAuctions] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  const fetchUserTransactions = async (userId) => {
    try {
      const res = await fetchTransactionHistory(userId);
      if (res?.status === 200) {
        setUserTransactions(res.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchUserTransactions(user.id);
  }, [user]);

  const PaymentInfoMissing = ({ fieldName }) => (
    <div className="flex items-center text-red-500 space-x-2">
      <X className="w-4 h-4" />
      <span className="text-sm">No {fieldName} provided</span>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-white overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 z-10 text-red-700 bg-red-100 rounded-full p-1 hover:bg-red-600 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header Section */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center space-x-6">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-gray-100 p-4 rounded-full">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-gray-600 flex items-center">
              <Mail className="mr-2 w-4 h-4" /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 p-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
          <Award className="w-8 h-8 text-indigo-500 mr-3" />
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-semibold">{user.role}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
          <Wallet className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="font-semibold">₹{user?.wallet?.balance || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
          <Users className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p className="text-gray-500 text-sm">Teams</p>
            <p className="font-semibold">{user.ownedTeams.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
          <Globe className="w-8 h-8 text-orange-500 mr-3" />
          <div>
            <p className="text-gray-500 text-sm">Auctions</p>
            <p className="font-semibold">{user.participatedIn.length}</p>
          </div>
        </div>
      </div>

      {/* Payment Info Section */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <PaymentIcon className="mr-3 text-gray-500" /> Payment Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">UPI ID</p>
                {user?.wallet?.paymentInfo?.upiId ? (
                  <p className="font-semibold">
                    {user.wallet.paymentInfo.upiId}
                  </p>
                ) : (
                  <PaymentInfoMissing fieldName="UPI ID" />
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Mobile Number</p>
                {user?.wallet?.paymentInfo?.mobileNumber ? (
                  <p className="font-semibold">
                    {user.wallet.paymentInfo.mobileNumber}
                  </p>
                ) : (
                  <PaymentInfoMissing fieldName="mobile number" />
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-500 text-sm mb-3">Documents</p>
            {user?.wallet?.paymentInfo ? (
              <div className="flex gap-4 flex-wrap">
                {["panCard", "aadharCard"].map((doc) => (

                // {["qrCode", "panCard", "aadharCard"].map((doc) => (
                  <div key={doc} className="flex flex-col gap-1">
                    {user.wallet.paymentInfo[doc] ? (
                      <button
                        onClick={() =>
                          setSelectedImage(user.wallet.paymentInfo[doc])
                        }
                        className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        View {doc?.replace(/([A-Z])/g, " $1").trim()}
                      </button>
                    ) : (
                      <PaymentInfoMissing
                        fieldName={doc?.replace(/([A-Z])/g, " $1").trim()}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <p>No payment information available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="px-6">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <Calendar className="mr-3 text-gray-500" /> Recent Activity
        </h2>
        <div className="space-y-6">
          {/* Auctions Section */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Participated Auctions</h3>
              {user.participatedIn.length > 3 && (
                <button
                  onClick={() => setShowAllAuctions(!showAllAuctions)}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showAllAuctions ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      See All <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
            {user.participatedIn.length > 0 ? (
              <div className="space-y-3">
                {user.participatedIn
                  .slice(0, showAllAuctions ? undefined : 3)
                  .map((auction) => (
                    <div
                      key={auction.id}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{auction.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            auction.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {auction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {auction.description}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="w-5 h-5" />
                <p>No auctions participated</p>
              </div>
            )}
          </div>

          {/* Transactions Section */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              {userTransactions.length > 3 && (
                <button
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showAllTransactions ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      See All <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
            {userTransactions.length > 0 ? (
              <div className="space-y-3">
                {userTransactions
                  .slice(0, showAllTransactions ? undefined : 3)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            {transaction.type?.replace(/_/g, " ")}
                          </h4>
                          <p className="text-sm text-gray-600">
                          {transaction.amount}₹
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="w-5 h-5" />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Document Preview</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Document Preview"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
