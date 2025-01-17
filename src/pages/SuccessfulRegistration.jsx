import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles, PartyPopper } from "lucide-react";
import Header from "../components/Header";

const Confetti = () => {
  const colors = ["#1F41BB", "#4F46E5", "#818CF8", "#60A5FA", "#FCD34D"];
  const confettiElements = Array.from({ length: 100 }).map((_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? "circle" : "square",
    scale: 0.8 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-5 pointer-events-none top-16 opacity-75">
      {confettiElements.map((confetti) => (
        <div
          key={confetti.id}
          className="absolute animate-confetti-fall"
          style={{
            left: confetti.left,
            animationDelay: confetti.delay,
            top: -20,
          }}
        >
          <div
            style={{
              width: `${confetti.size}px`,
              height: `${confetti.size}px`,
              backgroundColor: confetti.color,
              borderRadius: confetti.shape === "circle" ? "50%" : "2px",
              transform: `rotate(${confetti.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const SuccessRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auction } = location.state || {};

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);

    const handleBackButton = (event) => {
      event.preventDefault();
      navigate("/home", { replace: true });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  useEffect(() => {
    if (!auction) {
      navigate("/home", { replace: true });
    }
  }, [auction, navigate]);

  return (
    <div className="w-full h-dvh flex flex-col justify-between pb-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="z-10">
        <Header heading="Enter Auction" />
      </div>

      <Confetti />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 z-10">
        <div className="rounded-full bg-blue-100 p-8 shadow-lg">
          <PartyPopper size={48} className="text-blue-700" />
        </div>

        <div className="text-center px-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <h1 className="font-bold text-4xl mb-4 text-blue-700">Woohoo!</h1>
            <p className="text-lg text-black mx-auto font-medium">
              You're all set to join the auction! Get ready for an exciting
              bidding experience.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 w-full mx-auto z-20">
        <button
          className="opacity-100 w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold
                    shadow-lg transition-all duration-200 hover:bg-blue-500
                    active:transform active:scale-98"
          onClick={() =>
            navigate(`/auctionRoom/${auction.id}`, { state: { auction } })
          }
        >
          Enter Auction Room
        </button>
      </div>
    </div>
  );
};

export default SuccessRegister;
