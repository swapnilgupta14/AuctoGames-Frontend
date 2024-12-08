import { useNavigate } from "react-router-dom";
import splashImg from "../assets/Rectangle 1.svg";

const Splash = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("shopCoToken");
    console.log(token);
    if (token) {
      navigate("/home");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="w-full h-dvh bg-[#050F40] flex flex-col justify-center items-center gap-3 py-4 overflow-hidden">
      <div className="-mt-3">
        <img
          src={splashImg}
          alt="Splash Screen Banner for Cricket Auction"
          className="w-[90vw] max-w-[590px] h-auto"
        />
      </div>
      <div className="flex flex-col gap-3 justify-center items-center w-full px-4 h-[30%]">
        <div className="font-bold text-[5vw] md:text-[26px] text-center text-white w-full">
          Discover the Thrill of Cricket Auction
        </div>
        <div className="text-[3vw] md:text-[13px] text-center text-white w-full">
          Experience Cricket Auctions, auction updates, and exclusive content
          from Aucto Gaming.
        </div>
        <button
          className="w-full max-w-[95%] bg-white text-[#050F40] py-3 rounded-3xl font-bold text-[4vw] md:text-[18px]"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Splash;
