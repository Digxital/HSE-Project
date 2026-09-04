// Public, unauthenticated routes — the landing page and every role's login
// screen. Session-monitoring code (token-expiry checks, org-status polling,
// notification polling) must never act on these paths: a visitor here has no
// active session to protect, even if stale token/user data happens to be
// sitting in localStorage from a previous login.
export const isPublicRoute = (pathname: string = window.location.pathname): boolean => {
  return pathname === '/' || pathname.endsWith('/login');
};

// Path prefixes each role is allowed to land on after login, used to validate
// a `?redirect=` param (ProtectedRoute attaches one when it bounces an
// unauthenticated visitor to login) before honoring it.
const ROLE_PATH_PREFIXES = {
  ADMIN: ['/dashboard', '/users', '/reports', '/actions', '/analytics', '/profile', '/certification', '/settings', '/notifications', '/audit-log'],
  SUPERVISOR: ['/supervisor'],
  SUPERADMIN: ['/superadmin'],
} as const;

type RedirectRole = keyof typeof ROLE_PATH_PREFIXES;

// Only honor a redirect target that (a) is a same-app relative path — never an
// absolute or protocol-relative URL, which would make this an open redirect —
// and (b) actually belongs to the role that just logged in. A supervisor who
// got bounced off an admin URL shouldn't be sent back there just because the
// query param says so.
export const getSafeRedirectPath = (raw: string | null, role: RedirectRole): string | null => {
  if (!raw) return null;
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;

  const prefixes = ROLE_PATH_PREFIXES[role];
  const isAllowed = prefixes.some(
    (prefix) => raw === prefix || raw.startsWith(`${prefix}/`) || raw.startsWith(`${prefix}?`)
  );
  return isAllowed ? raw : null;
};
