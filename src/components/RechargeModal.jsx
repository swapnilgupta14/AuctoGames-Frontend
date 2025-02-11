import { X } from "lucide-react";

const RechargeModal = ({
  showRechargeModal,
  setShowRechargeModal,
  rechargeAmount,
  handleRecharge,
  isLoading,
  setUtrNumber,
  utrNumber,
}) => {
  const onSubmit = () => {
    handleRecharge(utrNumber);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
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
              className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border"
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
              onClick={onSubmit}
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
};

export default RechargeModal;
