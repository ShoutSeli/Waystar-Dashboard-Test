import React from "react";
import type { AppNotification, NotificationType } from "../context/NotificationContext";

const typeConfig: Record<NotificationType, { icon: string; iconPath: string; accent: string; lightBg: string }> = {
  success: {
    icon: "text-green-600",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "border-green-500",
    lightBg: "bg-green-50 dark:bg-green-950/20",
  },
  warning: {
    icon: "text-amber-600",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    accent: "border-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-950/20",
  },
  error: {
    icon: "text-red-600",
    iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "border-red-500",
    lightBg: "bg-red-50 dark:bg-red-950/20",
  },
  info: {
    icon: "text-blue-600",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "border-blue-500",
    lightBg: "bg-blue-50 dark:bg-blue-950/20",
  },
};

interface NotificationModalProps {
  notification: AppNotification | null;
  isOpen: boolean;
  onDismiss: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, isOpen, onDismiss }) => {
  if (!isOpen || !notification) return null;

  const cfg = typeConfig[notification.type];
  const timestamp = new Date(notification.timestamp);
  const fullDate = timestamp.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onDismiss}
        style={{
          animation: "fadeIn 0.2s ease-in-out",
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onDismiss()}
      >
        <div
          className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border-l-4 ${cfg.accent}`}
          style={{
            animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {/* Header with icon */}
          <div className={`${cfg.lightBg} px-6 py-6 border-b border-slate-200 dark:border-slate-700`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className={`w-8 h-8 ${cfg.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={cfg.iconPath} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{notification.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fullDate}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{notification.message}</p>
              </div>

              {notification.claimId && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Claim ID</p>
                  <p className="mt-1.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-200">{notification.claimId}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Notification Type</p>
                <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-slate-200 capitalize">{notification.type}</p>
              </div>
            </div>
          </div>

          {/* Footer with dismiss button */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex gap-3 justify-end rounded-b-2xl">
            <button
              onClick={onDismiss}
              className="px-4 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default NotificationModal;
