import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Alerts' },
    { key: 'key', label: 'Key & Heartbeat' },
    { key: 'nominee', label: 'Nominees' },
    { key: 'asset', label: 'Assets & Vaults' },
    { key: 'security', label: 'Security' },
  ];

  const filteredNotifs = notifications.filter((n) =>
    activeCategory === 'all' ? true : n.category === activeCategory
  );

  return (
    <div className="space-y-6 text-slate-800 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Security & Activity Notifications</h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time audit log alerts, heartbeat ping warnings, and nominee state updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 transition shadow-xs"
          >
            <Check className="h-3.5 w-3.5" /> Mark All Read
          </button>
          <button
            onClick={clearNotifications}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs shadow-xs">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition flex items-start justify-between gap-4 shadow-xs ${
                !n.read
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-slate-200 bg-white opacity-90'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 mt-0.5 ${
                    n.severity === 'high'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">{n.description}</p>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono font-medium">{n.timestamp}</div>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
