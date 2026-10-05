import React, { useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

export default function FaceCamera({ onCapture }) {
  const webcamRef = useRef(null);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();

    if (!image) return;

    onCapture(image);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-xl border shadow-lg"
      />

      <button
        onClick={capture}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Capture Face
      </button>
    </div>
  );
}