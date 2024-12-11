import { useState, useRef } from "react";
import { Trash2, ImagePlus, X } from "lucide-react";
import { createNewAuction } from "../../api/fetch";

const CreateAuctionModal = ({ onClose, fetchAllAuctions }) => {
  const [formData, setFormData] = useState({
    title: "",
    registrationFee: "",
    description: "",
    startTime: "",
    scheduledDate: "",
    budgetLimit: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError("File size must be under 5MB.");
    }
  };

  const handleRemoveImage = () => setImagePreview(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log(imagePreview, "imagePreview....");
    try {
      const newAuction = await createNewAuction({
        formData,
        imagePreview,
      });
      if (newAuction) {
        setFormData({
          title: "",
          registrationFee: "",
          description: "",
          scheduledDate: "",
          startTime: "",
          budgetLimit: "",
        });
        setImagePreview(null);
        onClose();
        setIsLoading(false);
        fetchAllAuctions();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[60%] max-h-[90vh] flex">
        <div className="w-2/5 bg-gray-50 p-6 flex flex-col items-center justify-evenly">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              {error}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Auction Preview"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition"
            >
              <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Upload Auction Image
                <br />
                <span className="text-xs text-gray-400">
                  (Optional, Max 5MB)
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="w-3/5 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Create New Auction
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              type="button"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter auction title"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about the auction"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  placeholder="Select date"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  placeholder="Select time"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Limit
                </label>
                <input
                  type="number"
                  name="budgetLimit"
                  value={formData.budgetLimit}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter maximum budget"
                  min="0"
                  className="text-sm w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Fee
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter registration fee"
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Auction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionModal;
