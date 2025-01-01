import { useState } from "react";

export const EditAuctionModal = ({ auction, onClose, handleUpdateAuction }) => {
  const [formData, setFormData] = useState({
    title: auction.title,
    description: auction.description,
    scheduledDate: auction.startTime.split(",")[0].trim(),
    startTime: auction.startTime.split(",")[1].trim(),
    registrationFee: auction.registrationFee,
    budgetLimit: auction.budgetLimit,
    endTime: auction.endTime || "",
    image: auction?.imageUrl,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endTime) {
      const startDateTime = new Date(
        `${formData.scheduledDate}, ${formData.startTime}`
      );
      const endDateTime = new Date(
        `${formData.scheduledDate}, ${formData.endTime}`
      );
      const minEndTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

      if (endDateTime <= new Date() || endDateTime <= minEndTime) {
        alert(
          "End time must be greater than current time and at least 2 hours after start time"
        );
        return;
      }
    }

    const updateData = {
      ...formData,
      endTime:
        formData.endTime !== auction.endTime ? formData.endTime : undefined,
    };

    console.log("updateData...", updateData);

    try {
      setIsLoading(true);
      await handleUpdateAuction(updateData);
      onClose();
    } catch (error) {
      console.error("Error updating auction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Date
            </label>
            <div
              className="relative"
              title={
                auction.status !== "SCHEDULED"
                  ? "Can only edit scheduled date when auction is in SCHEDULED status"
                  : ""
              }
            >
              <input
                type="text"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                  auction.status !== "SCHEDULED"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder="YYYY-MM-DD"
                required
                disabled={auction.status !== "SCHEDULED"}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <div
              className="relative"
              title={
                auction.status !== "SCHEDULED"
                  ? "Can only edit start time when auction is in SCHEDULED status"
                  : ""
              }
            >
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                  auction.status !== "SCHEDULED"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder="HH:mm:ss"
                required
                disabled={auction.status !== "SCHEDULED"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time (Optional)
            </label>
            <div
              className="relative"
              title={
                auction.status === "COMPLETED"
                  ? "Cannot edit end time for completed auctions"
                  : ""
              }
            >
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                  auction.status === "COMPLETED"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder="HH:mm:ss"
                disabled={auction.status === "COMPLETED"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Fee
            </label>
            <div
              className="relative"
              title={
                auction.status === "COMPLETED"
                  ? "Cannot edit registration fee for completed auctions"
                  : ""
              }
            >
              <input
                type="number"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                  auction.status === "COMPLETED"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={auction.status === "COMPLETED"}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget Limit
            </label>
            <div
              className="relative"
              title={
                auction.status === "COMPLETED"
                  ? "Cannot edit budget limit for completed auctions"
                  : ""
              }
            >
              <input
                type="number"
                name="budgetLimit"
                value={formData.budgetLimit}
                onChange={handleChange}
                step="0.01"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${
                  auction.status === "COMPLETED"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={auction.status === "COMPLETED"}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
