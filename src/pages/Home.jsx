import { useEffect, useState, useRef, useCallback } from "react";
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
    "relative w-full h-[280px] overflow-hidden flex flex-col items-center",
  slide:
    "w-full overflow-hidden rounded-xl h-[280px] flex gap-4 items-center justify-center text-white font-bold bg-gray-500 rounded-xl absolute top-0 left-0 transition-transform duration-500",
  dotsContainer: "absolute bottom-2 flex gap-2",
  dot: "w-3 h-3 rounded-full bg-gray-300 cursor-pointer",
  activeDot: "w-3 h-3 rounded-full bg-blue-500",
  skeletonContainer:
    "relative w-[96%] h-[280px] m-4 bg-gray-200 animate-pulse rounded-xl",
};

const LiveAuctionSkeleton = () => (
  <div className={carouselStyles.skeletonContainer}>
    <div className="absolute top-4 right-6 bg-zinc-400 px-4 rounded-lg h-6 w-20"></div>
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

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const carouselRef = useRef(null);
  const autoSlideTimerRef = useRef(null);

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

  useEffect(() => {
    if (liveAuctions.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [liveAuctions, startAutoSlide, stopAutoSlide]);

  const handleTouchStart = (e) => {
    stopAutoSlide();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentLiveSlide(currentLiveSlide)
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      setCurrentLiveSlide(currentLiveSlide)
      prevSlide();
    }

    startAutoSlide();
  };

  const nextSlide = () => {
    setCurrentLiveSlide((prev) => (prev + 1) % liveAuctions.length);
  };

  const prevSlide = () => {
    setCurrentLiveSlide(
      (prev) => (prev - 1 + liveAuctions.length) % liveAuctions.length
    );
  };

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

  const truncateText = (text, maxLength = 20) => {
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
                className={`${carouselStyles.slide}`}
                style={{
                  transform: `translateX(${(index - currentLiveSlide) * 100}%)`,
                  zIndex: index === currentLiveSlide ? 10 : 1,
                }}
                onClick={() =>
                  navigate(`/auction/${auction.id}`, { state: { auction } })
                }
              >
                <div className="w-full h-full">
                  <img
                    src={
                      auction?.imageUrl ||
                      `https://via.placeholder.com/600x300?text=${auction.title}`
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover rounded-2xl "
                  />
                </div>

                <div className="w-[98%] truncate absolute bottom-1 left-1 bg-white shadow-xl text-gray-500 font-medium px-4 flex justify-center pb-7 pt-3 rounded-xl items-center">
                  <div>{auction.title}</div>
                </div>
                
                <div className={`text-xs absolute top-4 right-4 ${auction?.currStatusofAuction === "COMPLETED" ? "bg-blue-600" : "bg-red-500"} px-3 py-1 rounded-3xl font-light flex justify-center items-center gap-2`}>
                  <div className="font-medium py-1">
                    {auction?.currStatusofAuction === "LIVE" ||
                    auction?.currStatusofAuction === "COMPLETED"
                      ? auction?.currStatusofAuction
                      : auction?.status === "LIVE" && auction?.status}
                  </div>
                  <div className="w-[5px] h-[5px] bg-white rounded-full "></div>
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

      <div className="my-4 px-4">
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
          <div className="text-gray-400 text-center bg-gray-100 rounded-xl py-4">
            No scheduled auctions available within the selected date range.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
