import { useState } from "react";

export const EditAuctionModal = ({ auction, onClose, handleUpdateAuction }) => {
  const [formData, setFormData] = useState({
    title: auction.title,
    description: auction.description,
    scheduledDate: auction.startTime.split(",")[0].trim(),
    startTime: auction.startTime.split(",")[1].trim(),
    registrationFee: auction.registrationFee,
    budgetLimit: auction.budgetLimit,
    status: auction?.status || "SCHEDULED",
    image: auction?.imageUrl,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleUpdateAuction(formData);
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
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            >
              <option value="LIVE">LIVE</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Date
            </label>
            <input
              type="text"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              placeholder="YYYY-MM-DD"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="text"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              placeholder="HH:mm:ss"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Fee
            </label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget Limit
            </label>
            <input
              type="number"
              name="budgetLimit"
              value={formData.budgetLimit}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
