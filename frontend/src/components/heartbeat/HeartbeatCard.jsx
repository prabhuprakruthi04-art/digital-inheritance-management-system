import { HeartPulse } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function HeartbeatCard({ heartbeat }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Heartbeat Status
          </h2>

          <p className="text-gray-500">
            Current verification status
          </p>
        </div>

        <HeartPulse className="text-red-500" size={34} />

      </div>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span>Current Status</span>

          <StatusBadge status={heartbeat.status} />
        </div>

        <div className="flex justify-between">
          <span>Last Verified</span>

          <span>{heartbeat.lastVerified}</span>
        </div>

        <div className="flex justify-between">
          <span>Next Verification</span>

          <span>{heartbeat.nextVerification}</span>
        </div>

      </div>

    </div>
  );
}