import React, { useState, useRef, useEffect } from "react";
import { useNotifications, type AppNotification, type NotificationType } from "../context/NotificationContext";
import NotificationModal from "./NotificationModal";

const typeConfig: Record<NotificationType, { icon: string; dot: string; iconPath: string; border: string; accent: string }> = {
  success: { icon: "text-green-600", dot: "bg-green-500",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", border: "border-green-500", accent: "text-green-600" },
  warning: { icon: "text-amber-600",   dot: "bg-amber-400",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", border: "border-amber-500", accent: "text-amber-600" },
  error:   { icon: "text-red-600",     dot: "bg-red-500",
    iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", border: "border-red-500", accent: "text-red-600" },
  info:    { icon: "text-blue-600",    dot: "bg-blue-500",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", border: "border-blue-500", accent: "text-blue-600" },
};

const relativeTime = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const [shake, setShake] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Shake bell on new notification
  useEffect(() => {
    if (unreadCount > prevUnread) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setPrevUnread(unreadCount);
  }, [unreadCount]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = (n: AppNotification) => {
    markAsRead(n.id);
    setSelectedNotification(n);
    setModalOpen(true);
  };

  return (
    <div className="relative" ref={panelRef}>
      <NotificationModal notification={selectedNotification} isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2 rounded-lg text-red-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-slate-200 hover:bg-red-100 dark:hover:bg-slate-700 transition ${shake ? "animate-[wiggle_0.5s_ease-in-out]" : ""}`}
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
          style={{
            animation: "dropDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-slate-700 rounded-full">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead}
                  className="text-sm font-medium text-red-500 dark:text-slate-400 hover:underline font-medium px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-slate-700 transition">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll}
                  className="text-sm font-medium text-red-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-slate-300 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-slate-700 transition">
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-800">
                <svg className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-400">No notifications yet</p>
                <p className="text-sm font-medium mt-0.5 text-slate-800">Claim events will appear here</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type];
                return (
                  <button key={n.id} onClick={() => handleItemClick(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition border-l-2 ${cfg.border} hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!n.read ? "dark:bg-slate-700/10" : ""}`}
                    style={{
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5`}>
                      <svg className={`w-9 h-9 ${cfg.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={cfg.iconPath} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-sm font-semibold truncate ${n.read ? "text-slate-700 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">{relativeTime(n.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-400 mt-1.5 leading-relaxed">{n.message}</p>
                      {n.claimId && (
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                          {n.claimId}
                        </span>
                      )}
                    </div>
                    {!n.read && <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-1.5`} />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-medium text-slate-800 dark:text-slate-400 text-center">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""} · {unreadCount} unread
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;