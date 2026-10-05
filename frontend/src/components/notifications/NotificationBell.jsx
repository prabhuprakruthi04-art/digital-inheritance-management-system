import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationApi";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      const list =
        response?.notifications ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      console.warn("Notification API offline, defaulting to empty list:", error?.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read &&
      !notification.isRead
  ).length;

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      return;
    }

    try {
      await markNotificationAsRead(
        notificationId
      );

      setNotifications((current) =>
        current.map((notification) => {
          const id =
            notification._id ||
            notification.id;

          if (id !== notificationId) {
            return notification;
          }

          return {
            ...notification,
            read: true,
            isRead: true,
          };
        })
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update notification."
      );
    }
  };

  const handleToggle = () => {
    setOpen((current) => !current);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex min-h-5 min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border bg-white shadow-xl sm:w-96">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Notifications
                </h3>

                <p className="text-xs text-gray-500">
                  {unreadCount} unread
                </p>
              </div>

              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all
              </Link>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell
                    size={32}
                    className="mx-auto mb-3 text-gray-400"
                  />

                  <p className="font-medium text-gray-700">
                    No notifications
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    You're all caught up.
                  </p>
                </div>
              ) : (
                notifications
                  .slice(0, 5)
                  .map((notification) => {
                    const id =
                      notification._id ||
                      notification.id;

                    const isRead =
                      notification.read ||
                      notification.isRead;

                    return (
                      <div
                        key={id}
                        className={`border-b px-4 py-4 last:border-b-0 ${
                          isRead
                            ? "bg-white"
                            : "bg-indigo-50/50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                              isRead
                                ? "bg-gray-300"
                                : "bg-indigo-600"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">
                              {notification.title ||
                                "Notification"}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message ||
                                notification.description ||
                                ""}
                            </p>

                            {!isRead && id && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkAsRead(
                                    id
                                  )
                                }
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                              >
                                <CheckCheck
                                  size={14}
                                />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}