import React, { useState } from 'react';
import rightArr from "../assets/Vector.svg";
import heroImg from "../assets/image 1.png";
import googleImage from "../assets/Vector (4).svg";
import dsgnElem from "../assets/IPL_Auction_SIGN_UP__2_-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import view from "../assets/show.png";
import hide from "../assets/hide.png";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    async function registerUser(data) {
        setLoading(true);
        console.log("data is : ", data);

        try {
            let url = "https://server.rishabh17704.workers.dev/api/users/register";
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
                console.log(finalRes);
                localStorage.setItem("userId", finalRes.user.userId);
                toast.success("Submitted successfully");
                return navigate("/login");
            } else {
                toast.error("Some error occurred");
            }

            setLoading(false);
        } catch (error) {
            console.log("Some error occurred", error);
            toast.error("Some error occurred");
            setLoading(false);
        }
    }

    const handleSignUp = () => {
        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setErrorMessage('');
        const userDetails = { username, email, password };
        registerUser(userDetails);
        console.log('User Details:', userDetails);
    };

    return (
        <div className='h-[100vh] border-green-500'>
            {/* header */}
            <div className="w-full border-blue-500 h-[50px] flex items-center px-2 gap-2">
                <div>
                    <img src={rightArr} alt="" className="w-[20px] h-[25px]" onClick={() => navigate(-1)} />
                </div>
                <div className="text-center font-bold text-[18px] w-[97%] text-[#1F41BB]">
                    Sign Up
                </div>
            </div>

            {/* hero image */}
            <div className="relative w-full h-fit">
                <img src={heroImg} alt="" className="w-full lg:h-[400px] object-fill" />
                <div className="absolute top-10 left-10 text-white font-semibold text-[20px] w-[80%] text-center">
                    Welcome aboard, Hop into the world of IPL Auctions.
                </div>
            </div>

            {/* form */}
            <div className="flex flex-col justify-center items-center mx-auto w-[90%] -mt-5 gap-5">
                <div className="flex flex-col gap-5 w-[95%]">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-black rounded-lg h-[45px] bg-white px-3 z-10"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-black rounded-lg h-[45px] bg-white px-3"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            minLength={6}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black rounded-lg h-[45px] bg-white px-3 w-full"
                        />
                        <img
                            src={showPassword ? hide : view}
                            alt="toggle visibility"
                            className="absolute right-3 top-[12px] w-6 h-6 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-black rounded-lg h-[45px] bg-white px-3 w-full"
                        />
                        <img
                            src={showConfirmPassword ? hide : view}
                            alt="toggle visibility"
                            className="absolute right-3 top-[12px] w-6 h-6 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 font-semibold text-[14px] mb-2">
                        {errorMessage}
                    </div>
                )}
                {
                    loading ? <button
                        className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px] opacity-50"
                    >
                        Sign Up
                    </button> :
                        <button
                            onClick={handleSignUp}
                            className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px]"
                        >
                            Sign Up
                        </button>
                }

                <span className="mr-2 font-semibold text-[14px] flex gap-2">
                    <span>Already Signed Up ? </span>
                    <span className="text-[#1F41BB]" onClick={() => navigate("/login")}>Log In</span>
                </span>

                <span className="mr-2 text-[#1F41BB] font-semibold text-[14px] flex gap-2">
                    <span>or continue with</span>
                </span>

                <div className="border p-2 rounded-md">
                    <img src={googleImage} alt="" className="w-[25px] h-[25px]" />
                </div>
            </div>

            <div>
                <img src={dsgnElem} alt="" />
            </div>
        </div>
    );
};

export default SignUp;
