// services/notificationPreferences.service.ts
import api from "./api";
import {
  NotificationPreferences,
  NotificationType,
} from "../types/notification.types";
import { withCache, clearCache } from "@/utils/cache";

const notificationPreferencesService = {
  /** =====================
   * GET preferences (cached)
   * ===================== */
  getNotificationPreferences: async (
    forceRefresh = false,
  ): Promise<NotificationPreferences> => {
    const cacheKey = "notification:preferences";

    return withCache(
      cacheKey,
      async () => {
        const res = await api.get<{ key: NotificationType; value: boolean }[]>(
          `/notificationpreferences`,
        );

        // Convert list to key-value record
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
      forceRefresh,
    );
  },

  /** =====================
   * Add or update (invalidate cache)
   * ===================== */
  addOrUpdateNotificationPreference: async (
    data: Partial<NotificationPreferences>,
  ): Promise<void> => {
    const payload = Object.entries(data).map(([key, value]) => ({
      key,
      value,
    }));

    await api.post("/notificationpreferences", payload);

    // Invalidate cache so next GET fetches fresh data
    await clearCache("notification:preferences");
  },

  /** =====================
   * Clear preferences (invalidate cache)
   * ===================== */
  clearNotificationPreferences: async (): Promise<void> => {
    await api.delete("/notificationpreferences/clear");

    // Invalidate cache
    await clearCache("notification:preferences");
  },
};

export default notificationPreferencesService;
