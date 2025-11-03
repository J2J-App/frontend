import { useState, useEffect } from "react";
import { getLocalStorageStatus } from "./safe-localStorage";

export interface StorageNotification {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  action?: string;
  persistent?: boolean;
  timestamp: number;
}

/**
 * Global storage for notifications
 */
class NotificationManager {
  private notifications: StorageNotification[] = [];
  private listeners: Set<(notifications: StorageNotification[]) => void> =
    new Set();
  private idCounter = 0;

  subscribe(listener: (notifications: StorageNotification[]) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  add(notification: Omit<StorageNotification, "id" | "timestamp">) {
    const newNotification: StorageNotification = {
      ...notification,
      id: String(++this.idCounter),
      timestamp: Date.now(),
    };

    // Avoid duplicate messages
    const isDuplicate = this.notifications.some(
      (n) =>
        n.type === newNotification.type && n.message === newNotification.message
    );

    if (!isDuplicate) {
      this.notifications.push(newNotification);
      this.notify();

      // Auto-remove non-persistent notifications after 5 seconds
      if (!newNotification.persistent) {
        setTimeout(() => {
          this.remove(newNotification.id);
        }, 5000);
      }
    }
  }

  remove(id: string) {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter((n) => n.id !== id);

    if (this.notifications.length !== initialLength) {
      this.notify();
    }
  }

  clear() {
    if (this.notifications.length > 0) {
      this.notifications = [];
      this.notify();
    }
  }
}

const notificationManager = new NotificationManager();

/**
 * Hook for managing localStorage error notifications
 */
export function useStorageNotifications() {
  const [notifications, setNotifications] = useState<StorageNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const addNotification = (
    notification: Omit<StorageNotification, "id" | "timestamp">
  ) => {
    notificationManager.add(notification);
  };

  const removeNotification = (id: string) => {
    notificationManager.remove(id);
  };

  const clearNotifications = () => {
    notificationManager.clear();
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}

/**
 * Hook to automatically monitor and notify about localStorage issues
 */
export function useStorageMonitor() {
  const { addNotification } = useStorageNotifications();

  useEffect(() => {
    const checkStorageAndNotify = () => {
      const status = getLocalStorageStatus();

      if (!status.available && status.error) {
        let message = "Data persistence is unavailable";
        let action = "";

        if (status.error.includes("private")) {
          message =
            "Private browsing detected. Your settings won't be saved between sessions.";
          action = "Switch to regular browsing to save your preferences";
        } else if (status.error.includes("quota")) {
          message =
            "Browser storage is full. Some features may not work properly.";
          action = "Clear browser data or close other tabs";
        } else {
          message = `Storage unavailable: ${status.error}`;
        }

        addNotification({
          type: "warning",
          message,
          action,
          persistent: true,
        });
      }
    };

    // Check on mount
    checkStorageAndNotify();

    // Check on focus (user might have changed settings)
    window.addEventListener("focus", checkStorageAndNotify);

    return () => {
      window.removeEventListener("focus", checkStorageAndNotify);
    };
  }, [addNotification]);
}

/**
 * React component for displaying storage notifications
 */
export function StorageNotifications() {
  const { notifications, removeNotification } = useStorageNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      className="storage-notifications"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        maxWidth: "400px",
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`storage-notification storage-notification--${notification.type}`}
          style={{
            backgroundColor:
              notification.type === "error"
                ? "#fee"
                : notification.type === "warning"
                ? "#fff3cd"
                : "#d1ecf1",
            border: `1px solid ${
              notification.type === "error"
                ? "#fcc"
                : notification.type === "warning"
                ? "#ffeaa7"
                : "#bee5eb"
            }`,
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {notification.message}
              </p>
              {notification.action && (
                <p style={{ margin: "0", fontSize: "12px", opacity: 0.8 }}>
                  {notification.action}
                </p>
              )}
            </div>
            {!notification.persistent && (
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  marginLeft: "8px",
                  opacity: 0.7,
                }}
                title="Dismiss"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
