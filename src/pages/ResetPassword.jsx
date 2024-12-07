import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import rightArr from "../assets/Vector.svg";
import heroImg from "../assets/image 1.png";
import dsgnElem from "../assets/IPL_Auction_SIGN_UP__2_-removebg-preview 1.svg";
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token, email } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("from reset page : ", token, email)
    }, [token, email]);

    async function ChangePasswordCall(data) {
        setLoading(true);
        try {
            let url = "https://server.rishabh17704.workers.dev/api/resetPass";
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const finalRes = await response.json();

            if (finalRes.error === "P2002") {
                toast.error("User already registered");
                setLoading(false);
                return;
            }

            if (finalRes.status === 411) {
                toast.error("Invalid inputs");
                setLoading(false);
                return;
            }

            if (finalRes.status === 201) {
                toast.success("Password Changed Successfully");
                setLoading(false);
                return navigate("/login");
            }else{
                toast.error("Reset Link used")
                setLoading(false);
                // return("/login")
            }

            setLoading(false);

        } catch (error) {
            console.log("some error occurred", error);
            toast.error(error.message);
            setLoading(false);
            return navigate("/login");
        }
    }

    const handleSignUp = () => {
        if (!password || !confirmPassword) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setErrorMessage('');
        const userDetails = { password, token, email };
        ChangePasswordCall(userDetails);
    };

    return (
        <div>
            {/* header */}
            <div className="w-full border-blue-500 h-[50px] flex items-center px-2 gap-2">
                <div className="border-green-500">
                    <img src={rightArr} alt="" className="w-[20px] h-[25px]" onClick={() => navigate(-1)} />
                </div>
                <div className="text-center flex justify-center items-center font-bold text-[18px] border-red-500 w-[97%] text-[#1F41BB]">
                    Reset Password
                </div>
            </div>

            {/* hero image */}
            <div className="relative w-full h-fit border-blue-500">
                <img src={heroImg} alt="" className="w-full lg:h-[400px] object-fill" />
                <div className="absolute top-10 left-10 text-white font-semibold text-[20px] w-[80%] text-center">
                    Welcome aboard, Hop into the world of IPL Auctions.
                </div>
            </div>

            {/* form */}
            <div className="flex flex-col justify-center items-center mx-auto border-green-500 w-[90%] -mt-5 gap-5">
                <div className="flex flex-col gap-5 w-[95%]">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black rounded-lg h-[45px] bg-white z-10 px-3 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-black rounded-lg h-[45px] bg-white z-10 px-3 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 font-semibold text-[14px] mb-2">
                        {errorMessage}
                    </div>
                )}
                {
                    loading ? (
                        <button className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px] opacity-50">
                            Reset
                        </button>
                    ) : (
                        <button
                            onClick={handleSignUp}
                            className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px]"
                        >
                            Reset
                        </button>
                    )
                }
            </div>

            <div>
                <img src={dsgnElem} alt="" />
            </div>
        </div>
    );
};

export default ResetPassword;
