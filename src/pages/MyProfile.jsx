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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchUserById, uploadProfilePhoto, updateProfile } from "../api/fetch";
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
  });
  const [qrCodeFile, setQrCodeFile] = useState(null);

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  let user = useSelector((state) => state.user);
  const username = localStorage.getItem("email") || "User";

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
      const imageFile = selectedPaymentType === "qr" ? qrCodeFile : null;
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
        file: imageFile,
      };

      const res = await updateProfile(formData);
      if (res) {
        setPaymentUpdateLoading(false);

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

  const handleQRCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrCodeFile(file);
      setUploadingQR(true);
    }
    setUploadingQR(false);
  };

  const handlePaymentClick = (type) => {
    setPaymentFormData({
      upiId: paymentInfo?.upiId || "",
      mobileNumber: paymentInfo?.mobileNumber || "",
    });
    setQrCodeFile(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header heading="My Profile" />

      <main className="container mx-auto px-4 py-6 max-w-xl">
        <div className="p-3 mb-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <button
                onClick={() => setShowProfileOptions(true)}
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:opacity-90 transition-opacity bg-gray-300"
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
                className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.username || username}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Payment Methods
          </h3>
          <div className="space-y-2">
            {[
              {
                icon: QrCode,
                title: "QR Code",
                subtitle: "Manage payment QR",
                type: "qr",
              },
              {
                icon: Wallet,
                title: "UPI ID",
                subtitle: paymentInfo?.upiId,
                type: "upi",
              },
              {
                icon: Phone,
                title: "Phone Number",
                subtitle: paymentInfo?.mobileNumber,
                type: "phone",
              },
              {
                icon: IdCard,
                title: "Aadhaar Number",
                subtitle: paymentInfo?.aadhaar,
                type: "aadhaar",
              },
              {
                icon: IdCard,
                title: "PAN Number",
                subtitle: paymentInfo?.pan,
                type: "pan",
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handlePaymentClick(item.type)}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 p-4 flex items-center justify-center gap-2 text-red-600 bg-white rounded-xl shadow-sm hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

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
                  className="w-full p-4 text-left hover:bg-gray-50 rounded-xl flex items-center gap-3 text-gray-700"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">View Profile Picture</span>
                </button>
                <label className="block w-full p-4 text-left hover:bg-gray-50 rounded-xl flex items-center gap-3 text-gray-700 cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Upload New Picture</span>
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

        {showFullProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-4">
              <button
                onClick={() => setShowFullProfile(false)}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
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

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-4 w-11/12 max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPaymentType === "qr"
                    ? "QR Code"
                    : selectedPaymentType === "upi"
                    ? "UPI ID"
                    : "Phone Number"}
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
                    <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
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
                          onChange={handleQRCodeUpload}
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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfile;
