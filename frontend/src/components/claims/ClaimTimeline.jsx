const timelineSteps = [
  {
    status: "submitted",
    label: "Claim Submitted",
  },
  {
    status: "verification_pending",
    label: "Identity Verification",
  },
  {
    status: "under_review",
    label: "Admin Review",
  },
  {
    status: "approved",
    label: "Claim Approved",
  },
  {
    status: "completed",
    label: "Asset Transfer Completed",
  },
];

export default function ClaimTimeline({
  currentStatus,
}) {
  const currentIndex =
    timelineSteps.findIndex(
      (step) =>
        step.status === currentStatus
    );

  return (
    <div className="space-y-6">
      {timelineSteps.map(
        (step, index) => {
          const completed =
            currentIndex >= index;

          return (
            <div
              key={step.status}
              className="flex items-start gap-4"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  completed
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p
                  className={`font-medium ${
                    completed
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {completed
                    ? "Completed"
                    : "Pending"}
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}