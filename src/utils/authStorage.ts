const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const SUPERADMIN_TOKEN_KEY = 'superadmin_auth_token';
const SUPERADMIN_USER_KEY = 'superadmin_user_data';

export type UserData = {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId?: string;
}
 
export const setAuthToken = (token: string, remember: boolean = false) => {
  // Ensure only one storage source is used at a time.
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const setSuperAdminAuthToken = (token: string, remember: boolean = true) => {
  localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
  sessionStorage.removeItem(SUPERADMIN_TOKEN_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SUPERADMIN_TOKEN_KEY, token);
};

export const getSuperAdminAuthToken = (): string | null => {
  return localStorage.getItem(SUPERADMIN_TOKEN_KEY) || sessionStorage.getItem(SUPERADMIN_TOKEN_KEY);
};

export const removeSuperAdminAuthToken = () => {
  localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
  sessionStorage.removeItem(SUPERADMIN_TOKEN_KEY);
};

export const setRefreshToken = (token: string, remember: boolean = false) => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setUserData = (user: UserData, remember: boolean = false) => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = (): UserData | null => {
  const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const setSuperAdminUserData = (user: UserData, remember: boolean = true) => {
  localStorage.removeItem(SUPERADMIN_USER_KEY);
  sessionStorage.removeItem(SUPERADMIN_USER_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SUPERADMIN_USER_KEY, JSON.stringify(user));
};

export const getSuperAdminUserData = (): UserData | null => {
  const userJson = localStorage.getItem(SUPERADMIN_USER_KEY) || sessionStorage.getItem(SUPERADMIN_USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeSuperAdminUserData = () => {
  localStorage.removeItem(SUPERADMIN_USER_KEY);
  sessionStorage.removeItem(SUPERADMIN_USER_KEY);
};