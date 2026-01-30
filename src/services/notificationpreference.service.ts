// services/notificationPreferences.service.ts
import api from "./api";
import {
  NotificationPreferences,
  NotificationType,
} from "../types/notification.types";

const notificationPreferencesService = {
  /**
   * Get all notification preferences for the current user.
   */
  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    // Backend returns list of { key, value } or similar
    const res = await api.get<{ key: NotificationType; value: boolean }[]>(
      `/notificationpreferences`,
    );

    // Convert list to a key-value record
    const prefs: NotificationPreferences = {
      [NotificationType.LeadAssigned]: false,
      [NotificationType.MessageReceived]: false,
      [NotificationType.LeadCreated]: false,
      [NotificationType.EventReceived]: false,
      [NotificationType.EmailNotificationOn]: false,
    };

    res.data.forEach((p) => {
      prefs[p.key] = p.value;
    });

    return prefs;
  },

  /**
   * Add or update notification preferences.
   * Accepts a partial preferences object.
   */
  addOrUpdateNotificationPreference: async (
    data: Partial<NotificationPreferences>,
  ): Promise<void> => {
    // Convert object to list of { key, value } for backend
    const payload = Object.entries(data).map(([key, value]) => ({
      key,
      value,
    }));

    await api.post("/notificationpreferences", payload);
  },

  /**
   * Clear all notification preferences for the current user.
   */
  clearNotificationPreferences: async (): Promise<void> => {
    await api.delete("/notificationpreferences/clear");
  },
};

export default notificationPreferencesService;
