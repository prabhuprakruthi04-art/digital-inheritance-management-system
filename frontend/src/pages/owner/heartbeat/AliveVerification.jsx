import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { RefreshCw, CheckCircle } from "lucide-react";
import * as faceapi from "@vladmandic/face-api";

import AppLayout from "../../../components/layout/AppLayout";
import API from "../../../services/api";

// Direct, reliable CDN URL for model manifests and weights
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

export default function AliveVerification() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);
      } catch (err) {
        console.error("Model Loading Error:", err);
        setErrorMsg(
          "Failed to initialize verification AI models. Check internet connection or browser console."
        );
      }
    };
    loadModels();
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImage(screenshot);
      setErrorMsg("");
    }
  };

  const retake = () => {
    setImage(null);
    setErrorMsg("");
  };

  const extractFaceDescriptor = async (imageSrc) => {
    const img = document.createElement("img");
    img.src = imageSrc;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Failed to process captured camera frame."));
    });

    const detection = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error(
        "No face detected! Please ensure your face is well-lit, unblocked, and centered."
      );
    }

    return Array.from(detection.descriptor);
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = user._id || user.id;

      if (!ownerId) {
        setErrorMsg("User session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const faceDescriptor = await extractFaceDescriptor(image);

      const response = await API.post("/biometrics/verify-face", {
        ownerId,
        faceDescriptor,
      });

      if (response.data?.success) {
        alert("Identity Verified! Heartbeat timer reset successfully.");
        navigate("/owner/heartbeat", { replace: true });
      } else {
        setErrorMsg(response.data?.message || "Verification failed.");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to verify identity."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 my-6">
        <h1 className="text-3xl font-bold mb-2">Alive Verification</h1>
        <p className="text-gray-500 mb-6">
          Capture your face to verify owner identity and reset the heartbeat timer.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 text-center">
            ✕ {errorMsg}
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center">
          {!image ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={image}
              alt="Captured Frame"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {!image ? (
            <button
              type="button"
              onClick={capture}
              disabled={!modelsLoaded}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium disabled:opacity-50 cursor-pointer"
            >
              {modelsLoaded ? "Capture" : "Loading AI Models..."}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={retake}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium cursor-pointer"
              >
                <RefreshCw size={20} />
                Retake
              </button>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle size={20} />
                {loading ? "Verifying Identity..." : "Verify Identity"}
              </button>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}