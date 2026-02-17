/**
 * 🔐 AuthMaster - Simple OAuth Authentication for React
 * @forgedevstack/forge-auth
 *
 * A lightweight, type-safe authentication library with
 * Google, Facebook, and GitHub OAuth support.
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // User
  AuthUser,
  AuthProviderType,
  // State
  AuthState,
  AuthError,
  // Config
  AuthConfig,
  GoogleAuthConfig,
  FacebookAuthConfig,
  GitHubAuthConfig,
  EmailAuthConfig,
  // Email auth
  SignInData,
  SignUpData,
  // Context
  AuthContextValue,
  AuthActions,
  AuthProviderProps,
  // Logger
  LogLevel,
  LogEntry,
} from './types';

// ============================================================================
// Constants
// ============================================================================

export {
  STORAGE_KEYS,
  OAUTH_URLS,
  DEFAULT_SCOPES,
  AUTH_ERRORS,
  LOG_LEVELS,
  AUTH_MASTER,
  BUTTON_COLORS,
} from './constants';

// ============================================================================
// Core
// ============================================================================

export { AuthStore } from './core/AuthStore';

// ============================================================================
// Providers
// ============================================================================

export {
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub,
  getGoogleAuthUrl,
  getFacebookAuthUrl,
  getGitHubAuthUrl,
} from './providers';

// ============================================================================
// React Hooks
// ============================================================================

export {
  AuthProvider,
  useAuth,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from './hooks';

// ============================================================================
// Components
// ============================================================================

export {
  // OAuth Buttons (require external setup)
  AuthButton,
  GoogleButton,
  FacebookButton,
  GitHubButton,
  // Auth Guards
  AuthGuard,
  GuestGuard,
  // User Components
  UserAvatar,
  UserInfo,
  SignOutButton,
  // Email Forms (no OAuth required!)
  EmailForm,
  EmailLoginForm,
  EmailSignupForm,
} from './components';

// ============================================================================
// Utils
// ============================================================================

export { logger } from './utils/logger';
