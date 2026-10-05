import { useState } from "react";

export default function useCamera() {
  const [image, setImage] = useState(null);

  const captureImage = (img) => {
    setImage(img);
  };

  const resetImage = () => {
    setImage(null);
  };

  return {
    image,
    captureImage,
    resetImage,
  };
}