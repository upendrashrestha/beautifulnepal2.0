import apiService from "@/services/api";
import { NotificationEvent } from "@/types";

interface SseTokenResponse {
  token: string;
}

class NotificationService {
  async getSseToken(): Promise<string> {
    const res = await apiService.post<SseTokenResponse>(
      "/notifications/sse-token",
    );

    return res.data.token;
  }

  async getUnreadNotifications(): Promise<NotificationEvent[]> {
    const res = await apiService.get<NotificationEvent[]>(
      "/notifications/unread",
    );
    return res.data;
  }

  async deleteNotifications() {
    await apiService.delete(`/notifications/clear`);
  }
}

export const notificationService = new NotificationService();
