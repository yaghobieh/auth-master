/**
 * AuthMaster Types
 * @forgedevstack/forge-auth
 */

// ============================================================================
// User Types
// ============================================================================

export interface AuthUser {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  name?: string;
  /** User's avatar/profile picture URL */
  avatar?: string;
  /** OAuth provider used */
  provider: AuthProviderType;
  /** Provider-specific user ID */
  providerId: string;
  /** Additional provider-specific data */
  metadata?: Record<string, unknown>;
  /** Token expiration timestamp */
  expiresAt?: number;
}

export type AuthProviderType = 'google' | 'facebook' | 'github' | 'email';

// ============================================================================
// Auth State Types
// ============================================================================

export interface AuthState {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Loading state */
  isLoading: boolean;
  /** Authentication in progress */
  isAuthenticating: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current error */
  error: AuthError | null;
  /** Access token */
  accessToken: string | null;
  /** Refresh token */
  refreshToken: string | null;
}

export interface AuthError {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** Original error */
  cause?: Error;
}

// ============================================================================
// Provider Configuration
// ============================================================================

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
}

export interface FacebookAuthConfig {
  appId: string;
  redirectUri?: string;
  scopes?: string[];
}

export interface GitHubAuthConfig {
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
}

export interface EmailAuthConfig {
  /** API endpoint for sign up */
  signUpUrl?: string;
  /** API endpoint for sign in */
  signInUrl?: string;
  /** API endpoint for password reset */
  resetPasswordUrl?: string;
  /** Minimum password length */
  minPasswordLength?: number;
}

export interface AuthConfig {
  /** Google OAuth configuration */
  google?: GoogleAuthConfig;
  /** Facebook OAuth configuration */
  facebook?: FacebookAuthConfig;
  /** GitHub OAuth configuration */
  github?: GitHubAuthConfig;
  /** Email/Password configuration (no OAuth required!) */
  email?: EmailAuthConfig;
  /** Storage key prefix */
  storageKey?: string;
  /** Enable persistence */
  persist?: boolean;
  /** Log level */
  logLevel?: LogLevel;
  /** Callback URL for OAuth redirects */
  callbackUrl?: string;
  /** Custom token refresh handler */
  onTokenRefresh?: (token: string) => Promise<string | null>;
  /** Custom error handler */
  onError?: (error: AuthError) => void;
  /** Custom success handler */
  onSuccess?: (user: AuthUser) => void;
  /** Custom logout handler */
  onLogout?: () => void;
}

// ============================================================================
// Logger Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
}

// ============================================================================
// Auth Actions
// ============================================================================

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthActions {
  /** Sign in with Google (requires OAuth setup) */
  signInWithGoogle: () => Promise<AuthUser | null>;
  /** Sign in with Facebook (requires OAuth setup) */
  signInWithFacebook: () => Promise<AuthUser | null>;
  /** Sign in with GitHub (requires OAuth setup) */
  signInWithGitHub: () => Promise<AuthUser | null>;
  /** Sign in with email/password (no OAuth required!) */
  signInWithEmail: (data: SignInData) => Promise<AuthUser | null>;
  /** Sign up with email/password (no OAuth required!) */
  signUpWithEmail: (data: SignUpData) => Promise<AuthUser | null>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Refresh the auth token */
  refreshAuthToken: () => Promise<boolean>;
  /** Get current user */
  getUser: () => AuthUser | null;
}

// ============================================================================
// Auth Context Types
// ============================================================================

export interface AuthContextValue extends AuthState, AuthActions {
  /** Configuration */
  config: AuthConfig;
}

// ============================================================================
// Provider Props
// ============================================================================

export interface AuthProviderProps {
  children: React.ReactNode;
  config: AuthConfig;
}

// ============================================================================
// OAuth Response Types
// ============================================================================

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
}

export interface OAuthUserResponse {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  avatar_url?: string;
}
