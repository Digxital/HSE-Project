// Display-only preferences for the superadmin notification bell. Kept entirely
// separate from the admin/supervisor notificationPreferences module — the two
// notification systems don't share code.
const STORAGE_KEY = 'superadmin_notification_preferences';
export const SUPERADMIN_NOTIFICATION_PREFERENCES_CHANGED_EVENT = 'superadmin-notification-preferences-changed';

export interface SuperAdminNotificationPreferences {
  receiveOrgNotifications: boolean;
  receiveAdminUpdates: boolean;
}

const defaults: SuperAdminNotificationPreferences = {
  receiveOrgNotifications: true,
  receiveAdminUpdates: true,
};

export const getSuperAdminNotificationPreferences = (): SuperAdminNotificationPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

export const setSuperAdminNotificationPreferences = (prefs: SuperAdminNotificationPreferences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event(SUPERADMIN_NOTIFICATION_PREFERENCES_CHANGED_EVENT));
};
