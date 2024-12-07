import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main CSS file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import bellIcon from "../assets/bellIcon.svg";
import aucLogo from "../assets/pl logo.svg";
import chevronRight from "../assets/chevron-circle-right-Regular.svg";
import calender from "../assets/Calendar.svg"
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const carouselStyles = {
    container: 'relative w-full h-[300px] overflow-hidden flex flex-col items-center mt-4 border border-red-600',
    slide: 'w-[95%] rounded-xl h-[300px] flex items-center justify-center text-white font-bold bg-gray-500',
    dotsContainer: 'absolute bottom-2 flex gap-2',
    dot: 'w-3 h-3 rounded-full bg-gray-300 cursor-pointer',
    activeDot: 'w-3 h-3 rounded-full bg-blue-500',
};

const Home = () => {
    const { username } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [scheduledAuctions, setScheduledAuctions] = useState([]);
    const [filteredScheduledAuctions, setFilteredScheduledAuctions] = useState([]);
    const [currentLiveSlide, setCurrentLiveSlide] = useState(0);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    // console.log("liveActions: ", liveAuctions);

    // Fetch auctions from API
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('https://server.rishabh17704.workers.dev/api/auctions/getall');
                const data = await response.json();
                setAuctions(data.auctions);

                // Filter live auctions
                const live = data.auctions.filter((auction) => auction.status === 'LIVE');
                setLiveAuctions(live);

                // Filter scheduled auctions
                const scheduled = data.auctions.filter((auction) => auction.status === 'SCHEDULED');
                setScheduledAuctions(scheduled);
                setFilteredScheduledAuctions(scheduled); // Default to all scheduled auctions
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

        fetchAuctions();
    }, []);

    // Filter scheduled auctions by date range
    useEffect(() => {
        const { startDate, endDate } = dateRange[0];
        // console.log(startDate, endDate, "dates");
        if (!startDate || !endDate) {
            // Show all scheduled auctions when no date range is selected
            setFilteredScheduledAuctions(scheduledAuctions);
        } else {
            console.log(scheduledAuctions, "scheduledAuction");
            const filtered = scheduledAuctions.filter((auction) => {
                const auctionDate = new Date(auction.startTime);
                return auctionDate >= startDate && auctionDate <= endDate;
            });
            console.log(filtered, "filtered");
            setFilteredScheduledAuctions(filtered);
        }
    }, [dateRange, scheduledAuctions]);

    // Carousel navigation
    const nextSlide = () => {
        setCurrentLiveSlide((prev) => (prev + 1) % liveAuctions.length);
    };

    const prevSlide = () => {
        setCurrentLiveSlide((prev) => (prev - 1 + liveAuctions.length) % liveAuctions.length);
    };

    return (
        <div className='w-[100%]'>
            {/* Header */}
            {/* <div className='w-full h-[65px] border border-black bg-[#1F41BB] flex justify-between items-center px-4'>
                <div className='font-medium text-[24px] text-white'>
                    Welcome, {username.split(" ")[0]}
                </div>

                <div className='flex justify-center items-center gap-6'>
                    <div>
                        <img src={bellIcon} alt="Notifications" />
                    </div>
                    <div className='border border-white w-[30px] h-[30px] rounded-full flex justify-center items-center text-white font-medium text-[16px]'>
                        <div>{username.split(" ")[0].split("")[0].toUpperCase()}</div>
                    </div>
                </div>
            </div> */}

            <Header heading={`Welcome, ${username.split(" ")[0]}`}></Header>

            {/* {JSON.stringify(liveAuctions)} */}

            {/* Live Auctions Carousel */}
            {liveAuctions.length > 0 && (
                <div className={carouselStyles.container}>
                    {/* Slides */}
                    {liveAuctions.map((auction, index) => (
                        <div
                            key={auction.id}
                            className={`${carouselStyles.slide} ${currentLiveSlide === index ? 'block' : 'hidden'}`}
                            onClick={() => navigate(`/auction/${auction.id}`, { state: { auction } })}
                        >
                            <div>
                                <img
                                    src={`https://via.placeholder.com/600x300?text=${auction.title}`}
                                    alt={auction.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-4 right-4 bg-red-500 px-4  rounded-lg font-light flex justify-center items-center gap-2 py-[1px]">
                                <div className='mb-[3px]'>Live</div>
                                <div className='w-[5px] h-[5px] bg-white rounded-full '></div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Dots */}
                    <div className={carouselStyles.dotsContainer}>
                        {liveAuctions.map((_, index) => (
                            <div
                                key={index}
                                className={`${carouselStyles.dot} ${currentLiveSlide === index ? carouselStyles.activeDot : ''
                                    }`}
                                onClick={() => setCurrentLiveSlide(index)}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
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
            )}

            {/* No Live Auctions */}
            {liveAuctions.length === 0 && (
                <div className="mt-4 text-center text-gray-500">
                    No live auctions available.
                </div>
            )}

            {/* Scheduled Auctions Section */}
            <div className="mt-8 px-4">
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Upcoming Auctions</h2>

                    {/* Filter by Date Button */}
                    <button
                        className=" px-4 py-2 rounded-lg mb-3"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                        {isDatePickerOpen ? <img src={calender} alt="close filter" /> : <img src={calender} alt="open filter" />}
                    </button>
                </div>

                {/* Date Picker */}
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
                    <ul className="space-y-4">
                        {filteredScheduledAuctions.map((auction) => (
                            <li
                                key={auction.id}
                                className="border-gray-500 rounded-lg p-4 bg-[#3868D4] text-white flex justify-between items-center"
                                onClick={() => navigate(`/auction/${auction.id}`, { state: { auction } })}
                            >
                                <div className='flex gap-3 justify-center items-center'>
                                    <img src={aucLogo} alt="" />
                                    <div className='flex flex-col gap-2'>
                                        <div className="text-lg font-semibold ">{auction.title}</div>
                                        <div className="text-sm ">
                                            {new Date(auction.startTime).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img src={chevronRight} alt="" className='w-[25px] h-[25px]' />
                                </div>
                            </li>
                        ))}
                    </ul>
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

