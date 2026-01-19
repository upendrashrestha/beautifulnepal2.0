import { notificationService } from "./notification.service";

export class NotificationStreamService<T> {
  private eventSource: EventSource | null = null;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private stopped = false;

  constructor(
    private readonly apiBaseUrl: string,
    private readonly onMessage: (data: T) => void,
  ) {}

  async start() {
    if (this.stopped) return;

    const token = await notificationService.getSseToken();
    const url = `${this.apiBaseUrl}/notifications/stream?token=${token}`;

    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse((event as MessageEvent).data);
      //console.log("[SSE EVENT]", data);
      this.onMessage(data);
    });

    this.eventSource.onerror = () => {
      this.cleanup();
      if (!this.stopped) {
        this.reconnectTimer = setTimeout(() => this.start(), 3000);
      }
    };
  }

  stop() {
    this.stopped = true;
    this.cleanup();
  }

  private cleanup() {
    this.eventSource?.close();
    this.eventSource = null;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
  }
}
