import { useNavigate } from "react-router-dom";
import ClaimStatusBadge from "./ClaimStatusBadge";

export default function ClaimCard({ claim }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">
            {claim.asset?.name ||
              "Asset information unavailable"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Claim ID: {claim._id}
          </p>
        </div>

        <ClaimStatusBadge
          status={claim.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div>
          <p className="text-sm text-gray-500">
            Submitted
          </p>

          <p className="font-medium mt-1">
            {claim.createdAt
              ? new Date(
                  claim.createdAt
                ).toLocaleDateString()
              : "Not available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Claimant
          </p>

          <p className="font-medium mt-1">
            {claim.claimant?.fullName ||
              "Not available"}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(`/claims/${claim._id}`)
        }
        className="mt-5 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        View Claim
      </button>
    </div>
  );
}