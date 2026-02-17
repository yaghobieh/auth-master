/**
 * AuthMaster Store
 * Core authentication state management
 * @forgedevstack/forge-auth
 */

import type { AuthState, AuthUser, AuthError, AuthConfig, LogLevel } from '../types';
import { STORAGE_KEYS, AUTH_ERRORS } from '../constants';
import { logger } from '../utils/logger';

// ============================================================================
// Initial State
// ============================================================================

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticating: false,
  isAuthenticated: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

// ============================================================================
// Auth Store
// ============================================================================

export class AuthStore {
  private state: AuthState;
  private config: AuthConfig;
  private listeners: Set<() => void> = new Set();

  constructor(config: AuthConfig) {
    this.config = config;
    this.state = { ...initialState };

    // Set log level
    if (config.logLevel) {
      logger.setLevel(config.logLevel);
    }

    // Initialize from storage
    if (config.persist !== false) {
      this.loadFromStorage();
    }

    logger.logInit();
  }

  // ==========================================================================
  // State Management
  // ==========================================================================

  getState(): AuthState {
    return this.state;
  }

  getConfig(): AuthConfig {
    return this.config;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // ==========================================================================
  // Storage
  // ==========================================================================

  private loadFromStorage(): void {
    logger.debug('Loading auth state from storage');

    try {
      const prefix = this.config.storageKey || '';
      const userJson = localStorage.getItem(`${prefix}${STORAGE_KEYS.USER}`);
      const accessToken = localStorage.getItem(`${prefix}${STORAGE_KEYS.ACCESS_TOKEN}`);
      const refreshToken = localStorage.getItem(`${prefix}${STORAGE_KEYS.REFRESH_TOKEN}`);
      const expiresAt = localStorage.getItem(`${prefix}${STORAGE_KEYS.EXPIRES_AT}`);

      if (userJson && accessToken) {
        const user = JSON.parse(userJson) as AuthUser;

        // Check if token expired
        if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
          logger.warn('Token expired, clearing session');
          this.clearStorage();
          this.setState({ isLoading: false });
          return;
        }

        this.setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        logger.info('Restored session', { email: user.email, provider: user.provider });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      logger.error('Failed to load from storage', error);
      this.setState({ isLoading: false });
    }
  }

  private saveToStorage(): void {
    if (this.config.persist === false) return;

    const prefix = this.config.storageKey || '';

    try {
      if (this.state.user) {
        localStorage.setItem(`${prefix}${STORAGE_KEYS.USER}`, JSON.stringify(this.state.user));
      }
      if (this.state.accessToken) {
        localStorage.setItem(`${prefix}${STORAGE_KEYS.ACCESS_TOKEN}`, this.state.accessToken);
      }
      if (this.state.refreshToken) {
        localStorage.setItem(`${prefix}${STORAGE_KEYS.REFRESH_TOKEN}`, this.state.refreshToken);
      }
      if (this.state.user?.expiresAt) {
        localStorage.setItem(`${prefix}${STORAGE_KEYS.EXPIRES_AT}`, this.state.user.expiresAt.toString());
      }
    } catch (error) {
      logger.error('Failed to save to storage', error);
    }
  }

  private clearStorage(): void {
    const prefix = this.config.storageKey || '';

    try {
      localStorage.removeItem(`${prefix}${STORAGE_KEYS.USER}`);
      localStorage.removeItem(`${prefix}${STORAGE_KEYS.ACCESS_TOKEN}`);
      localStorage.removeItem(`${prefix}${STORAGE_KEYS.REFRESH_TOKEN}`);
      localStorage.removeItem(`${prefix}${STORAGE_KEYS.EXPIRES_AT}`);
    } catch (error) {
      logger.error('Failed to clear storage', error);
    }
  }

  // ==========================================================================
  // Authentication Actions
  // ==========================================================================

  setAuthenticating(isAuthenticating: boolean): void {
    this.setState({ isAuthenticating, error: null });
  }

  setUser(user: AuthUser, accessToken: string, refreshToken?: string): void {
    logger.info('User signed in', { email: user.email, provider: user.provider });

    this.setState({
      user,
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isAuthenticating: false,
      error: null,
    });

    this.saveToStorage();

    // Call success callback
    this.config.onSuccess?.(user);
  }

  setError(error: AuthError): void {
    logger.error('Auth error', error);

    this.setState({
      error,
      isAuthenticating: false,
    });

    // Call error callback
    this.config.onError?.(error);
  }

  async signOut(): Promise<void> {
    logger.info('Signing out');

    this.clearStorage();
    this.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });

    // Call logout callback
    this.config.onLogout?.();
  }

  // ==========================================================================
  // Error Helpers
  // ==========================================================================

  createError(code: string, message: string, cause?: Error): AuthError {
    return { code, message, cause };
  }

  getErrorByCode(code: keyof typeof AUTH_ERRORS): AuthError {
    const messages: Record<string, string> = {
      [AUTH_ERRORS.POPUP_CLOSED]: 'Sign-in popup was closed',
      [AUTH_ERRORS.POPUP_BLOCKED]: 'Sign-in popup was blocked by browser',
      [AUTH_ERRORS.INVALID_TOKEN]: 'Invalid authentication token',
      [AUTH_ERRORS.TOKEN_EXPIRED]: 'Authentication token has expired',
      [AUTH_ERRORS.NETWORK_ERROR]: 'Network error occurred',
      [AUTH_ERRORS.PROVIDER_ERROR]: 'Authentication provider error',
      [AUTH_ERRORS.UNKNOWN_ERROR]: 'An unknown error occurred',
      [AUTH_ERRORS.NOT_CONFIGURED]: 'Provider not configured',
      [AUTH_ERRORS.ALREADY_SIGNED_IN]: 'Already signed in',
    };

    return {
      code: AUTH_ERRORS[code],
      message: messages[AUTH_ERRORS[code]] || 'Unknown error',
    };
  }

  // ==========================================================================
  // Logging
  // ==========================================================================

  setLogLevel(level: LogLevel): void {
    logger.setLevel(level);
  }

  getLogs() {
    return logger.getLogs();
  }

  clearLogs(): void {
    logger.clearLogs();
  }
}
