import { FileDown } from "lucide-react";

const RulesModal = ({ closeRulesModal }) => {
  const handleDownloadInstructions = async () => {
    const pdfUrl =
      "https://asset.cloudinary.com/ddj9gigrb/5f4b579aa54c401bf29192929783a490";

    try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Ensure the correct MIME type
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "How-to-Play-Instructions.pdf"; // Ensuring correct extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release memory
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Team Composition Rules</h2>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Player Type Limits</h3>
            <ul className="list-disc list-inside">
              <li>Batsmen: 3-4 players</li>
              <li>Bowlers: 4 players</li>
              <li>Wicket Keepers: 1-2 players</li>
              <li>All Rounders: 1-2 players</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Total Allowed Players</h3>
            <p>Maximum of 11 players total</p>
          </div>

          <button
            onClick={handleDownloadInstructions}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-100 text-blue-700 rounded-lg font-medium text-[16px] transition-colors"
          >
            <FileDown className="w-5 h-5" />
            How to Play Instructions
          </button>
        </div>

        <button
          onClick={() => closeRulesModal()}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
