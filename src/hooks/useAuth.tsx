/**
 * AuthMaster React Hooks
 * @forgedevstack/forge-auth
 */

import React, { createContext, useContext, useMemo, useSyncExternalStore, useCallback } from 'react';
import type { AuthContextValue, AuthUser, AuthProviderProps } from '../types';
import { AuthStore } from '../core/AuthStore';
import { signInWithGoogle } from '../providers/google';
import { signInWithFacebook } from '../providers/facebook';
import { signInWithGitHub } from '../providers/github';
import { signInWithEmail, signUpWithEmail } from '../providers/email';
import type { SignInData, SignUpData } from '../providers/email';

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, config }) => {
  // Create store once
  const store = useMemo(() => new AuthStore(config), []);

  // Subscribe to state changes
  const state = useSyncExternalStore(
    (callback) => store.subscribe(callback),
    () => store.getState()
  );

  // Actions
  const signInWithGoogleFn = useCallback(async () => {
    return signInWithGoogle(store);
  }, [store]);

  const signInWithFacebookFn = useCallback(async () => {
    return signInWithFacebook(store);
  }, [store]);

  const signInWithGitHubFn = useCallback(async () => {
    return signInWithGitHub(store);
  }, [store]);

  const signInWithEmailFn = useCallback(async (data: SignInData) => {
    return signInWithEmail(store, data);
  }, [store]);

  const signUpWithEmailFn = useCallback(async (data: SignUpData) => {
    return signUpWithEmail(store, data);
  }, [store]);

  const signOut = useCallback(async () => {
    return store.signOut();
  }, [store]);

  const refreshAuthToken = useCallback(async () => {
    // Token refresh logic
    return false;
  }, []);

  const getUser = useCallback(() => {
    return store.getState().user;
  }, [store]);

  // Context value
  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      config,
      signInWithGoogle: signInWithGoogleFn,
      signInWithFacebook: signInWithFacebookFn,
      signInWithGitHub: signInWithGitHubFn,
      signInWithEmail: signInWithEmailFn,
      signUpWithEmail: signUpWithEmailFn,
      signOut,
      refreshAuthToken,
      getUser,
    }),
    [state, config, signInWithGoogleFn, signInWithFacebookFn, signInWithGitHubFn, signInWithEmailFn, signUpWithEmailFn, signOut, refreshAuthToken, getUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Main auth hook - access all auth state and methods
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Get current user
 */
export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Check if authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Get loading state
 */
export function useAuthLoading(): boolean {
  const { isLoading, isAuthenticating } = useAuth();
  return isLoading || isAuthenticating;
}

/**
 * Get auth error
 */
export function useAuthError() {
  const { error } = useAuth();
  return error;
}
