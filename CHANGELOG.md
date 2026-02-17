# Changelog

All notable changes to AuthMaster will be documented in this file.

## 1.0.0-beta.2 (2026-02-08)

### Added - AuthMaster Portal

- **Admin Dashboard** - User management portal like Auth0
  - Dashboard with stats, activity feed, provider overview
  - User management with Grid Table (search, filter, export)
  - Authentication logs viewer with filtering
  - Settings for providers, security, branding
- Uses ForgeStack ecosystem: Bear UI, Forge Compass, Grid Table, Synapse

### Changed - Code Refactoring

- All components now use **Tailwind CSS** (no inline styles)
- Components use **Bear UI** (Button, Input, Alert, Typography, Avatar)
- Added `useBear()` hook support for theme customization
- Cleaned up code - constants moved to `@constants`
- Removed verbose comment blocks

---

## 1.0.0-beta (2026-02-08)

### Added - Email Authentication (No OAuth Required!)

- `signInWithEmail()` - Sign in with email and password
- `signUpWithEmail()` - Create account with email and password  
- `EmailForm` - Combined sign in/sign up form component
- `EmailLoginForm` - Simple sign in form
- `EmailSignupForm` - Simple sign up form
- Support for custom API endpoints for email auth
- Local demo mode (works without any backend!)

### Components

- `EmailForm` - Full auth form with toggle between sign in/sign up
- `EmailLoginForm` - Focused sign in form
- `EmailSignupForm` - Focused sign up form

### Changed

- Demo now defaults to Email auth (no OAuth required)
- OAuth buttons hidden by default, toggle to show

### Fixed

- TypeScript type conflicts resolved
- `AuthProvider` type renamed to `AuthProviderType`
- `refreshToken` action renamed to `refreshAuthToken`

---

## 1.0.0-alpha (2026-02-08)

### Features

- Added interactive demo with mock OAuth
- Log level selector in demo UI
- Full authentication flow demonstration

### Initial Release

First alpha release of AuthMaster - Simple OAuth Authentication for React.

#### OAuth Providers

- **Google** - Full OAuth 2.0 support
- **Facebook** - Login integration
- **GitHub** - Developer-friendly auth

#### Components

- `AuthButton` - Generic OAuth button
- `GoogleButton` - Google sign-in button
- `FacebookButton` - Facebook sign-in button
- `GitHubButton` - GitHub sign-in button
- `AuthGuard` - Protect authenticated content
- `GuestGuard` - Show content to non-authenticated users
- `UserAvatar` - Display user profile picture
- `UserInfo` - Show user details
- `SignOutButton` - Sign out action

#### Hooks

- `useAuth` - Main auth hook
- `useUser` - Get current user
- `useIsAuthenticated` - Check auth status
- `useAuthLoading` - Loading state
- `useAuthError` - Error state

#### Features

- Type-safe TypeScript
- Session persistence (localStorage)
- Configurable log levels
- Custom callbacks (onSuccess, onError, onLogout)
- Zero-config defaults
- Popup-based OAuth flow
- Auto token refresh support

---

## Roadmap

- [x] Email/Password authentication ✅
- [x] Admin Portal (AuthMaster Portal) ✅
- [x] Bear UI integration ✅
- [x] Tailwind CSS support ✅
- [ ] Magic link authentication
- [ ] Two-factor authentication (2FA)
- [ ] Apple Sign-In
- [ ] Microsoft/Azure AD
- [ ] JWT token management
- [ ] Role-based access control
- [ ] SSR support
- [ ] Session timeout handling
- [ ] Account linking
