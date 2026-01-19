// services/message.service.ts
import api from "./api";
import { NotificationPreference } from "@/types";

const notificationPreferencesService = {
  getNotificationPreferences: async (): Promise<NotificationPreference> => {
    const res = await api.get<NotificationPreference>(
      `/notificationpreferences`
    );
    return res.data;
  },

  addOrUpdateNotificationPreference: async (
    data: Partial<NotificationPreference>
  ) => {
    await api.post("/notificationpreferences", data);
  },
};

export default notificationPreferencesService;
