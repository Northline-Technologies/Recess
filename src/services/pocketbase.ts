import PocketBase, { AsyncAuthStore } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PB_AUTH_STORAGE_KEY = '@skillshare_pb_auth';

// Read PocketBase URL from environment or default to local development address
export const POCKETBASE_URL =
  process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Configure persistent AsyncAuthStore so user credentials/tokens persist across app restarts
const authStore = new AsyncAuthStore({
  save: async (serialized: string) => {
    try {
      await AsyncStorage.setItem(PB_AUTH_STORAGE_KEY, serialized);
    } catch (e) {
      console.warn('Failed to save PocketBase auth state to AsyncStorage', e);
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.removeItem(PB_AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear PocketBase auth state from AsyncStorage', e);
    }
  },
  initial: AsyncStorage.getItem(PB_AUTH_STORAGE_KEY),
});

// Create and export the singleton PocketBase client instance
export const pb = new PocketBase(POCKETBASE_URL, authStore);

// Helper to check whether PocketBase server is reachable
export async function checkPocketBaseHealth(): Promise<{
  ok: boolean;
  code?: number;
  message?: string;
}> {
  try {
    const health = await pb.health.check();
    return { ok: health.code === 200, code: health.code, message: health.message };
  } catch (error: any) {
    return {
      ok: false,
      code: error?.status || 0,
      message: error?.message || 'Cannot reach PocketBase instance',
    };
  }
}

// Helper to construct secure file URLs
export function getFileUrl(
  record: { id: string; collectionId?: string; collectionName?: string },
  filename?: string,
  queryParams?: Record<string, any>
): string | null {
  if (!filename) return null;
  return pb.files.getURL(record as any, filename, queryParams);
}
