import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";
import { FileDown } from "lucide-react";

const Play = () => {
  const handleDownloadInstructions = () => {
    const pdfUrl =
      "https://asset.cloudinary.com/ddj9gigrb/5f4b579aa54c401bf29192929783a490";

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "How-to-Play-Instructions.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header heading="How to Play" />
      <div className="flex-grow">
        <StaticDetails staticType="HOW_TO_PLAY" pageTitle="How to Play" />
      </div>
      <div className="p-4">
        <button
          onClick={handleDownloadInstructions}
          className="fixed bottom-0 left-0 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-700 text-white rounded-lg font-medium text-[16px] transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Download Detailed Instructions
        </button>
      </div>
    </div>
  );
};

export default Play;
