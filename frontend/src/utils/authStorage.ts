const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const setAuthToken = (token: string, remember: boolean = false) => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const setRefreshToken = (token: string, remember: boolean = false) => {
  if (remember) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const setUserData = (user: any, remember: boolean = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
};