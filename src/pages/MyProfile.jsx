import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  Camera,
  X,
  QrCode,
  Phone,
  Wallet,
  ChevronRight,
  Upload,
  Eye,
  Loader2,
  IdCard,
  AlertCircle,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchUserById, updateProfile, uploadProfilePhoto } from "../api/fetch";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/userSlice";
import toast from "react-hot-toast";

const MyProfile = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentUpdateLoading, setPaymentUpdateLoading] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    upiId: "",
    mobileNumber: "",
    aadhaar: "",
    pan: "",
  });
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  let user = useSelector((state) => state.user);

  const getUser = async () => {
    if (!userId) return null;
    const res = await fetchUserById(userId);
    if (res) {
      setPaymentInfo(res?.user?.wallet?.paymentInfo);
      dispatch(
        setUser({
          userId: res.user.id,
          email: res.user.email,
          username: res.user.username,
          token: user?.token,
          imageUrl: res.user.imageUrl,
          role: res.user.role,
        })
      );
    }
    return null;
  };

  useEffect(() => {
    getUser();
  }, []);

  const handlePaymentUpdate = async () => {
    setPaymentUpdateLoading(true);
    try {
      const formData = {
        userId,
        phoneNumber:
          selectedPaymentType === "phone"
            ? paymentFormData.mobileNumber
            : paymentInfo?.mobileNumber,
        upiId:
          selectedPaymentType === "upi"
            ? paymentFormData.upiId
            : paymentInfo?.upiId,
        file: selectedPaymentType === "qr" ? qrCodeFile : null,
        aadhaarFile: selectedPaymentType === "aadhaar" ? aadhaarFile : null,
        panFile: selectedPaymentType === "pan" ? panFile : null,
      };

      const res = await updateProfile(formData);
      if (res) {
        toast.success("Payment details updated successfully");
        await getUser();
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error("Error updating payment details", error);
      toast.error("Failed to update payment details");
    } finally {
      setUploadingQR(false);
      setPaymentUpdateLoading(false);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "qr") {
        setQrCodeFile(file);
      } else if (type === "aadhaar") {
        setAadhaarFile(file);
      } else if (type === "pan") {
        setPanFile(file);
      }
    }
  };

  const handlePaymentClick = (type) => {
    setPaymentFormData({
      upiId: paymentInfo?.upiId || "",
      mobileNumber: paymentInfo?.mobileNumber || "",
      aadhaar: paymentInfo?.aadharCard || "",
      pan: paymentInfo?.panCardCard || "",
    });
    setQrCodeFile(null);
    setAadhaarFile(null);
    setPanFile(null);
    setSelectedPaymentType(type);
    setShowPaymentModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowProfileOptions(false);
      setImagePreview(URL.createObjectURL(file));
      const imgP = URL.createObjectURL(file);
      setLoading(true);
      try {
        await uploadProfilePhoto(userId, imgP);
        getUser();
        toast.success("Profile picture updated successfully");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Profile picture upload failed");
      } finally {
        setLoading(false);
        setShowProfileOptions(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("shopCoToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("SessionExpiryTime");
    navigate("/");
  };

  const isVerified =
    paymentInfo?.aadharCard &&
    paymentInfo?.panCard &&
    paymentInfo?.upiId &&
    paymentInfo?.mobileNumber &&
    paymentInfo?.qrCode;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header heading="My Profile" />

      <main className="container mx-auto px-4 py-5 max-w-xl">
        <div className="p-1 mb-3 px-4 flex items-center bg-white rounded-xl shadow-md">
          <div className="relative mr-4">
            <button
              onClick={() => setShowProfileOptions(true)}
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:opacity-90 transition-opacity bg-gray-300"
            >
              {imagePreview || user?.imageUrl ? (
                <img
                  src={imagePreview || user?.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white"></div>
                </div>
              )}
            </button>
            <button
              onClick={() => setShowProfileOptions(true)}
              className="absolute bottom-2 right-1 p-1.5 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="self-start p-1 bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {user.username || "Username"}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  {user.email || "email@example.com"}
                </p>

                {isVerified ? (
                  <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    <Check className="mr-2" size={16} />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                    <AlertTriangle className="mr-2" size={16} />
                    <span className="text-sm font-medium">Not Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-3 mb-3">
          <h3 className="text-md font-semibold mb-3 text-gray-900">
            Phone Number
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handlePaymentClick("phone")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Phone Number</h4>
                  <p className="text-gray-500 text-sm">
                    {paymentInfo?.mobileNumber || "Not added"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-3.5 mb-3">
          <h3 className="text-md font-semibold mb-3 text-gray-900 flex items-center">
            <p className="flex items-center justify-between gap-2 ">
              KYC Documents
              {(!paymentInfo?.aadharCard || !paymentInfo?.panCard) && (
                <AlertCircle className="ml-2 w-5 h-5 text-red-500" />
              )}
            </p>
          </h3>
          <div className="space-y-2">
            {[
              {
                icon: IdCard,
                title: "Aadhaar Card",
                subtitle: paymentInfo?.aadharCard ? "Uploaded" : "Not uploaded",
                type: "aadhaar",
              },
              {
                icon: IdCard,
                title: "PAN Card",
                subtitle: paymentInfo?.panCard ? "Uploaded" : "Not uploaded",
                type: "pan",
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handlePaymentClick(item.type)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p
                      className={`text-sm ${
                        item.subtitle === "Not uploaded"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {item.subtitle || "Not uploaded"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-3.5 mb-3">
          <p className="flex items-center justify-between gap-2 font-semibold w-fit">
            Payment Methods
            {(!paymentInfo?.qrCode || !paymentInfo?.upiId) && (
              <AlertCircle className="ml-2 w-5 h-5 text-red-500" />
            )}
          </p>
          <div className="space-y-2">
            {[
              {
                icon: QrCode,
                title: "QR Code",
                subtitle: paymentInfo?.qrCode
                  ? "Manage payment QR"
                  : "Not Added",
                type: "qr",
              },
              {
                icon: Wallet,
                title: "UPI ID",
                subtitle: paymentInfo?.upiId,
                type: "upi",
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handlePaymentClick(item.type)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p
                      className={`text-sm ${
                        !item.subtitle || item?.subtitle === "Not Added"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {item.subtitle || "Not added"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 p-3.5 flex items-center justify-center gap-2 text-red-600 bg-white rounded-xl shadow-sm hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* Profile Options Modal */}
        {showProfileOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Profile Picture
                </h3>
                <button
                  onClick={() => setShowProfileOptions(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowFullProfile(true);
                    setShowProfileOptions(false);
                  }}
                  className="w-full p-3.5 text-left hover:bg-gray-50 rounded-xl flex items-center gap-3 text-gray-700"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">View Profile Picture</span>
                </button>
                <label className="block w-full p-3.5 text-left hover:bg-gray-50 rounded-xl flex items-center gap-3 text-gray-700 cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Full Profile Picture Modal */}
        {showFullProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-4">
              <button
                onClick={() => setShowFullProfile(false)}
                className="absolute top-3.5 right-4 p-2 text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={imagePreview || user?.imageUrl}
                alt="Profile"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Payment/KYC Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-3.5 w-11/12 max-w-md mx-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPaymentType === "qr"
                    ? "QR Code"
                    : selectedPaymentType === "upi"
                    ? "UPI ID"
                    : selectedPaymentType === "phone"
                    ? "Phone Number"
                    : selectedPaymentType === "aadhaar"
                    ? "Aadhaar Card"
                    : "PAN Card"}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setUploadingQR(false);
                    setPaymentUpdateLoading(false);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedPaymentType === "qr" && (
                  <div className="space-y-4">
                    <div className="flex justify-center p-3.5 bg-gray-50 rounded-lg">
                      {qrCodeFile ? (
                        <img
                          src={URL.createObjectURL(qrCodeFile)}
                          alt="New QR Code"
                          className="w-36 h-36 object-cover"
                        />
                      ) : paymentInfo?.qrCode ? (
                        <img
                          src={paymentInfo.qrCode}
                          alt="Existing QR Code"
                          className="w-36 h-36 object-cover"
                        />
                      ) : (
                        <p>No QR code found. Please upload a new one.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "qr")}
                          className="hidden"
                          disabled={paymentUpdateLoading}
                        />
                        <div className="w-full p-2.5 bg-blue-50 text-blue-600 rounded-lg text-center text-sm font-medium hover:bg-blue-100 cursor-pointer">
                          {uploadingQR ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            "Upload New QR"
                          )}
                        </div>
                      </label>
                      <button
                        onClick={handlePaymentUpdate}
                        className="flex-1 p-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        disabled={!qrCodeFile || paymentUpdateLoading}
                      >
                        {paymentUpdateLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "upi" && (
                  <>
                    <input
                      type="text"
                      value={paymentFormData.upiId}
                      onChange={(e) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          upiId: e.target.value,
                        })
                      }
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter UPI ID"
                    />
                    <button
                      onClick={handlePaymentUpdate}
                      className="w-full p-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                      disabled={!paymentFormData.upiId || paymentUpdateLoading}
                    >
                      {paymentUpdateLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </>
                )}

                {selectedPaymentType === "phone" && (
                  <>
                    <input
                      type="tel"
                      value={paymentFormData.mobileNumber}
                      onChange={(e) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                    <button
                      onClick={handlePaymentUpdate}
                      className="w-full p-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                      disabled={
                        !paymentFormData.mobileNumber || paymentUpdateLoading
                      }
                    >
                      {paymentUpdateLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </>
                )}

                {(selectedPaymentType === "aadhaar" ||
                  selectedPaymentType === "pan") && (
                  <div className="space-y-4">
                    <div className="flex justify-center p-3.5 bg-gray-50 rounded-lg">
                      {selectedPaymentType === "aadhaar" ? (
                        aadhaarFile ? (
                          <img
                            src={URL.createObjectURL(aadhaarFile)}
                            alt="New Aadhaar Card"
                            className="w-full max-h-48 object-contain"
                          />
                        ) : paymentInfo?.aadharCard ? (
                          <img
                            src={paymentInfo.aadharCard}
                            alt="Existing Aadhaar Card"
                            className="w-full max-h-48 object-contain"
                          />
                        ) : (
                          <p>
                            No Aadhaar card uploaded. Please upload a new one.
                          </p>
                        )
                      ) : panFile ? (
                        <img
                          src={URL.createObjectURL(panFile)}
                          alt="New PAN Card"
                          className="w-full max-h-48 object-contain"
                        />
                      ) : paymentInfo?.panCard ? (
                        <img
                          src={paymentInfo.panCard}
                          alt="Existing PAN Card"
                          className="w-full max-h-48 object-contain"
                        />
                      ) : (
                        <p>No PAN card uploaded. Please upload a new one.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, selectedPaymentType)
                          }
                          className="hidden"
                          disabled={paymentUpdateLoading}
                        />
                        <div className="w-full p-2.5 bg-blue-50 text-blue-600 rounded-lg text-center text-sm font-medium hover:bg-blue-100 cursor-pointer">
                          Upload{" "}
                          {selectedPaymentType === "aadhaar"
                            ? "Aadhaar"
                            : "PAN"}
                        </div>
                      </label>
                      <button
                        onClick={handlePaymentUpdate}
                        className="flex-1 p-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        disabled={
                          (selectedPaymentType === "aadhaar"
                            ? !aadhaarFile
                            : !panFile) || paymentUpdateLoading
                        }
                      >
                        {paymentUpdateLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfile;
