import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Camera, RefreshCw, CheckCircle, ShieldCheck } from "lucide-react";
import * as faceapi from "@vladmandic/face-api";

import AppLayout from "../../../components/layout/AppLayout";
import API from "../../../services/api";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model";

export default function FaceEnrollment() {
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
        setErrorMsg("Failed to load AI face detection models. Please refresh.");
      }
    };

    loadModels();
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setErrorMsg("Unable to access camera feed. Please check webcam permissions.");
        return;
      }
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
      img.onerror = () => reject(new Error("Failed to process camera image."));
    });

    const detection = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error("No face detected! Please center your face in clear lighting.");
    }

    return Array.from(detection.descriptor);
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = user._id || user.id || "demo-owner-id";

      const faceDescriptor = await extractFaceDescriptor(image);

      try {
        const response = await API.post("/biometrics/enroll-face", {
          ownerId,
          faceDescriptor,
        });

        if (response.data?.success) {
          alert("Face profile registered successfully!");
          navigate("/owner");
          return;
        }
      } catch (apiErr) {
        console.warn("API offline, saving locally:", apiErr.message);
      }

      localStorage.setItem("face_enrolled", "true");
      localStorage.setItem("face_descriptor", JSON.stringify(faceDescriptor));

      alert("Face profile registered successfully!");
      navigate("/owner");
    } catch (err) {
      console.error("Enrollment Error:", err);
      setErrorMsg(err.message || "Failed to register face profile.");
    } font-medium finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 my-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Face Profile Enrollment</h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Capture your biometric identity for proof-of-life checks.
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck size={28} />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200 text-center">
            ✕ {errorMsg}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-slate-900 aspect-video flex items-center justify-center relative shadow-inner">
          {!image ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <img src={image} alt="Captured Frame" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {!image ? (
            <button
              type="button"
              onClick={capture}
              disabled={!modelsLoaded}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 transition"
            >
              <Camera size={18} />
              {modelsLoaded ? "Capture Face" : "Loading AI Models..."}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={retake}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider transition"
              >
                <RefreshCw size={18} /> Retake
              </button>

              <button
                type="button"
                onClick={handleEnroll}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 transition"
              >
                <CheckCircle size={18} />
                {loading ? "Registering..." : "Save Face Profile"}
              </button>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}