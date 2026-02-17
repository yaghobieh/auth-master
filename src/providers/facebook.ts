/**
 * Facebook OAuth Provider
 * @forgedevstack/forge-auth
 */

import type { AuthUser, FacebookAuthConfig } from '../types';
import { OAUTH_URLS, DEFAULT_SCOPES, AUTH_ERRORS } from '../constants';
import { logger } from '../utils/logger';
import { AuthStore } from '../core/AuthStore';

// ============================================================================
// Facebook OAuth
// ============================================================================

export async function signInWithFacebook(store: AuthStore): Promise<AuthUser | null> {
  const config = store.getConfig().facebook;

  if (!config?.appId) {
    store.setError(store.getErrorByCode('NOT_CONFIGURED'));
    return null;
  }

  logger.info('Initiating Facebook sign-in');
  store.setAuthenticating(true);

  try {
    const user = await openFacebookPopup(config);
    
    if (user) {
      const mockToken = `facebook_${Date.now()}`;
      store.setUser(user, mockToken);
      return user;
    }

    return null;
  } catch (error) {
    const authError = store.createError(
      AUTH_ERRORS.PROVIDER_ERROR,
      'Facebook sign-in failed',
      error as Error
    );
    store.setError(authError);
    return null;
  }
}

// ============================================================================
// Popup Handler
// ============================================================================

async function openFacebookPopup(config: FacebookAuthConfig): Promise<AuthUser | null> {
  const scopes = config.scopes || DEFAULT_SCOPES.facebook;
  const redirectUri = config.redirectUri || `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: crypto.randomUUID(),
  });

  const authUrl = `${OAUTH_URLS.facebook.auth}?${params.toString()}`;
  
  logger.debug('Opening Facebook OAuth popup', { authUrl });

  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'Facebook Sign In',
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

      if (event.data?.type === 'FACEBOOK_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        popup.close();

        const user: AuthUser = {
          id: event.data.user.id,
          email: event.data.user.email,
          name: event.data.user.name,
          avatar: event.data.user.picture?.data?.url,
          provider: 'facebook',
          providerId: event.data.user.id,
          expiresAt: Date.now() + 3600000,
        };

        logger.info('Facebook sign-in successful', { email: user.email });
        resolve(user);
      }

      if (event.data?.type === 'FACEBOOK_AUTH_ERROR') {
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
        logger.debug('Facebook popup closed');
        resolve(null);
      }
    }, 500);
  });
}

// ============================================================================
// URL Builder
// ============================================================================

export function getFacebookAuthUrl(config: FacebookAuthConfig): string {
  const scopes = config.scopes || DEFAULT_SCOPES.facebook;
  const redirectUri = config.redirectUri || `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
  });

  return `${OAUTH_URLS.facebook.auth}?${params.toString()}`;
}
