import apiService from "@/services/api";
import { NotificationEvent } from "../../types/notification.types";
import { withCache, clearCache } from "@/utils/cache";

interface SseTokenResponse {
  token: string;
}

class NotificationService {
  /** =====================
   * SSE TOKEN (do NOT cache, short-lived)
   * ===================== */
  async getSseToken(): Promise<string> {
    const res = await apiService.post<SseTokenResponse>(
      "/notifications/sse-token",
    );
    return res.data.token;
  }

  /** =====================
   * GET UNREAD (cached)
   * ===================== */
  async getUnreadNotifications(
    forceRefresh = false,
  ): Promise<NotificationEvent[]> {
    const cacheKey = `notifications:unread`;

    return withCache(
      cacheKey,
      async () => {
        const res = await apiService.get<NotificationEvent[]>(
          "/notifications/unread",
        );
        return res.data;
      },
      forceRefresh,
      60, // 1 min TTL, can adjust as needed
    );
  }

  /** =====================
   * DELETE NOTIFICATIONS (invalidate cache)
   * ===================== */
  async deleteNotifications(): Promise<void> {
    await apiService.delete(`/notifications/clear`);

    // Invalidate cached unread notifications
    await clearCache("notifications:unread");
  }
}

export const notificationService = new NotificationService();
