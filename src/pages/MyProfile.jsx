import Header from "../components/Header"
import { useEffect, useState } from 'react';
import bellIcon from "../assets/bellIcon.svg";
import rightArr from "../assets/rightArrWhite.svg";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profile from "../assets/profile.svg"
import privacy from "../assets/privacy.svg"
import rules from "../assets/rules.svg"
import tnc from "../assets/t&c.svg"
import leftArr from "../assets/leftArr.png"
import whatsapp from "../assets/whatsapp.svg"
import user from "../assets/user (2).png"
import setting from "../assets/setting.svg"
import gameHistory from "../assets/gameHistory.svg"
import notification from "../assets/notification.svg"
import search from "../assets/search.svg"
import logout from "../assets/logout.svg"
import gift from "../assets/gift.svg"

const MyProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useSelector((state) => state.user);

    const dataArr = [{
        image: setting,
        text: "Your Profile",
        leftArr: leftArr
    }, {
        image: gameHistory,
        text: "Game History",
        leftArr: leftArr
    }, {
        image: notification,
        text: "Your Transactions",
        leftArr: leftArr
    }, {
        image: search,
        text: "Search History",
        leftArr: leftArr
    }, {
        image: logout,
        text: "LogOut",
        leftArr: leftArr
    },]
    return (
        <div className="w-[100%] h-[100vh]">
            <Header heading={"My Profile"}></Header>
            <div className="flex flex-col gap-10 justify-center items-center w-[100%] mt-[15%]">
                <div className="flex flex-col justify-center items-center  rounded-lg border-red-500 w-[90%] py-10 shadow-lg shadow-slate-500/50 gap-2">
                    <div className="w-[70px] h-[70px] border-2 border-blue-700 rounded-full flex justify-center items-center">
                        <img src={user} alt="" className="w-[40px] h-[40px]" />
                    </div>
                    <div className="font-bold text-[22px]">
                        {username}
                    </div>
                </div>

                <div className="flex flex-col items-center  border-red-500 w-[90%] rounded-lg gap-4 py-4 shadow-lg shadow-slate-500/50">

                    {
                        dataArr?.map((item) => (
                            <div className="flex justify-between items-center  border-green-500 w-[90%]">
                                <div className="flex justify-between items-center py-2 gap-3">
                                    <div className="w-[30px] h-[30px] rounded-full border flex justify-center items-center bg-[#4754F0]/10">
                                        <img src={item.image} alt="" className="w-[20px] h-[20px]" />
                                    </div>
                                    <div className="font-bold text-[18px]">
                                        {item.text}
                                    </div>
                                </div>

                                <div>
                                    <img src={item.leftArr} alt="" />
                                </div>
                            </div>
                        ))
                    }

                    <div className="flex justify-center items-center rounded-md p-3 py-4 bg-[#BAB9D0]/50 w-[95%] gap-6 mt-2">
                        <div>
                            <img src={gift} alt="" className="w-[35px] h-[35px]" />
                        </div>

                        <div className="flex flex-col ">
                            <div className="text-[16px] font-bold">
                            Invite your friends
                            </div>

                            <div className="text-[13px] font-medium text-[#4754F0]">
                            And get a chance to win the giveaway
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyProfile