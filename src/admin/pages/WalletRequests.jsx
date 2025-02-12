import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, XIcon, ImageIcon, AlertCircle } from "lucide-react";
import {
  getAllPendingWithdrawlRequests,
  approveWithdrawlRequest,
  getAllPendingRechargeRequests,
} from "../../api/fetch";

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
  </div>
);

const ImagePopup = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-3xl w-full bg-white rounded-xl shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{alt}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const PaymentInfoButton = ({ label, value, type = "text", onImageClick }) => {
  if (!value) {
    return (
      <div className="flex items-center text-red-600 text-xs bg-red-50 rounded-lg px-3 py-2 border border-red-100">
        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
        No {label}
      </div>
    );
  }

  return type === "text" ? (
    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 text-xs border border-gray-200">
      <span className="font-medium text-gray-700 mr-2">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  ) : (
    <button
      onClick={onImageClick}
      className="flex items-center bg-blue-50 text-xs text-blue-600 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors w-full border border-blue-100"
    >
      <ImageIcon className="w-4 h-4 mr-2 flex-shrink-0" />
      View {label}
    </button>
  );
};

const RequestCard = ({ requests, title, type, onApprove, isApproving, isLoading, onImageSelect }) => (
  <div className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
    <div className="flex-shrink-0 px-6 py-4 border-b bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {type === "Withdrawal" ? (
            <ArrowDownIcon className="w-6 h-6 text-red-500" />
          ) : (
            <ArrowUpIcon className="w-6 h-6 text-green-500" />
          )}
          {title}
          <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
            {requests.length}
          </span>
        </h2>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {isLoading && <Loader />}
      
      {!isLoading && requests.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {type === "Withdrawal" ? (
              <ArrowDownIcon className="w-8 h-8 text-gray-400" />
            ) : (
              <ArrowUpIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p>No {type.toLowerCase()} requests pending</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {requests.map((request) => {
            const paymentInfo = request.wallet?.paymentInfo || {};
            return (
              <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {request.wallet.user.username}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Amount:{" "}
                        <span className={`font-medium ${
                          type === "Withdrawal" ? "text-red-600" : "text-green-600"
                        }`}>
                          ₹{Math.abs(request.amount).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onApprove(request.id)}
                        disabled={isApproving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors min-w-[100px]"
                      >
                        {isApproving ? "Processing..." : "Approve"}
                      </button>
                      <button
                        disabled={isApproving}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors min-w-[100px]"
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {type === "Recharge" ? (
                      <PaymentInfoButton
                        label="UTR Number"
                        value={request?.UTRNumber}
                      />
                    ) : (
                      <PaymentInfoButton
                        label="UPI ID"
                        value={paymentInfo?.upiId}
                      />
                    )}
                    <PaymentInfoButton
                      label="Mobile"
                      value={paymentInfo?.mobileNumber}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {["panCard", "aadharCard"].map((doc) => (
                      <PaymentInfoButton
                        key={doc}
                        label={doc
                          ?.replace(/([A-Z])/g, " $1")
                          ?.replace(/^./, (str) => str.toUpperCase())}
                        type="image"
                        value={paymentInfo[doc]}
                        onImageClick={() =>
                          onImageSelect({
                            src: paymentInfo[doc],
                            alt: doc
                              ?.replace(/([A-Z])/g, " $1")
                              ?.replace(/^./, (str) => str.toUpperCase()),
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const WalletRequests = () => {
  const [withdrawlRequests, setWithdrawlRequests] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchRequests = async (fetchFunction, setRequests) => {
    try {
      const res = await fetchFunction();
      if (res?.status === 200) {
        setRequests(res?.data?.walletRequests);
      } else {
        setError(`Error fetching ${fetchFunction.name} requests`);
      }
    } catch (err) {
      setError(`Error fetching ${fetchFunction.name} requests: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(getAllPendingWithdrawlRequests, setWithdrawlRequests);
    fetchRequests(getAllPendingRechargeRequests, setRechargeRequests);
  }, []);

  const approverequest = async (transactionId) => {
    setIsApproving(true);
    try {
      const request = await approveWithdrawlRequest(transactionId);
      if (request?.status === 200) {
        await fetchRequests(getAllPendingRechargeRequests, setRechargeRequests);
        await fetchRequests(getAllPendingWithdrawlRequests, setWithdrawlRequests);
      } else {
        setError("Sorry! Request cannot be approved");
      }
    } catch (err) {
      setError(`Sorry! Request cannot be approved: ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" style={{ height: 'calc(100vh - 40px)' }}>
          <RequestCard
            requests={rechargeRequests}
            title="Recharge Requests"
            type="Recharge"
            onApprove={approverequest}
            isApproving={isApproving}
            isLoading={isLoading}
            onImageSelect={setSelectedImage}

          />
          <RequestCard
            requests={withdrawlRequests}
            title="Withdrawal Requests"
            type="Withdrawal"
            onApprove={approverequest}
            isApproving={isApproving}
            isLoading={isLoading}
            onImageSelect={setSelectedImage}

          />
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {selectedImage && (
        <ImagePopup
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default WalletRequests;