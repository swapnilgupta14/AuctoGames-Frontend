import React, { useState, useRef, useEffect } from "react";
import { generateOTP, verifyOTP, resendOTP } from "../api/fetch";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { CheckCircle2, Phone, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Kyc = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (timer > 0 && isOtpSent) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isOtpSent]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    try {
      setIsSending(true);
      await generateOTP(userId, `+91${phone}`);
      setIsOtpSent(true);
      setTimer(60);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer === 0) {
      try {
        setIsResending(true);
        const res = await resendOTP(userId, `+91${phone}`);
        if (res?.success) {
          toast.success("OTP resent successfully");
          setOtp(["", "", "", "", "", ""]);
          setTimer(60);
          setError("");
        }
      } catch (err) {
        setError("Failed to resend OTP. Please try again.");
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      setIsVerifying(true);
      const res = await verifyOTP(userId, otpValue);
      if (res?.success) {
        toast.success("Phone number verified successfully");
        setOtp(["", "", "", "", "", ""]);
        setError("");
        navigate("/profile");
        setIsVerified(true);
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isVerified) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const blockBackNavigation = () => {
      if (!isVerified) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", blockBackNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, [isVerified]);

  return (
    <div className="h-dvh w-full overflow-hidden">
      <Header
        heading={
          <p className="flex gap-2 items-center justify-start -ml-4">
            <span>Welcome, Complete KYC</span>
          </p>
        }
        backAllowed={false}
        homeAllowed={false}
        sidebar={false}
      />

      <div className="flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Phone Verification
            </h2>
            <p className="text-sm text-gray-600 text-center px-10">
              This step is mandatory before proceeding with KYC verification.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-50 px-3 py-3 rounded-lg text-gray-600 font-medium border">
                  +91
                </span>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    disabled={isSending}
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            {!isOtpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={isSending}
                className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3 text-center">
                    Enter the 6-digit code sent to +91 {phone}
                  </p>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs.current[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 flex items-center justify-center"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={timer > 0 || isResending}
                    className={`text-sm ${
                      timer > 0 ? "text-gray-400" : "text-blue-600"
                    } text-center font-medium flex items-center justify-center space-x-2`}
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : timer > 0 ? (
                      `Resend code in ${timer}s`
                    ) : (
                      "Resend code"
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-2xl p-5 fixed bottom-0 left-0 transform w-full shadow-lg border border-blue-200">
        <div className="flex items-start gap-4">
          {/* <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
      <InfoIcon className="w-6 h-6 text-blue-600" />
    </div> */}
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900 text-lg">
              Important Instructions
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              {[
                "After phone verification, you will be directed to profile page where you'll need to upload your PAN, Aadhaar card and Payment Details",
                "Aaadhar, PAN and Payment Method are mandatory for withdrawing money from the platform.",
                "You can still participate in contests without completing KYC, by adding money and winnings will be credited to your wallet.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0"></div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
