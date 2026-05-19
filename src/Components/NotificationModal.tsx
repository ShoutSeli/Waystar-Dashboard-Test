import React from "react";
import type { AppNotification } from "../context/NotificationContext";

interface NotificationModalProps {
  notification: AppNotification | null;
  isOpen: boolean;
  onDismiss: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, isOpen, onDismiss }) => {
  if (!isOpen || !notification) return null;

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
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onDismiss}
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
      />

      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onDismiss()}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full"
          style={{ animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}
        >
          <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">{notification.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{fullDate}</p>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-400">{notification.message}</p>
            </div>

            {notification.claimId && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Claim ID</p>
                <p className="mt-2 font-mono text-sm font-medium text-slate-900 dark:text-slate-200">{notification.claimId}</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-end rounded-b-2xl">
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors duration-150 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
