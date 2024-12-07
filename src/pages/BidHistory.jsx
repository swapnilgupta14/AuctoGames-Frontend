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

  const dummyData = [
    {
      image: "https://picsum.photos/200/300?random=1",
      name: "Virat Kohli",
      base: "India",
      points: 890,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=2",
      name: "Steve Smith",
      base: "Australia",
      points: 850,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=3",
      name: "Kane Williamson",
      base: "New Zealand",
      points: 830,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=4",
      name: "Joe Root",
      base: "England",
      points: 820,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=5",
      name: "Babar Azam",
      base: "Pakistan",
      points: 910,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=6",
      name: "Rohit Sharma",
      base: "India",
      points: 780,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=7",
      name: "David Warner",
      base: "Australia",
      points: 760,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=8",
      name: "Quinton de Kock",
      base: "South Africa",
      points: 740,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=9",
      name: "Jos Buttler",
      base: "England",
      points: 770,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=10",
      name: "Shakib Al Hasan",
      base: "Bangladesh",
      points: 800,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=11",
      name: "Pat Cummins",
      base: "Australia",
      points: 890,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=12",
      name: "Trent Boult",
      base: "New Zealand",
      points: 870,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=13",
      name: "Rashid Khan",
      base: "Afghanistan",
      points: 860,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=14",
      name: "Ben Stokes",
      base: "England",
      points: 790,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=15",
      name: "Andre Russell",
      base: "West Indies",
      points: 720,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=16",
      name: "Marnus Labuschagne",
      base: "Australia",
      points: 810,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=17",
      name: "KL Rahul",
      base: "India",
      points: 730,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=18",
      name: "Shaheen Afridi",
      base: "Pakistan",
      points: 750,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=19",
      name: "Tim Southee",
      base: "New Zealand",
      points: 710,
      status: "Active",
    },
    {
      image: "https://picsum.photos/200/300?random=20",
      name: "Jason Holder",
      base: "West Indies",
      points: 700,
      status: "Active",
    },
  ];

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
