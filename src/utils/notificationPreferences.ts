// Display-only preferences for the admin/supervisor notification bell.
// These never affect what the backend sends or stores — only what's shown here.
const STORAGE_KEY = 'notification_preferences';
export const NOTIFICATION_PREFERENCES_CHANGED_EVENT = 'notification-preferences-changed';

export interface NotificationPreferences {
  reportNotifications: boolean;
  actionUpdates: boolean;
}

const defaults: NotificationPreferences = {
  reportNotifications: true,
  actionUpdates: true,
};

export const getNotificationPreferences = (): NotificationPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

export const setNotificationPreferences = (prefs: NotificationPreferences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event(NOTIFICATION_PREFERENCES_CHANGED_EVENT));
};
