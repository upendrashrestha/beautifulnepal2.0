const TOKEN_KEY = "beautifulnepal_token";
const REFRESH_TOKEN_KEY = "beautifulnepal_refresh_token";

const isBrowser = (): boolean => typeof window !== "undefined";

export const setToken = (token: string): void => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = (): string | null => {
  if (!isBrowser()) return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = (): void => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};
