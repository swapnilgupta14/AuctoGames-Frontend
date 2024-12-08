import BidHistoryCard from "../components/BidHistoryCard";
import Header from "../components/Header";
import { getBidHistoryOfPlayers } from "../api/fetch";
import { useEffect, useState } from "react";

const SearchBar = ({ originalData, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value.trim() === "") {
      onSearch(originalData);
    } else {
      const filteredData = originalData.filter(
        (item) =>
          item.name?.toLowerCase().includes(value) ||
          item.base?.toLowerCase().includes(value) ||
          item.status?.toLowerCase().includes(value)
      );
      onSearch(filteredData);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mx-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search players..."
        className="w-full px-4 py-2 my-3 focus:outline-none focus:ring-2 focus:ring-black border-2 border-black rounded-3xl"
      />
    </div>
  );
};

const BidHistory = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [resState, setResState] = useState(false);

  useEffect(() => {
    const getBidHistoryData = async () => {
      try {
        const response = await getBidHistoryOfPlayers(3);
        if(response.bids.length > 0) {
          setResState(true);
        }else{
          setResState(false);
        }
        const newData =
          response.success && response.bids.length > 0
            ? response.bids
            : dummyData;

        setOriginalData(newData);
        setFilteredData(newData);
      } catch (error) {
        console.error("Error fetching bid history:", error);
        setOriginalData(dummyData);
        setFilteredData(dummyData);
      }
    };

    getBidHistoryData();
  }, []);

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
  };

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Header heading={"Bid History"} />
      <div className="w-full flex items-center justify-center">
        <SearchBar originalData={originalData} onSearch={handleSearch} />
      </div>
      {!resState && (
        <p className="text-center">No response from the server! Using Dummy Data</p>
      )}
      <div className="flex-1 flex flex-col justify-center items-center w-[100%] gap-5 mt-4">
        {filteredData.length > 0 ? (
          <div className="flex-1 flex flex-col items-center justify-start gap-5 w-[100%]">
            {filteredData.map((item, index) => (
              <BidHistoryCard item={item} key={index} />
            ))}
          </div>
        ) : (
          <p>No matching results found!</p>
        )}
      </div>
    </div>
  );
};

export default BidHistory;
