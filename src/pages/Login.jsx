import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import rightArr from "../assets/Vector.svg";
import heroImg from "../assets/image 1.png";
import googleImage from "../assets/Vector (4).svg";
import dsgnElem from "../assets/IPL_Auction_SIGN_UP-removebg-preview 1 (1).svg";
import toast from "react-hot-toast";
import view from "../assets/show.png";
import hide from "../assets/hide.png";
import { setUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function loginUser(data) {
    setLoading(true);

    try {
      let url = "https://server.rishabh17704.workers.dev/api/user/login";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const finalRes = await response.json();

      if (finalRes.status === 411) {
        toast.error("invalid inputs");
        setLoading(false);
        return;
      }

      if (finalRes.status === 404) {
        toast.error("user not found");
        setLoading(false);
        return;
      }

      if (finalRes.status === 400) {
        toast.error("Incorrect password");
        setLoading(false);
        return;
      }

      if (finalRes.status === 201) {
        const { user, token } = finalRes;
        localStorage.setItem("shopCoToken", finalRes.token);
        localStorage.setItem("userId", finalRes.user.id);
        localStorage.setItem("email", finalRes.user.email);

        const sessionExpiryTime =
          Date.now() + finalRes?.session_timeout * 60 * 1000;
        localStorage.setItem("SessionExpiryTime", sessionExpiryTime.toString());

        dispatch(
          setUser({
            userId: finalRes.user.id,
            email: user.email,
            username: user.username,
            token,
          })
        );
        toast.success("loggedIn successfully");
        setLoading(false);
        return navigate("/home");
      } else {
        toast.error("Some error occurred");
      }

      setLoading(false);
    } catch (error) {
      console.log("some error occurred", error);
      toast.error("Some error occurred");
      setLoading(false);
    }
  }

  const validateForm = () => {
    let formErrors = {};
    if (!email) {
      formErrors.email = "Email is required";
    }
    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password should be at least 6 characters";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      const userDetails = { email, password };
      loginUser(userDetails);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-blue-50">
      <div className="w-full h-16 flex items-center px-4 shadow-sm bg-white">
        <div
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22} color="#1F41BB" />
        </div>
        <div className="text-start flex-1 font-bold text-xl text-[#1F41BB]">
          Welcome Back
        </div>
      </div>

      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full h-full object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 flex top-10 left-0 justify-center">
          <div className="text-white font-semibold text-xl md:text-3xl text-center px-14 drop-shadow-lg">
            Welcome chief, you've been missed!
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-5 -mt-20 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm pl-1">{errors.email}</span>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all ${
                  showPassword ? "bg-gray-400" : ""
                }`}
              >
                <img
                  src={showPassword ? hide : view}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className={`w-5 h-5 `}
                />
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm pl-1">
                {errors.password}
              </span>
            )}
          </div>

          <div className="text-right">
            <button
              className="text-[#1F41BB] font-medium text-sm hover:underline"
              onClick={() => navigate("/fpp")}
            >
              Forgot your password?
            </button>
          </div>

          <button
            onClick={handleLogin}
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
                Signing in...
              </span>
            ) : (
              "Sign in"
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
            New to the game?{" "}
            <button
              className="text-[#1F41BB] font-semibold hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* <img src={dsgnElem} alt="Design Element" className="w-full mt-8" /> */}
    </div>
  );
};

export default Login;
