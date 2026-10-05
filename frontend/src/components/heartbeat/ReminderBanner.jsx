import { AlertTriangle } from "lucide-react";

export default function ReminderBanner({ status }) {
  if (status === "Active") return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6 flex items-center gap-3">
      <AlertTriangle />

      <div>
        <h3 className="font-semibold">
          Heartbeat Verification Required
        </h3>

        <p>
          Please verify that you are alive to keep
          your assets protected.
        </p>
      </div>
    </div>
  );
}