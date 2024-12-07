import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { validateAuctionRegistration } from "../api/fetch";

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);

  const userId = useSelector((state) => state.user.userId);
  const { id } = useParams();
  const location = useLocation();
  const { auction } = location.state;

  const validateUser = async (auctionId, userId) => {
    try {
      setIsLoading(true);
      const res = await validateAuctionRegistration(Number(auctionId), userId);
      
      console.log("Validation Response:", res);

      if (res?.status === "registered") {
        setRegistrationData(res);
        startCountdown();
      } else {
        setIsEligible(true);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setIsEligible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdownTimer(3);
    const countdownInterval = setInterval(() => {
      setCountdownTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate("/successregister", { 
            state: { 
              auction, 
              registrationData 
            } 
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!id || !userId) return;
    validateUser(id, userId);
  }, [id, userId]);

  return (
    <div className="relative pb-20">
      <Header heading={"Upcoming Auction"}></Header>
      
      <div className="p-4 ">
        <img
          src={"https://via.placeholder.com/600x300"}
          alt={auction.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        
        <h1 className="text-[20px] font-bold mt-4 px-3">{auction.title}</h1>
        
        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">Date-Time :</span>{" "}
          {new Date(auction.startTime).toLocaleString()}
        </p>
        
        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">
            Min Duration Required : 2hr
          </span>{" "}
        </p>
        
        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">
            Min Wallet Amount : 100 Cr
          </span>{" "}
        </p>
        
        <p className="text-lg mt-2 text-gray-700 px-3">
          <span className="font-bold text-[14px]">
            Registration Fee :{" "}
          </span>{" "}
          {auction.registrationFee}
        </p>
        
        <p className="text-base mt-4 text-gray-600 text-justify px-3">
          {auction.description}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        {isLoading ? (
          <div className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg w-full font-medium text-[16px] text-center">
            Validating registration...
          </div>
        ) : countdownTimer > 0 ? (
          <div className="px-4 py-3 bg-[#1F41BB] text-white rounded-lg w-full font-medium text-[16px] text-center">
            Entering the auction in {countdownTimer}...
          </div>
        ) : (
          isEligible ? (
            <button
              className="px-4 py-3 bg-[#1F41BB] text-white rounded-lg w-full font-medium text-[16px]"
              onClick={() => navigate(`/register/${id}`, { state: { auction } })}
            >
              Register in Auction
            </button>
          ) : (
            <div className="px-4 py-3 bg-red-500 text-white rounded-lg w-full font-medium text-[16px] text-center">
              You are not eligible to register
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;