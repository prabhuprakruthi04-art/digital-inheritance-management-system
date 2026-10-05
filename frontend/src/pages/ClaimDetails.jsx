import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ClaimStatusBadge from "../components/claims/ClaimStatusBadge";
import ClaimTimeline from "../components/claims/ClaimTimeline";

import {
  getClaim,
  submitClaim,
  cancelClaim,
} from "../services/claimApi";

export default function ClaimDetails() {
  const { claimId } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClaim();
  }, [claimId]);

  const loadClaim = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getClaim(claimId);

      setClaim(response.claim);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load claim."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response =
        await submitClaim(claimId);

      setClaim(response.claim);

      setMessage(
        response.message ||
          "Claim submitted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit claim."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this claim?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response =
        await cancelClaim(claimId);

      setClaim(response.claim);

      setMessage(
        response.message ||
          "Claim cancelled successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel claim."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          Loading claim...
        </p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 text-center">
          <h1 className="text-xl font-semibold">
            Claim not found
          </h1>

          <button
            onClick={() => navigate("/claims")}
            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Claims
          </button>
        </div>
      </div>
    );
  }

  const canSubmit =
    claim.status === "draft";

  const canCancel =
    claim.status === "draft" ||
    claim.status === "submitted";

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate("/claims")}
          className="text-blue-600 mb-6"
        >
          ← Back to Claims
        </button>

        {error && (
          <div className="mb-5 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {claim.asset?.name ||
                      "Asset"}
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Claim ID: {claim._id}
                  </p>
                </div>

                <ClaimStatusBadge
                  status={claim.status}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">

                <div>
                  <p className="text-sm text-gray-500">
                    Claimant
                  </p>

                  <p className="font-medium mt-1">
                    {claim.claimant?.fullName ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Created
                  </p>

                  <p className="font-medium mt-1">
                    {claim.createdAt
                      ? new Date(
                          claim.createdAt
                        ).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                {claim.reason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                      Reason
                    </p>

                    <p className="mt-1">
                      {claim.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-6">
                Claim Progress
              </h2>

              <ClaimTimeline
                currentStatus={
                  claim.status
                }
              />
            </div>

          </div>

          <div>
            <div className="bg-white rounded-xl border p-6">

              <h2 className="text-xl font-semibold">
                Actions
              </h2>

              <div className="space-y-3 mt-5">

                {canSubmit && (
                  <button
                    onClick={handleSubmit}
                    disabled={actionLoading}
                    className="w-full px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading
                      ? "Processing..."
                      : "Submit Claim"}
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full px-5 py-3 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancel Claim
                  </button>
                )}

                {!canSubmit &&
                  !canCancel && (
                    <p className="text-sm text-gray-500">
                      No actions are available
                      for the current claim status.
                    </p>
                  )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}