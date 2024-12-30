import React, { useState } from 'react';
import rightArr from "../assets/Vector.svg";
import heroImg from "../assets/image 1.png";
import googleImage from "../assets/Vector (4).svg";
import dsgnElem from "../assets/IPL_Auction_SIGN_UP__2_-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import view from "../assets/show.png";
import hide from "../assets/hide.png";
import { ArrowLeft } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            {/* Header - Updated to match Login style */}
            <div className="w-full h-16 flex items-center px-4 shadow-sm bg-white">
                <div
                    className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={22} color="#1F41BB" />
                </div>
                <div className="text-start flex-1 font-bold text-xl text-[#1F41BB]">
                    Create Account
                </div>
            </div>

            {/* Hero Section - Updated to match Login style */}
            <div className="relative w-full h-[30vh] overflow-hidden">
                <img
                    src={heroImg}
                    alt="Hero"
                    className="w-full h-full object-cover brightness-[0.85]"
                />
                <div className="absolute inset-0 flex top-10 left-0 justify-center">
                    <div className="text-white font-semibold text-xl md:text-3xl text-center px-14 drop-shadow-lg">
                        Welcome aboard, Hop into the world of IPL Auctions.
                    </div>
                </div>
            </div>

            {/* Form Section - Updated to match Login style */}
            <div className="flex flex-col items-center px-5 -mt-20 relative z-10">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all ${
                                    showPassword ? "bg-gray-100" : ""
                                }`}
                            >
                                <img
                                    src={showPassword ? hide : view}
                                    alt={showPassword ? "Hide password" : "Show password"}
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                            <button
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all ${
                                    showConfirmPassword ? "bg-gray-100" : ""
                                }`}
                            >
                                <img
                                    src={showConfirmPassword ? hide : view}
                                    alt={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="text-red-500 text-sm pl-1">
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold text-md hover:bg-[#1F41BB]/90 transition-all transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-white text-sm text-gray-500">
                                or continue with
                            </span>
                        </div>
                    </div>

                    <button className="w-full border border-gray-400 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                        <img src={googleImage} alt="Google" className="w-5 h-5" />
                        <span className="text-gray-600 font-medium">Google</span>
                    </button>

                    <p className="text-center text-gray-600">
                        Already have an account?{" "}
                        <button
                            className="text-[#1F41BB] font-semibold hover:underline"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
