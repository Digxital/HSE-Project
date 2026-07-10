// Public, unauthenticated routes — the landing page and every role's login
// screen. Session-monitoring code (token-expiry checks, org-status polling,
// notification polling) must never act on these paths: a visitor here has no
// active session to protect, even if stale token/user data happens to be
// sitting in localStorage from a previous login.
export const isPublicRoute = (pathname: string = window.location.pathname): boolean => {
  return pathname === '/' || pathname.endsWith('/login');
};
