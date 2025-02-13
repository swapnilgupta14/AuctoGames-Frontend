import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getStaticData, updateStaticData } from "../../api/fetch";

const StaticContentPage = ({ staticType, pageTitle }) => {
  const [type, setType] = useState(staticType);
  const [content, setContent] = useState(null);
  const [originalContent, setOriginalContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("N/A");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await getStaticData(staticType);
      
      if (res?.content?.content) {
        setContent(res.content.content);
        setOriginalContent(res.content.content);
        setType(res.content.type);
        setLastUpdated(res.content.updatedAt 
          ? new Date(res.content.updatedAt).toLocaleString() 
          : "N/A");
        setError(null);
      } else {
        setContent("");
        setIsEditing(true);
        setError("Content not found for the specified type");
        setType(staticType);

      }
    } catch (err) {
      console.error(`Error fetching ${staticType}:`, err);
      setError(err.message || "An unexpected error occurred");
      setContent("");
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setContent(originalContent || "");
    setIsEditing(false);
    
    if (!originalContent) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty");
      return;
    }

    try {
      const res = await updateStaticData(staticType, content);
      console.log(res)
      if (res) {
        await getData();
        setIsEditing(false);
      } else {
        throw new Error(`Failed to update ${staticType}`);
      }
    } catch (error) {
      console.error(`Error saving ${staticType}:`, error);
      alert(`Failed to save content: ${error.message}`);
    }
  };

  useEffect(() => {
    getData();
  }, [staticType]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-full">
      <RefreshCw className="animate-spin text-gray-500" size={36} />
      <p>Loading...</p>
    </div>
      );
  }

  return (
    <div className="max-h-dvh mx-auto p-6 bg-white rounded-lg overflow-y-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            {pageTitle}
          </h1>
          <div className="text-sm text-blue-600">
            <span className="font-medium">Type:</span> {type || "N/A"}
            <span className="ml-4 font-medium">Last Updated:</span>{" "}
            {lastUpdated}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>Some Error occurred or content not found!</p>
        </div>
      )}

      <div className="mt-4">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content here..."
            className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
            {content || "No content available"}
          </pre>
        )}
      </div>

      {isEditing && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default StaticContentPage;