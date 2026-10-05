const statusStyles = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  verification_pending:
    "bg-yellow-100 text-yellow-700",
  under_review:
    "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  completed: "bg-green-100 text-green-700",
};

const statusLabels = {
  draft: "Draft",
  submitted: "Submitted",
  verification_pending:
    "Verification Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

export default function ClaimStatusBadge({
  status,
}) {
  const normalizedStatus =
    status?.toLowerCase();

  const style =
    statusStyles[normalizedStatus] ||
    "bg-gray-100 text-gray-700";

  const label =
    statusLabels[normalizedStatus] ||
    status ||
    "Unknown";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}