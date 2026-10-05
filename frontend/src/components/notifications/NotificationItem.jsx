import { useState } from "react";
import {
  FiBell,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
}) {
  const [actionLoading, setActionLoading] =
    useState(false);

  const handleRead = async () => {
    if (notification.read || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);
      await onRead(notification._id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);
      await onDelete(notification._id);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 transition ${
        notification.read
          ? "bg-white"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            notification.read
              ? "bg-gray-100 text-gray-500"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <FiBell size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">
                {notification.title}
              </h3>

              <p className="text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>

            {!notification.read && (
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            )}
          </div>

          {notification.createdAt && (
            <p className="text-xs text-gray-400 mt-3">
              {new Date(
                notification.createdAt
              ).toLocaleString()}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            {!notification.read && (
              <button
                onClick={handleRead}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <FiCheck size={15} />
                Mark as read
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <FiTrash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}