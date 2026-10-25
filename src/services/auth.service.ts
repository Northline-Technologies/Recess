import { pb } from './pocketbase';
import { User } from '@/types/models';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Authentication Service
 * Interacts with PocketBase auth collection ('users').
 * Keeps credentials and secrets out of source control.
 */
export const AuthService = {
  /**
   * Get the current active user record from the local authStore
   */
  getCurrentUser(): User | null {
    if (!pb.authStore.isValid || !pb.authStore.record) {
      return null;
    }
    return pb.authStore.record as unknown as User;
  },

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return pb.authStore.token || null;
  },

  /**
   * Check if current session is valid and not expired
   */
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  /**
   * Sign out the active user and clear persisted tokens
   */
  async signOut(): Promise<void> {
    pb.authStore.clear();
  },

  /**
   * Refresh session token with PocketBase
   */
  async refreshSession(): Promise<User | null> {
    if (!pb.authStore.isValid) return null;
    try {
      const authData = await pb.collection('users').authRefresh();
      return authData.record as unknown as User;
    } catch {
      pb.authStore.clear();
      return null;
    }
  },

  /**
   * Update profile fields (display name, bio, avatar, onboarding state)
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const updated = await pb.collection('users').update(userId, data);
    return updated as unknown as User;
  },

  /**
   * Initiate Google OAuth2 authentication flow.
   *
   * In mobile environments (Expo), PocketBase OAuth2 requires:
   * 1. Setting up Google OAuth credentials in PocketBase Admin UI (Settings > Auth Providers > Google)
   * 2. Using `expo-web-browser` and `expo-linking` to handle redirect URI `skillshare://auth-callback`
   * 3. Calling `pb.collection('users').authWithOAuth2({ provider: 'google', urlCallback: ... })`
   */
  async signInWithGoogle(urlCallback?: (url: string) => void): Promise<User> {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        urlCallback,
      });
      return authData.record as unknown as User;
    } catch (error: any) {
      // Differentiate user cancellation from network or server errors
      if (error?.isAbort) {
        throw new Error('Sign-in cancelled by user');
      }
      throw new Error(error?.message || 'Failed to authenticate with Google');
    }
  },

  /**
   * Optional helper for local developer testing before OAuth is configured in PocketBase
   */
  async signInWithPassword(email: string, password: string): Promise<User> {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData.record as unknown as User;
  },
};
