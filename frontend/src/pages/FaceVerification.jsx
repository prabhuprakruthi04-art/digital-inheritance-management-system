import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CheckCircle, RefreshCw, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

import FaceCamera from "../components/face/FaceCamera";
import API from "../services/api";

export default function FaceVerification() {
  const navigate = useNavigate();

  const [cameraStarted, setCameraStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartCamera = () => {
    setError("");
    setCameraStarted(true);
  };

  const handleStopCamera = () => {
    setCameraStarted(false);
  };

  const handleCapture = (image) => {
    setCapturedImage(image);
    setCameraStarted(false);
    setError("");
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError("");
    setCameraStarted(false);
  };

  const base64ToFile = async (base64) => {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], "verify_face.jpg", { type: "image/jpeg" });
  };

  const handleVerify = async () => {
    if (!capturedImage) {
      setError("Please capture your face first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const file = await base64ToFile(capturedImage);
      const formData = new FormData();
      formData.append("face", file);

      const response = await API.post("/api/biometrics/verify-face", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const message = response.data?.message || "Biometric authentication successful!";
      toast.success(message);

      setTimeout(() => {
        navigate("/owner/assets", { replace: true });
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Face verification failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <ShieldCheck size={34} className="text-indigo-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Face Authentication</h1>
          <p className="mt-2 text-gray-500">
            Verify your identity using biometric face recognition to proceed.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <X size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!cameraStarted && !capturedImage && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <Camera size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Ready for Scan</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Click below to launch your webcam for instant identity matching.
            </p>

            <button
              type="button"
              onClick={handleStartCamera}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <Camera size={19} />
              Start Verification Scan
            </button>
          </div>
        )}

        {cameraStarted && !capturedImage && (
          <div>
            <FaceCamera onCapture={handleCapture} />
            <button
              type="button"
              onClick={handleStopCamera}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              <X size={18} />
              Cancel Scan
            </button>
          </div>
        )}

        {capturedImage && (
          <div className="flex flex-col items-center">
            <p className="mb-4 font-medium text-gray-700">Image captured</p>
            <img
              src={capturedImage}
              alt="Captured verification scan"
              className="w-80 rounded-lg border shadow"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRetake}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-5 py-3 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw size={18} />
                Retake
              </button>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle size={18} />
                {loading ? "Authenticating..." : "Verify Identity"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}