import toast from "react-hot-toast";
import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";
import { FileDown } from "lucide-react";

const Play = () => {
  const handleDownloadInstructions = async () => {
    const pdfFileName = "Instructions_Aucto_Games.pdf";
    const pdfPath = `/${pdfFileName}`;

    try {
      const response = await fetch(pdfPath);

      if (!response.ok) {
        throw new Error(`Failed to download PDF. Status: ${response.status}`);
      }

      const blob = await response.blob();

      if (!blob.type.includes("pdf") || blob.size === 0) {
        throw new Error("Invalid PDF file");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "How-to-Play-Instructions.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("PDF downloaded successfully");

      return true;
    } catch (error) {
      toast.error("PDF download failed:", error.message);
      throw error;
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-gray-100">
      <Header heading="How to Play" />
      <div className="flex-grow">
        <StaticDetails staticType="HOW_TO_PLAY" pageTitle="How to Play" />
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <button
          onClick={async () => await handleDownloadInstructions()}
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
