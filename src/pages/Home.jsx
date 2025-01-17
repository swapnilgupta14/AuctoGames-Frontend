import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import aucLogo from "../assets/pl logo.svg";
import chevronRight from "../assets/chevron-circle-right-Regular.svg";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Calendar, Hammer, HouseIcon } from "lucide-react";

const carouselStyles = {
  container:
    "relative w-full h-[280px] overflow-hidden flex flex-col items-center",
  slide:
    "w-full overflow-hidden rounded-xl h-[280px] flex gap-4 items-center justify-center text-white font-bold bg-gray-300 rounded-xl absolute top-0 left-0 transition-transform duration-500",
  dotsContainer: "absolute bottom-2 flex gap-2",
  dot: "w-3 h-3 rounded-full bg-gray-300 cursor-pointer",
  activeDot: "w-3 h-3 rounded-full bg-blue-500",
  skeletonContainer:
    "relative w-[93%] h-[270px] m-4 bg-gray-200 animate-pulse rounded-xl",
};

const LiveAuctionSkeleton = () => (
  <div className={carouselStyles.skeletonContainer}>
    <div className="absolute top-4 right-6 bg-zinc-400 px-4 rounded-lg h-6 w-20"></div>
  </div>
);

const AuctionListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse flex items-center p-4 bg-gray-100 rounded-lg"
      >
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
    ))}
  </div>
);

const DateRangeDisplay = ({ startDate, endDate }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
      <Calendar className="w-4 h-4 text-gray-600" />
      <span className="text-gray-700 text-sm">
        {formatDate(startDate)} - {formatDate(endDate)}
      </span>
    </div>
  );
};

const CACHE_KEY = "auction_data_cache";

const getCachedData = () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};

const Home = () => {
  const { username } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState(getCachedData() || []);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [currentLiveSlide, setCurrentLiveSlide] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!getCachedData());
  const [selectedTab, setSelectedTab] = useState("SCHEDULED");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const carouselRef = useRef(null);
  const autoSlideTimerRef = useRef(null);

  const calculateDateRange = (isCompleted = false) => {
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    if (isCompleted) {
      startDate.setDate(today.getDate() - 14);
    } else {
      endDate.setDate(today.getDate() + 14);
    }

    return [
      {
        startDate,
        endDate,
        key: "selection",
      },
    ];
  };

  const [dateRange, setDateRange] = useState(calculateDateRange());

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setDateRange(calculateDateRange(tab === "COMPLETED"));
  };

  const startAutoSlide = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentLiveSlide((prev) => (prev + 1) % liveAuctions.length);
    }, 5000);
  }, [liveAuctions.length]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
  }, []);

  const handleTouchStart = (e) => {
    stopAutoSlide();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    if (swipeDistance > 75) {
      nextSlide();
    } else if (swipeDistance < -75) {
      prevSlide();
    }
    startAutoSlide();
  };

  const nextSlide = useCallback(() => {
    setCurrentLiveSlide((prev) => (prev + 1) % liveAuctions.length);
  }, [liveAuctions.length]);

  const prevSlide = useCallback(() => {
    setCurrentLiveSlide(
      (prev) => (prev - 1 + liveAuctions.length) % liveAuctions.length
    );
  }, [liveAuctions.length]);

  const fetchAuctions = useCallback(async () => {
    try {
      const response = await fetch(
        "https://server.rishabh17704.workers.dev/api/auctions/getallstatus"
      );
      if (!response.ok) throw new Error("Failed to fetch auction data");
      const data = await response.json();

      setAuctions(data.auctions);
      setCachedData(data.auctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      if (!auctions.length) {
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [auctions.length]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const { allLiveAuctions, allScheduledAuctions, allCompletedAuctions } =
    useMemo(() => {
      const allLiveAuctions = auctions.filter(
        (auction) => auction.status === "LIVE"
      );
      const allScheduledAuctions = auctions.filter(
        (auction) => auction.status === "SCHEDULED"
      );
      const allCompletedAuctions = auctions.filter(
        (auction) => auction.status === "COMPLETED"
      );
      return { allLiveAuctions, allScheduledAuctions, allCompletedAuctions };
    }, [auctions]);

  useEffect(() => {
    setLiveAuctions(allLiveAuctions);
    setScheduledAuctions(allScheduledAuctions);
    setCompletedAuctions(allCompletedAuctions);

    const newFilteredAuctions =
      selectedTab === "SCHEDULED" ? allScheduledAuctions : allCompletedAuctions;
    setFilteredAuctions(newFilteredAuctions);
  }, [
    selectedTab,
    allLiveAuctions,
    allScheduledAuctions,
    allCompletedAuctions,
  ]);

  useEffect(() => {
    if (liveAuctions.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [liveAuctions, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    let filtered;

    const parseDate = (dateString) => {
      const [datePart, timePart] = dateString.split(", ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    filtered = (
      selectedTab === "SCHEDULED" ? scheduledAuctions : completedAuctions
    ).filter((auction) => {
      const auctionStartDate = parseDate(auction.startTime);
      const auctionEndDate = parseDate(auction.endTime);
      return auctionStartDate >= startDate && auctionEndDate <= endDate;
    });

    setFilteredAuctions(filtered);
  }, [dateRange, scheduledAuctions, completedAuctions, selectedTab]);

  const truncateText = (text = "", maxLength = 20) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="w-full">
      <Header
        heading={
          <p className="flex gap-2 items-center justify-start -ml-4">
            <HouseIcon />
            <span>Welcome, {username?.split(" ")[0]}</span>
          </p>
        }
        backAllowed={false}
        homeAllowed={false}
      />

      {isLoading ? (
        <LiveAuctionSkeleton />
      ) : liveAuctions.length > 0 ? (
        <div className="p-3">
          <div
            className={carouselStyles.container}
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {liveAuctions.map((auction, index) => (
              <div
                key={auction.id}
                className={carouselStyles.slide}
                style={{
                  transform: `translateX(${(index - currentLiveSlide) * 100}%)`,
                  zIndex: index === currentLiveSlide ? 10 : 1,
                }}
                onClick={() =>
                  navigate(`/auction/${auction.id}`, { state: { auction } })
                }
              >
                <div className="w-full h-full">
                  {auction?.imageUrl ? (
                    <img
                      src={auction.imageUrl}
                      alt={auction.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
                      <Hammer
                        size={64}
                        className="text-gray-400"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>

                <div className="w-[98%] truncate absolute bottom-1 left-1 bg-white shadow-xl text-gray-500 font-medium px-4 flex justify-center pb-7 pt-3 rounded-xl items-center">
                  <div>{auction.title}</div>
                </div>

                <div
                  className={`text-xs absolute top-4 right-4 ${
                    auction?.status === "COMPLETED"
                      ? "bg-blue-600"
                      : "bg-red-500"
                  } px-3 py-1 rounded-3xl font-light flex justify-center items-center gap-2`}
                >
                  <div className="font-medium py-0">
                    {auction?.currStatusofAuction === "LIVE" ||
                    auction?.status === "LIVE"
                      ? "LIVE"
                      : auction?.status}
                  </div>
                  <div className="w-[5px] h-[5px] bg-white rounded-full"></div>
                </div>
              </div>
            ))}

            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 h-6 w-6 rounded-full z-20"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 h-6 w-6 rounded-full z-20"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              &gt;
            </button>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {liveAuctions.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    index === currentLiveSlide ? "bg-blue-700" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentLiveSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          No live auctions available.
        </div>
      )}

      <div className="my-3 px-3">
        <div className="flex mb-4 bg-gray-100 p-1 rounded-lg text-sm">
          <button
            className={`flex-1 py-2 rounded-lg transition-all ${
              selectedTab === "SCHEDULED"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => handleTabChange("SCHEDULED")}
          >
            Scheduled
          </button>
          <button
            className={`flex-1 py-2 rounded-lg transition-all ${
              selectedTab === "COMPLETED"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => handleTabChange("COMPLETED")}
          >
            Completed
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <DateRangeDisplay
            startDate={dateRange[0].startDate}
            endDate={dateRange[0].endDate}
          />
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isDatePickerOpen && (
          <div className="flex justify-center relative">
            <div className="w-[100%] bg-white rounded-lg shadow-md overflow-y-auto absolute top-0 flex items-center justify-center">
              <DateRangePicker
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                moveRangeOnFirstSelection={false}
                staticRanges={[]}
                inputRanges={[]}
              />
              <style>
                {`
          .rdrDefinedRangesWrapper {
            display: none;
          }
        `}
              </style>
            </div>
          </div>
        )}

        {isLoading ? (
          <AuctionListSkeleton />
        ) : filteredAuctions.length > 0 ? (
          <ul className="space-y-4">
            {filteredAuctions.map((auction) => (
              <li
                key={auction.id}
                className="border-gray-500 rounded-lg p-4 bg-[#3868D4] text-white flex justify-between items-center cursor-pointer hover:bg-[#2d52a8] transition-colors"
                onClick={() =>
                  navigate(`/auction/${auction.id}`, { state: { auction } })
                }
              >
                <div className="flex gap-3 items-center">
                  <img src={aucLogo} alt="" className="w-12 h-12" />
                  <div>
                    <div className="text-lg font-semibold">
                      {truncateText(auction.title)}
                    </div>
                    <div className="text-sm opacity-90">
                      {auction.startTime}
                    </div>
                  </div>
                </div>
                <img
                  src={chevronRight}
                  alt="View details"
                  className="w-6 h-6"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center bg-gray-100 rounded-xl py-8 px-8">
            No {selectedTab.toLowerCase()} auctions available within the
            selected date range.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
