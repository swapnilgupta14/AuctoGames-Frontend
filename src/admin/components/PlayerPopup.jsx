import { useState } from "react";
import { Upload, Users, Table, AlertCircle, Check, X } from "lucide-react";
import { RegisterPlayerToIndividualAuction } from "../../api/fetch";
import toast from "react-hot-toast";

const PlayersPopup = ({ isOpen, onClose, auctionId }) => {
  const [file, setFile] = useState(null);
  const [jsonOutput, setJsonOutput] = useState(null);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploadLoading(true);
    setError(null);

    if (!file) {
      setError("Please select a file to upload!");
      setIsUploadLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://server.rishabh17704.workers.dev/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setJsonOutput(result.data);
        setError(null);
      } else {
        setError(result.error);
        setJsonOutput(null);
      }
    } catch (err) {
      setError(err.message);
      setJsonOutput(null);
    } finally {
      setIsUploadLoading(false);
    }
  };

  const registerPlayers = async () => {
    setIsRegisterLoading(true);

    if (!auctionId) {
      toast.error("Auction ID is required");
      setIsRegisterLoading(false);
      return;
    }

    if (!Array.isArray(jsonOutput) || jsonOutput.length === 0) {
      toast.error("No players to register");
      setIsRegisterLoading(false);
      return;
    }

    try {
      for (const player of jsonOutput) {
        const payload = {
          player: player,
          auctionId: auctionId,
        };

        try {
          const res = await RegisterPlayerToIndividualAuction(payload);
        } catch (error) {
          toast.error(
            `An error occurred while registering player ${player.Players}`
          );
          console.error(`Error registering player ${player.Players}:`, error);
        }
      }

      toast.success("All players processed");
      setFile(null);
      setJsonOutput(null);
      setError(null);
      onClose();
    } catch (error) {
      toast.error("An error occurred during player registration");
      console.error("Registration error:", error);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[70%] max-h-[95vh] overflow-y-auto relative p-6">
        <button
          onClick={() => {
            setFile(null);
            setJsonOutput(null);
            setError(null);
            setRegistrationStatus(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-medium mb-6 flex items-center">
          <Upload className="mr-3 text-blue-600" /> Player Registration
        </h1>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={isUploadLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploadLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" /> Upload
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {jsonOutput && (
          <div className="mb-6 mt-3">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Table className="mr-3 text-green-600" /> Player Data
            </h2>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full bg-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    {Object.keys(jsonOutput[0] || {}).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left font-medium text-gray-600"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jsonOutput.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 hover:bg-gray-50 text-sm"
                    >
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} className="px-4 py-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={registerPlayers}
                disabled={isRegisterLoading}
                className="mt-4 flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isRegisterLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Registering...
                  </>
                ) : (
                  <>
                    <Users className="mr-2" /> Register Players
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPopup;
