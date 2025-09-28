/**
 * Example integration of localStorage error handling in your app
 */

"use client";
import {
  StorageNotifications,
  useStorageMonitor,
} from "@/lib/storage-notifications";
import { useLocalStorageStatus } from "@/lib/use-localStorage";

export function AppWithStorageHandling({
  children,
}: {
  children: React.ReactNode;
}) {
  // Monitor storage and automatically show notifications
  useStorageMonitor();

  // Optional: Get storage status for conditional features
  const storageStatus = useLocalStorageStatus();

  return (
    <>
      {children}

      {/* Show storage-related notifications */}
      <StorageNotifications />

      {/* Optional: Show storage status in footer or settings */}
      {!storageStatus.available && (
        <div className="storage-warning">
          ⚠️ Data saving is limited in this browsing mode
        </div>
      )}
    </>
  );
}

/**
 * Example usage in a form component
 */
import { useLocalStorageForm } from "@/lib/use-localStorage";

interface FormData {
  username: string;
  email: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export function ExampleForm() {
  const { formData, updateField, updateFields, clearForm, storageStatus } =
    useLocalStorageForm<FormData>("user-form", {
      username: "",
      email: "",
      preferences: {
        theme: "light",
        notifications: true,
      },
    });

  return (
    <form>
      <input
        value={formData.username}
        onChange={(e) => updateField("username", e.target.value)}
        placeholder="Username"
      />

      <input
        value={formData.email}
        onChange={(e) => updateField("email", e.target.value)}
        placeholder="Email"
      />

      <button type="button" onClick={() => clearForm()}>
        Reset Form
      </button>

      {!storageStatus.available && (
        <p style={{ color: "orange" }}>
          ⚠️ Your form data won't be saved between sessions
        </p>
      )}
    </form>
  );
}
