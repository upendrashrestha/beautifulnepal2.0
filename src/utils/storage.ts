const ACCESS_TOKEN_KEY = "accessToken";

const isBrowser = typeof window !== "undefined";

const storage = {
  getToken(): string | null {
    if (!isBrowser) return null;

    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    if (!isBrowser) return;

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {}
  },

  removeToken() {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch {}
  },
};

export default storage;
