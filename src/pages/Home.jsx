import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import aucLogo from "../assets/pl logo.svg";
import chevronRight from "../assets/chevron-circle-right-Regular.svg";
import calender from "../assets/Calendar.svg";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const carouselStyles = {
  container:
    "relative w-full h-[300px] overflow-hidden flex flex-col items-center mt-4",
  slide:
    "w-[95%] rounded-xl h-[300px] flex items-center justify-center text-white font-bold bg-gray-500",
  dotsContainer: "absolute bottom-2 flex gap-2",
  dot: "w-3 h-3 rounded-full bg-gray-300 cursor-pointer",
  activeDot: "w-3 h-3 rounded-full bg-blue-500",
  skeletonContainer: "w-[95%] h-[300px] bg-gray-200 animate-pulse rounded-xl",
};

const LiveAuctionSkeleton = () => (
  <div className={carouselStyles.skeletonContainer}>
    <div className="absolute top-4 right-4 bg-zinc-400 px-4 rounded-lg h-6 w-20"></div>
  </div>
);

const Home = () => {
  const { username } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [filteredScheduledAuctions, setFilteredScheduledAuctions] = useState(
    []
  );
  const [currentLiveSlide, setCurrentLiveSlide] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const calculateDefaultDateRange = () => {
    const today = new Date();
    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14);

    return [
      {
        startDate: today,
        endDate: twoWeeksFromToday,
        key: "selection",
      },
    ];
  };

  const [dateRange, setDateRange] = useState(calculateDefaultDateRange());

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://server.rishabh17704.workers.dev/api/auctions/getallstatus"
        );
        const data = await response.json();
        setAuctions(data.auctions);

        const live = data.auctions.filter(
          (auction) => auction.status === "LIVE"
        );
        setLiveAuctions(live);

        const scheduled = data.auctions.filter(
          (auction) => auction.status === "SCHEDULED"
        );
        setScheduledAuctions(scheduled);
        setFilteredScheduledAuctions(scheduled);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) {
      setFilteredScheduledAuctions(scheduledAuctions);
    } else {
      const filtered = scheduledAuctions.filter((auction) => {
        const auctionDate = new Date(auction.startTime);
        return auctionDate >= startDate && auctionDate <= endDate;
      });
      setFilteredScheduledAuctions(filtered);
    }
  }, [dateRange, scheduledAuctions]);

  const nextSlide = () => {
    setCurrentLiveSlide((prev) => (prev + 1) % liveAuctions.length);
  };

  const prevSlide = () => {
    setCurrentLiveSlide(
      (prev) => (prev - 1 + liveAuctions.length) % liveAuctions.length
    );
  };

  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDateRange = (startDate, endDate) => {
    const formatOptions = {
      month: "short",
      day: "numeric",
    };
    return `${startDate.toLocaleDateString(
      undefined,
      formatOptions
    )} - ${endDate.toLocaleDateString(undefined, formatOptions)}`;
  };

  return (
    <div className="w-[100%] ">
      <Header heading={`Welcome, ${username.split(" ")[0]}`}></Header>

      {isLoading ? (
        <div className={carouselStyles.container}>
          <LiveAuctionSkeleton />
        </div>
      ) : liveAuctions.length > 0 ? (
        <div className={carouselStyles.container}>
          {liveAuctions.map((auction, index) => (
            <div
              key={auction.id}
              className={`${carouselStyles.slide} ${
                currentLiveSlide === index ? "block" : "hidden"
              }`}
              onClick={() =>
                navigate(`/auction/${auction.id}`, { state: { auction } })
              }
            >
              <div>
                <img
                  src={`https://via.placeholder.com/600x300?text=${auction.title}`}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-red-500 px-4  rounded-lg font-light flex justify-center items-center gap-2 py-[1px]">
                <div className="mb-[3px]">Live</div>
                <div className="w-[5px] h-[5px] bg-white rounded-full "></div>
              </div>
            </div>
          ))}

          <div className={carouselStyles.dotsContainer}>
            {liveAuctions.map((_, index) => (
              <div
                key={index}
                className={`${carouselStyles.dot} ${
                  currentLiveSlide === index ? carouselStyles.activeDot : ""
                }`}
                onClick={() => setCurrentLiveSlide(index)}
              />
            ))}
          </div>

          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full"
            onClick={prevSlide}
          >
            &lt;
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full"
            onClick={nextSlide}
          >
            &gt;
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          No live auctions available.
        </div>
      )}

      <div className="mt-8 px-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Upcoming Auctions
            </h2>
            <div className="text-sm text-gray-600 text-start">
              ({formatDateRange(dateRange[0].startDate, dateRange[0].endDate)})
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-lg mb-3"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            {isDatePickerOpen ? (
              <img src={calender} alt="close filter" />
            ) : (
              <img src={calender} alt="open filter" />
            )}
          </button>
        </div>

        {isDatePickerOpen && (
          <div className="mb-4 flex justify-center">
            <div className="w-[90%] max-w-md bg-white rounded-lg shadow-md overflow-y-auto">
              <DateRangePicker
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                moveRangeOnFirstSelection={false}
              />
            </div>
          </div>
        )}

        {filteredScheduledAuctions.length > 0 ? (
          <>
            <ul className="space-y-4">
              {filteredScheduledAuctions.map((auction) => (
                <li
                  key={auction.id}
                  className="border-gray-500 rounded-lg p-4 bg-[#3868D4] text-white flex justify-between items-center"
                  onClick={() =>
                    navigate(`/auction/${auction.id}`, { state: { auction } })
                  }
                >
                  <div className="flex gap-3 justify-center items-center">
                    <img src={aucLogo} alt="" />
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-semibold">
                        {truncateText(auction.title)}
                      </div>
                      <div className="text-sm">
                        {new Date(auction.startTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src={chevronRight}
                      alt=""
                      className="w-[25px] h-[25px]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-gray-500 text-center">
            No scheduled auctions available within the selected date range.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
