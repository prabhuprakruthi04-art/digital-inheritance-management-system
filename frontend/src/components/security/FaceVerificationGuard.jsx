import { Navigate, useLocation } from "react-router-dom";

export default function FaceVerificationGuard({ children }) {
  const location = useLocation();

  // Check if user already verified in this session
  const isVerified =
    sessionStorage.getItem("faceVerified") === "true";

  if (!isVerified) {
    return (
      <Navigate
        to="/face-verification"
        replace
        state={{
          redirectTo: location.pathname,
        }}
      />
    );
  }

  return children;
}