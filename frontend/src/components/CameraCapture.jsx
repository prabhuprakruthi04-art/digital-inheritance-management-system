import Webcam from "react-webcam";
import { useRef, useState } from "react";

export default function CameraCapture({ onCapture }) {
    const webcamRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const capture = () => {
        const image = webcamRef.current.getScreenshot();

        setPreview(image);

        onCapture(image);
    };

    return (
        <div className="text-center">

            {!preview ? (
                <>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width={350}
                    />

                    <button
                        type="button"
                        onClick={capture}
                    >
                        Capture Face
                    </button>
                </>
            ) : (
                <>
                    <img
                        src={preview}
                        alt="Captured"
                        width="350"
                    />

                    <button
                        type="button"
                        onClick={() => setPreview(null)}
                    >
                        Retake
                    </button>
                </>
            )}

        </div>
    );
}