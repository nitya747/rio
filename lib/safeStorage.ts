// Safe Storage Wrapper to prevent crashes in private browsing or webview environments
const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const memoryStorage: Record<string, string> = {};

export const safeGetItem = (key: string): string | null => {
  try {
    if (isStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn(`[SafeStorage] Failed to get key "${key}" from localStorage:`, e);
  }
  return memoryStorage[key] ?? null;
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    console.warn(`[SafeStorage] Failed to set key "${key}" in localStorage:`, e);
  }
  memoryStorage[key] = value;
};
