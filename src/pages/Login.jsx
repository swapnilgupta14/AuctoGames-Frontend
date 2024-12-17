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
      formErrors.email = "Username or Email is required";
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
    <div>
      {/* Header */}
      <div className="w-full h-[50px] flex items-center px-2 gap-2">
        <div className="cursor-pointer" onClick={() => navigate(-1)}>
          <img src={rightArr} alt="Back" className="w-[20px] h-[25px]" />
        </div>
        <div className="text-center flex justify-center items-center font-bold text-[18px] w-[97%] text-[#1F41BB]">
          LogIn
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-fit">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full lg:h-[400px] object-fill"
        />
        <div className="absolute top-10 left-10 text-white font-semibold text-[20px] w-[80%] text-center">
          Welcome chief you’ve been missed!
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center items-center mx-auto w-[90%] -mt-5 gap-5">
        <div className="flex flex-col gap-5 w-[95%]">
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border rounded-lg h-[45px] bg-white px-3 z-10 ${
              errors.email ? "border-red-500" : "border-black"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-lg h-[45px] bg-white px-3 w-full ${
                errors.password ? "border-red-500" : "border-black"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              <img
                src={showPassword ? hide : view}
                alt={showPassword ? "Hide password" : "Show password"}
                className="w-5 h-5"
              />
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <span
          className="self-end mr-2 text-[#1F41BB] font-semibold text-[14px] cursor-pointer"
          onClick={() => navigate("/fpp")}
        >
          Forgot your password?
        </span>
        {loading ? (
          <button className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px] opacity-50">
            Signing...
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-[95%] bg-[#1F41BB] text-white py-3 rounded-lg font-semibold text-[18px]"
          >
            Sign in
          </button>
        )}

        <span className="mr-2 font-semibold text-[14px] flex gap-2">
          <span>New to the game? </span>
          <span
            className="text-[#1F41BB] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </span>
        <span className="mr-2 text-[#1F41BB] font-semibold text-[14px] flex gap-2">
          <span>or continue with</span>
        </span>
        <div className="border p-2 rounded-md cursor-pointer">
          <img src={googleImage} alt="Google" className="w-[25px] h-[25px]" />
        </div>
      </div>
      <div>
        <img src={dsgnElem} alt="Design Element" />
      </div>
    </div>
  );
};

export default Login;
