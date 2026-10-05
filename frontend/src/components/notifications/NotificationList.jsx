import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
  loading,
  onRead,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="py-12 text-center border rounded-xl bg-gray-50">
        <h3 className="font-semibold text-lg">
          No notifications
        </h3>

        <p className="text-gray-500 mt-2">
          You don't have any notifications right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}