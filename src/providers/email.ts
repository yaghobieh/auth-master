/**
 * Email/Password Authentication Provider
 * No external OAuth required - works completely standalone!
 * @forgedevstack/forge-auth
 */

import type { AuthUser } from '../types';
import { AUTH_ERRORS } from '../constants';
import { logger } from '../utils/logger';
import { AuthStore } from '../core/AuthStore';

// ============================================================================
// Types
// ============================================================================

export interface EmailAuthConfig {
  /** API endpoint for sign up */
  signUpUrl?: string;
  /** API endpoint for sign in */
  signInUrl?: string;
  /** API endpoint for password reset */
  resetPasswordUrl?: string;
  /** Custom validation function */
  validateCredentials?: (email: string, password: string) => Promise<EmailAuthResult>;
  /** Minimum password length */
  minPasswordLength?: number;
}

export interface EmailAuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// ============================================================================
// Email Sign Up
// ============================================================================

export async function signUpWithEmail(
  store: AuthStore,
  data: SignUpData
): Promise<AuthUser | null> {
  const { email, password, name } = data;
  
  logger.info('Initiating email sign up', { email });
  store.setAuthenticating(true);

  try {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // If custom validation is provided, use it
    const config = store.getConfig();
    if ((config as { email?: EmailAuthConfig }).email?.validateCredentials) {
      const result = await (config as { email?: EmailAuthConfig }).email!.validateCredentials!(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Sign up failed');
      }
      if (result.user && result.token) {
        store.setUser(result.user, result.token);
        return result.user;
      }
    }

    // If API endpoint is provided, call it
    if ((config as { email?: EmailAuthConfig }).email?.signUpUrl) {
      const response = await fetch((config as { email?: EmailAuthConfig }).email!.signUpUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Sign up failed');
      }

      const data = await response.json();
      const user: AuthUser = {
        id: data.user?.id || data.id || generateId(),
        email: data.user?.email || email,
        name: data.user?.name || name,
        provider: 'email',
        providerId: data.user?.id || data.id || email,
        expiresAt: Date.now() + 3600000,
      };

      store.setUser(user, data.token || data.accessToken || generateToken());
      return user;
    }

    // Default: Create local user (for demo/development)
    const user: AuthUser = {
      id: generateId(),
      email,
      name: name || email.split('@')[0],
      provider: 'email',
      providerId: email,
      expiresAt: Date.now() + 3600000,
    };

    const token = generateToken();
    store.setUser(user, token);
    
    logger.info('Email sign up successful', { email });
    return user;

  } catch (error) {
    const authError = store.createError(
      AUTH_ERRORS.PROVIDER_ERROR,
      (error as Error).message || 'Sign up failed',
      error as Error
    );
    store.setError(authError);
    return null;
  }
}

// ============================================================================
// Email Sign In
// ============================================================================

export async function signInWithEmail(
  store: AuthStore,
  data: SignInData
): Promise<AuthUser | null> {
  const { email, password } = data;
  
  logger.info('Initiating email sign in', { email });
  store.setAuthenticating(true);

  try {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    // If custom validation is provided, use it
    const config = store.getConfig();
    if ((config as { email?: EmailAuthConfig }).email?.validateCredentials) {
      const result = await (config as { email?: EmailAuthConfig }).email!.validateCredentials!(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Invalid credentials');
      }
      if (result.user && result.token) {
        store.setUser(result.user, result.token);
        return result.user;
      }
    }

    // If API endpoint is provided, call it
    if ((config as { email?: EmailAuthConfig }).email?.signInUrl) {
      const response = await fetch((config as { email?: EmailAuthConfig }).email!.signInUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      const user: AuthUser = {
        id: data.user?.id || data.id || generateId(),
        email: data.user?.email || email,
        name: data.user?.name,
        avatar: data.user?.avatar,
        provider: 'email',
        providerId: data.user?.id || data.id || email,
        expiresAt: Date.now() + 3600000,
      };

      store.setUser(user, data.token || data.accessToken || generateToken());
      return user;
    }

    // Default: Accept any credentials (for demo/development)
    const user: AuthUser = {
      id: generateId(),
      email,
      name: email.split('@')[0],
      provider: 'email',
      providerId: email,
      expiresAt: Date.now() + 3600000,
    };

    const token = generateToken();
    store.setUser(user, token);
    
    logger.info('Email sign in successful', { email });
    return user;

  } catch (error) {
    const authError = store.createError(
      AUTH_ERRORS.PROVIDER_ERROR,
      (error as Error).message || 'Sign in failed',
      error as Error
    );
    store.setError(authError);
    return null;
  }
}

// ============================================================================
// Helpers
// ============================================================================

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateId(): string {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}
