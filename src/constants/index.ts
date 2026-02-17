import type { LogLevel } from '../types';

export const STORAGE_KEYS = {
  USER: 'forge_auth_user',
  ACCESS_TOKEN: 'forge_auth_access_token',
  REFRESH_TOKEN: 'forge_auth_refresh_token',
  EXPIRES_AT: 'forge_auth_expires_at',
} as const;

export const OAUTH_URLS = {
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  facebook: {
    auth: 'https://www.facebook.com/v18.0/dialog/oauth',
    token: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfo: 'https://graph.facebook.com/me',
  },
  github: {
    auth: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    userInfo: 'https://api.github.com/user',
  },
} as const;

export const DEFAULT_SCOPES = {
  google: ['openid', 'email', 'profile'],
  facebook: ['email', 'public_profile'],
  github: ['read:user', 'user:email'],
} as const;

export const AUTH_ERRORS = {
  POPUP_CLOSED: 'auth/popup-closed',
  POPUP_BLOCKED: 'auth/popup-blocked',
  INVALID_TOKEN: 'auth/invalid-token',
  TOKEN_EXPIRED: 'auth/token-expired',
  NETWORK_ERROR: 'auth/network-error',
  PROVIDER_ERROR: 'auth/provider-error',
  UNKNOWN_ERROR: 'auth/unknown-error',
  NOT_CONFIGURED: 'auth/not-configured',
  ALREADY_SIGNED_IN: 'auth/already-signed-in',
} as const;

export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
} as const;

export const LOG_COLORS = {
  debug: '#8b5cf6',
  info: '#3b82f6',
  warn: '#f59e0b',
  error: '#ef4444',
} as const;

declare const __FORGE_AUTH_VERSION__: string;

export const AUTH_MASTER = {
  name: 'AuthMaster',
  version: typeof __FORGE_AUTH_VERSION__ !== 'undefined' ? __FORGE_AUTH_VERSION__ : '1.0.0-beta',
  logo: '🔐',
} as const;

export const NUMBERS = {
  AVATAR_SIZE_DEFAULT: 40,
  AVATAR_FONT_RATIO: 0.4,
  ICON_SIZE_SM: 16,
  ICON_SIZE_MD: 20,
  ICON_SIZE_LG: 24,
  SESSION_DURATION_MS: 3600000,
  POPUP_WIDTH: 500,
  POPUP_HEIGHT: 600,
} as const;

export const BUTTON_LABELS = {
  google: 'Continue with Google',
  facebook: 'Continue with Facebook',
  github: 'Continue with GitHub',
} as const;

export const PROVIDER_COLORS = {
  google: { bg: 'bg-white', hover: 'hover:bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
  facebook: { bg: 'bg-[#1877f2]', hover: 'hover:bg-[#166fe5]', text: 'text-white', border: 'border-[#1877f2]' },
  github: { bg: 'bg-[#24292f]', hover: 'hover:bg-[#1b1f23]', text: 'text-white', border: 'border-[#24292f]' },
} as const;

export const BUTTON_SIZES = {
  sm: { padding: 'px-3 py-2', text: 'text-sm', gap: 'gap-2', iconSize: NUMBERS.ICON_SIZE_SM },
  md: { padding: 'px-4 py-2.5', text: 'text-sm', gap: 'gap-2.5', iconSize: NUMBERS.ICON_SIZE_MD },
  lg: { padding: 'px-6 py-3', text: 'text-base', gap: 'gap-3', iconSize: NUMBERS.ICON_SIZE_LG },
} as const;

/** @deprecated Use PROVIDER_COLORS instead */
export const BUTTON_COLORS = {
  google: { bg: '#ffffff', text: '#1f2937', border: '#e5e7eb', hoverBg: '#f9fafb', icon: '#ea4335' },
  facebook: { bg: '#1877f2', text: '#ffffff', border: '#1877f2', hoverBg: '#166fe5', icon: '#ffffff' },
  github: { bg: '#24292f', text: '#ffffff', border: '#24292f', hoverBg: '#1b1f23', icon: '#ffffff' },
} as const;
