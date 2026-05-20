/**
 * Client auth session helpers.
 * Login writes via setAuth(); protected API calls use `api` (Bearer token from getAccessToken()).
 */

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  userId: "userId",
  email: "email",
} as const;

export type AuthSession = {
  isLoggedIn: boolean;
  accessToken: string | null;
  userId: string | null;
  email: string | null;
};

export type SetAuthInput = {
  accessToken: string;
  userId: string;
  email: string;
};

function readFromStorage(storage: Storage) {
  return {
    accessToken: storage.getItem(STORAGE_KEYS.accessToken),
    userId: storage.getItem(STORAGE_KEYS.userId),
    email: storage.getItem(STORAGE_KEYS.email),
  };
}

/** Current session from localStorage or sessionStorage. */
export function getAuth(): AuthSession {
  const local = readFromStorage(localStorage);
  if (local.accessToken) {
    return { isLoggedIn: true, ...local };
  }

  const session = readFromStorage(sessionStorage);
  if (session.accessToken) {
    return { isLoggedIn: true, ...session };
  }

  return {
    isLoggedIn: false,
    accessToken: null,
    userId: null,
    email: null,
  };
}

/** Token for Authorization header (used by api interceptor). */
export function getAccessToken(): string | null {
  return getAuth().accessToken;
}

/** Persist session after login. */
export function setAuth(data: SetAuthInput, keepSignedIn: boolean): void {
  const storage = keepSignedIn ? localStorage : sessionStorage;
  const other = keepSignedIn ? sessionStorage : localStorage;

  storage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
  storage.setItem(STORAGE_KEYS.userId, data.userId);
  storage.setItem(STORAGE_KEYS.email, data.email);

  for (const key of Object.values(STORAGE_KEYS)) {
    other.removeItem(key);
  }
}

/** Clear session from both storages. */
export function logout(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
