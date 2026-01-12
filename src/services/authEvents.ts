type AuthEvent = "unauthorized";

type Listener = () => void;

class AuthEventEmitter {
  private listeners: Record<AuthEvent, Listener[]> = {
    unauthorized: [],
  };

  on(event: AuthEvent, listener: Listener) {
    this.listeners[event].push(listener);
  }

  off(event: AuthEvent, listener: Listener) {
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  emit(event: AuthEvent) {
    this.listeners[event].forEach((listener) => listener());
  }
}

export const authEvents = new AuthEventEmitter();
