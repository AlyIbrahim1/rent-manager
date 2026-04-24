export type AuthMode = "signin" | "signup" | "forgot_password";
export const AUTH_ROUTE_CHANGE_EVENT = "auth-route-change";

const AUTH_FLASH_MESSAGE_KEY = "auth_flash_message";

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

export function getAuthPath(mode: AuthMode) {
  if (mode === "signup") {
    return "/signup";
  }

  if (mode === "forgot_password") {
    return "/forgot-password";
  }

  return "/";
}

export function getAuthModeFromPath(pathname: string): AuthMode {
  const normalized = normalizePathname(pathname);

  if (normalized === "/signup") {
    return "signup";
  }

  if (normalized === "/forgot-password") {
    return "forgot_password";
  }

  return "signin";
}

export function syncAuthPath(mode: AuthMode, options?: { replace?: boolean }) {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = getAuthPath(mode);
  if (window.location.pathname === nextPath) {
    return;
  }

  const historyMethod = options?.replace ? "replaceState" : "pushState";
  window.history[historyMethod](window.history.state, "", nextPath);
  window.dispatchEvent(new Event(AUTH_ROUTE_CHANGE_EVENT));
}

export function setAuthFlashMessage(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_FLASH_MESSAGE_KEY, message);
}

export function consumeAuthFlashMessage() {
  if (typeof window === "undefined") {
    return null;
  }

  const message = sessionStorage.getItem(AUTH_FLASH_MESSAGE_KEY);
  if (!message) {
    return null;
  }

  sessionStorage.removeItem(AUTH_FLASH_MESSAGE_KEY);
  return message;
}
