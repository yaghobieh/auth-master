/**
 * Google OAuth Provider
 * @forgedevstack/forge-auth
 */

import type { AuthUser, GoogleAuthConfig } from '../types';
import { OAUTH_URLS, DEFAULT_SCOPES, AUTH_ERRORS } from '../constants';
import { logger } from '../utils/logger';
import { AuthStore } from '../core/AuthStore';

// ============================================================================
// Google OAuth
// ============================================================================

export async function signInWithGoogle(store: AuthStore): Promise<AuthUser | null> {
  const config = store.getConfig().google;

  if (!config?.clientId) {
    store.setError(store.getErrorByCode('NOT_CONFIGURED'));
    return null;
  }

  logger.info('Initiating Google sign-in');
  store.setAuthenticating(true);

  try {
    const user = await openGooglePopup(config);
    
    if (user) {
      // In real implementation, you'd exchange code for tokens
      // For now, we simulate with mock data
      const mockToken = `google_${Date.now()}`;
      store.setUser(user, mockToken);
      return user;
    }

    return null;
  } catch (error) {
    const authError = store.createError(
      AUTH_ERRORS.PROVIDER_ERROR,
      'Google sign-in failed',
      error as Error
    );
    store.setError(authError);
    return null;
  }
}

// ============================================================================
// Popup Handler
// ============================================================================

async function openGooglePopup(config: GoogleAuthConfig): Promise<AuthUser | null> {
  const scopes = config.scopes || DEFAULT_SCOPES.google;
  const redirectUri = config.redirectUri || `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `${OAUTH_URLS.google.auth}?${params.toString()}`;
  
  logger.debug('Opening Google OAuth popup', { authUrl });

  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );

    if (!popup) {
      logger.error('Popup blocked');
      reject(new Error('Popup blocked'));
      return;
    }

    // Listen for callback
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        popup.close();

        const user: AuthUser = {
          id: event.data.user.id,
          email: event.data.user.email,
          name: event.data.user.name,
          avatar: event.data.user.picture,
          provider: 'google',
          providerId: event.data.user.id,
          expiresAt: Date.now() + 3600000, // 1 hour
        };

        logger.info('Google sign-in successful', { email: user.email });
        resolve(user);
      }

      if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        window.removeEventListener('message', handleMessage);
        popup.close();
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        logger.debug('Google popup closed');
        resolve(null);
      }
    }, 500);
  });
}

// ============================================================================
// URL Builder (for manual flow)
// ============================================================================

export function getGoogleAuthUrl(config: GoogleAuthConfig): string {
  const scopes = config.scopes || DEFAULT_SCOPES.google;
  const redirectUri = config.redirectUri || `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${OAUTH_URLS.google.auth}?${params.toString()}`;
}
