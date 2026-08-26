"use client";

const TOKEN_KEY = "cgi_auth_access_token";
const USER_KEY = "cgi_auth_user";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token: string, user: AuthUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Set non-httpOnly cookie for client reads if needed
  document.cookie = `cgi_client_logged_in=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  if (user.role === "admin") {
    document.cookie = `cgi_admin_session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "cgi_client_logged_in=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "cgi_admin_session=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "cgi_user_session=; path=/; max-age=0; SameSite=Lax";
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Backwards compatibility aliases
export const getAdminToken = getAuthToken;
export const setAdminToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `cgi_admin_session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};
export const clearAdminToken = clearAuthSession;
