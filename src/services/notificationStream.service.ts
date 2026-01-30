import { NotificationEvent } from "../types/notification.types";
import { notificationService } from "./notification.service";

export class NotificationStreamService<T extends NotificationEvent> {
  private eventSource: EventSource | null = null;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private stopped = false;
  private started = false;

  constructor(
    private readonly apiBaseUrl: string,
    private readonly onMessage: (data: T) => void,
  ) {}

  /** Start the SSE stream */
  async start() {
    if (this.stopped || this.started) return;
    this.started = true;

    try {
      const token = await notificationService.getSseToken();
      if (!token) throw new Error("Unable to get SSE token");

      const url = `${this.apiBaseUrl}/notifications/stream?token=${token}`;

      this.eventSource = new EventSource(url);

      this.eventSource.addEventListener("notification", (event) => {
        const data = JSON.parse((event as MessageEvent).data) as T;
        this.onMessage(data);
      });

      this.eventSource.onerror = () => {
        this.restart();
      };
    } catch (err) {
      console.error("SSE failed to start", err);
      this.restart(5000);
    }
  }

  /** Stop the SSE stream */
  stop() {
    this.stopped = true;
    this.started = false;
    this.cleanup();
  }

  /** Restart the stream safely */
  private restart(delay = 3000) {
    if (this.stopped) return;

    this.cleanup();
    this.started = false;

    this.reconnectTimer = setTimeout(() => {
      this.start();
    }, delay);
  }

  /** Cleanup resources */
  private cleanup() {
    this.eventSource?.close();
    this.eventSource = null;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }
}
