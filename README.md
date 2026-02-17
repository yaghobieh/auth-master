# 🔐 AuthMaster

**Simple Authentication for React - No OAuth Setup Required!**

Part of the [ForgeStack](https://github.com/yaghobieh/ForgeStack) ecosystem.

[![npm version](https://img.shields.io/npm/v/@forgedevstack/forge-auth.svg)](https://www.npmjs.com/package/@forgedevstack/forge-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Email/Password Auth** - Works without any external setup!
- Google, Facebook, GitHub OAuth (optional)
- Type-safe with TypeScript
- Zero configuration defaults
- Built-in UI components
- Session persistence
- Log levels for debugging
- React hooks API
- Lightweight (~5KB gzipped)

---

## Installation

```bash
npm install @forgedevstack/forge-auth
```

---

## Quick Start (Email Auth - No Setup Required!)

```tsx
import { AuthProvider, EmailForm, useAuth } from '@forgedevstack/forge-auth';

// 1. Wrap your app
function App() {
  return (
    <AuthProvider config={{ logLevel: 'info' }}>
      <LoginPage />
    </AuthProvider>
  );
}

// 2. Use email form - works immediately!
function LoginPage() {
  const { isAuthenticated, user, signOut } = useAuth();

  if (isAuthenticated()) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <EmailForm />;  // Sign in/sign up with email!
}
```

### With OAuth (Optional)

```tsx
import { AuthProvider, GoogleButton, FacebookButton, GitHubButton } from '@forgedevstack/forge-auth';

<AuthProvider
  config={{
    google: { clientId: 'your-google-client-id' },
    facebook: { appId: 'your-facebook-app-id' },
    github: { clientId: 'your-github-client-id' },
  }}
>
  <GoogleButton />
  <FacebookButton />
  <GitHubButton />
</AuthProvider>
```

---

## OAuth Setup

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs

```tsx
<AuthProvider
  config={{
    google: {
      clientId: 'your-client-id.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
    },
  }}
>
```

### Facebook

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app and add Facebook Login
3. Configure OAuth redirect URIs

```tsx
<AuthProvider
  config={{
    facebook: {
      appId: 'your-app-id',
      scopes: ['email', 'public_profile'],
    },
  }}
>
```

### GitHub

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Create an OAuth App
3. Set callback URL

```tsx
<AuthProvider
  config={{
    github: {
      clientId: 'your-client-id',
      scopes: ['read:user', 'user:email'],
    },
  }}
>
```

---

## Components

### Email Forms (No OAuth Required!)

```tsx
import { EmailForm, EmailLoginForm, EmailSignupForm } from '@forgedevstack/forge-auth';

// Combined form with toggle
<EmailForm />

// Sign in only
<EmailLoginForm onSuccess={() => navigate('/dashboard')} />

// Sign up only
<EmailSignupForm onSuccess={() => navigate('/welcome')} />
```

### useAuth with Email

```tsx
const { signInWithEmail, signUpWithEmail } = useAuth();

// Sign in
await signInWithEmail({ email: 'user@example.com', password: 'secret123' });

// Sign up
await signUpWithEmail({ email: 'user@example.com', password: 'secret123', name: 'John' });
```

### Connect to Your API

```tsx
<AuthProvider
  config={{
    email: {
      signInUrl: '/api/auth/login',      // POST { email, password }
      signUpUrl: '/api/auth/register',   // POST { email, password, name }
      resetPasswordUrl: '/api/auth/reset', // POST { email }
    },
  }}
>
```

### Auth Buttons

```tsx
import { GoogleButton, FacebookButton, GitHubButton, AuthButton } from '@forgedevstack/forge-auth';

// Individual buttons
<GoogleButton />
<FacebookButton />
<GitHubButton />

// Generic button
<AuthButton provider="google" variant="outline" size="lg" fullWidth />
```

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'minimal'` | `'default'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Full width button |
| `disabled` | `boolean` | `false` | Disabled state |

### Auth Guard

```tsx
import { AuthGuard, GuestGuard } from '@forgedevstack/forge-auth';

// Only show to authenticated users
<AuthGuard fallback={<LoginPage />} loading={<Spinner />}>
  <Dashboard />
</AuthGuard>

// Only show to guests
<GuestGuard fallback={<Navigate to="/dashboard" />}>
  <LoginPage />
</GuestGuard>
```

### User Components

```tsx
import { UserAvatar, UserInfo, SignOutButton } from '@forgedevstack/forge-auth';

<UserAvatar size={48} />
<UserInfo showEmail showProvider />
<SignOutButton>Log out</SignOutButton>
```

---

## Hooks

### useAuth

Main hook for accessing auth state and methods.

```tsx
const {
  // State
  user,              // Current user
  isAuthenticated,   // Function - call as isAuthenticated()
  isLoading,         // Initial load
  isAuthenticating,  // Auth in progress
  error,             // Auth error
  accessToken,       // Auth token
  
  // Email Methods (no setup!)
  signInWithEmail,   // ({ email, password }) => Promise
  signUpWithEmail,   // ({ email, password, name? }) => Promise
  
  // OAuth Methods (require setup)
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub,
  
  // Actions
  signOut,
  refreshAuthToken,
} = useAuth();
```

### Other Hooks

```tsx
import { useUser, useIsAuthenticated, useAuthLoading, useAuthError } from '@forgedevstack/forge-auth';

const user = useUser();                    // Get user
const isAuthenticated = useIsAuthenticated(); // Check auth
const isLoading = useAuthLoading();        // Loading state
const error = useAuthError();              // Error state
```

---

## Configuration

```tsx
interface AuthConfig {
  // OAuth providers
  google?: { clientId: string; scopes?: string[]; redirectUri?: string };
  facebook?: { appId: string; scopes?: string[]; redirectUri?: string };
  github?: { clientId: string; scopes?: string[]; redirectUri?: string };
  
  // Storage
  storageKey?: string;     // Storage prefix (default: '')
  persist?: boolean;       // Enable persistence (default: true)
  
  // Logging
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'none';
  
  // Callbacks
  onSuccess?: (user: AuthUser) => void;
  onError?: (error: AuthError) => void;
  onLogout?: () => void;
}
```

---

## Log Levels

Control console output with `logLevel`:

```tsx
<AuthProvider config={{ logLevel: 'debug' }}>
  {/* All logs */}
</AuthProvider>

<AuthProvider config={{ logLevel: 'error' }}>
  {/* Errors only */}
</AuthProvider>

<AuthProvider config={{ logLevel: 'none' }}>
  {/* Silent */}
</AuthProvider>
```

| Level | Shows |
|-------|-------|
| `debug` | Everything |
| `info` | Info, warnings, errors |
| `warn` | Warnings and errors |
| `error` | Errors only |
| `none` | Silent |

---

## User Type

```tsx
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider: 'email' | 'google' | 'facebook' | 'github';
  providerId: string;
  metadata?: Record<string, unknown>;
  expiresAt?: number;
}
```

---

## With Bear UI

AuthMaster works seamlessly with Bear UI:

```tsx
import { Card, Flex, Text, Divider } from '@forgedevstack/bear';
import { GoogleButton, FacebookButton, GitHubButton } from '@forgedevstack/forge-auth';

function LoginCard() {
  return (
    <Card padding="lg" shadow="md">
      <Text variant="h3" align="center" mb="lg">
        Sign In
      </Text>
      <Flex direction="column" gap="sm">
        <GoogleButton fullWidth />
        <FacebookButton fullWidth />
        <GitHubButton fullWidth />
      </Flex>
      <Divider my="md" />
      <Text size="sm" color="muted" align="center">
        By signing in, you agree to our Terms of Service
      </Text>
    </Card>
  );
}
```

---

## Server-Side Callback

Handle OAuth callback on your server:

```ts
// Express route
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);
  
  // Get user info
  const user = await getUserInfo(tokens.access_token);
  
  // Send to frontend
  res.send(`
    <script>
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        user: ${JSON.stringify(user)},
        tokens: ${JSON.stringify(tokens)}
      }, '*');
    </script>
  `);
});
```

---

## AuthMaster Portal

A complete admin dashboard for managing users and authentication - like Auth0, but self-hosted!

```bash
# Run the portal
npm run portal

# Build for production
npm run portal:build
```

### Portal Features

- **Dashboard** - Stats, activity feed, provider overview
- **User Management** - Search, filter, edit, ban users (uses Grid Table)
- **Auth Logs** - Real-time authentication event viewer
- **Settings** - Configure providers, security policies, branding

### Portal Tech Stack

- **UI**: Bear UI components
- **Routing**: Forge Compass
- **Tables**: Grid Table
- **State**: Synapse
- **API**: Forge Query

---

## Theme Customization

AuthMaster uses Bear's theme system. Customize colors via `ThemeProvider`:

```tsx
import { ThemeProvider } from '@forgedevstack/bear';

<ThemeProvider theme={{ primary: '#8b5cf6' }}>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

Components automatically use `useBear()` hook to access theme colors.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

---

## License

MIT © [ForgeStack](https://github.com/yaghobieh/ForgeStack)
