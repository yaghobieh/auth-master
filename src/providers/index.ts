/**
 * Auth Providers
 * @forgedevstack/forge-auth
 */

// OAuth Providers (require external setup)
export { signInWithGoogle, getGoogleAuthUrl } from './google';
export { signInWithFacebook, getFacebookAuthUrl } from './facebook';
export { signInWithGitHub, getGitHubAuthUrl } from './github';

// Email Provider (no external setup required!)
export { signUpWithEmail, signInWithEmail } from './email';
export type { EmailAuthConfig, EmailAuthResult, SignUpData, SignInData } from './email';
