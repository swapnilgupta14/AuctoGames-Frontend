import bellIcon from "../assets/bellIcon.svg";
import rightArr from "../assets/rightArrWhite.svg";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "../assets/Confetti.svg";
import { useSelector } from "react-redux";
import Header from "../components/Header";

const SuccessRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, token, userId } = useSelector((state) => state.user);
  const { auction } = location.state;
  console.log(auction, "onSucess auction data");

  return (
    <div className="w-full h-dvh flex flex-col  border-red-600 justify-between pb-3">
      <Header heading={"Enter Auction"}></Header>
      <div className="h-fit w-full  border-green-500 mt-[5%] relative">
        <img src={confetti} alt="" className="" />

        <div className="flex flex-col w-fit mx-auto absolute  border-green-500 top-[40%] left-[6%]">
          <span className="font-bold text-[40px] text-center">Woohoo!</span>
          <p className="w-[340px] text-center text-[16px]">
            You Can Enter the Auction!{" "}
          </p>
        </div>
      </div>

      <div className="w-full px-2">
        <button
          className="w-full bg-[#1F41BB] text-white py-3 rounded-lg text-xl"
          onClick={() =>
            navigate(`/auctionRoom/${auction.id}`, { state: { auction } })
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessRegister;
