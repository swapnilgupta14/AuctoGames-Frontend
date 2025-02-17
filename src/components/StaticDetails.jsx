import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getStaticData } from "../api/fetch";

const StaticDetails = ({ staticType, pageTitle }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getStaticData(staticType);

      if (res?.content?.content) {
        setContent(res.content.content);
        setError(null);
      } else {
        setContent("");
        setError("Content not found for the specified type");
      }
    } catch (err) {
      console.error(`Error fetching ${staticType}:`, err);
      setError(err.message || "An unexpected error occurred");
      setContent("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [staticType]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center">
        <RefreshCw className="animate-spin text-gray-500" size={36} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg overflow-y-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">{pageTitle}</h1>

      {error && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Warning</p>
          <p>No content found!</p>
        </div>
      )}

      <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
        {content || "No content available"}
      </pre>
    </div>
  );
};

export default StaticDetails;
