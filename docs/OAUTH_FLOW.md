# OAuth Authentication Flow

## How OAuth Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OAUTH AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

 ┌──────────┐                                              ┌──────────────────┐
 │          │  1. Click "Sign in with Google"              │                  │
 │   USER   │ ─────────────────────────────────────────────│   YOUR APP       │
 │ (Browser)│                                              │   (Frontend)     │
 │          │                                              │                  │
 └────┬─────┘                                              └────────┬─────────┘
      │                                                             │
      │  2. Redirect to Google OAuth                                │
      │     https://accounts.google.com/o/oauth2/auth               │
      │     ?client_id=YOUR_CLIENT_ID                               │
      │     &redirect_uri=http://localhost:5173/auth/callback       │
      │     &scope=email profile                                    │
      ▼                                                             │
 ┌──────────────────┐                                               │
 │                  │                                               │
 │   GOOGLE OAUTH   │  3. User enters Google credentials            │
 │   LOGIN PAGE     │     and grants permission                     │
 │                  │                                               │
 └────────┬─────────┘                                               │
          │                                                         │
          │  4. Google redirects back with authorization CODE       │
          │     http://localhost:5173/auth/callback?code=4/abc123   │
          ▼                                                         │
 ┌──────────────────┐                                               │
 │                  │  5. Send code to YOUR backend                 │
 │  CALLBACK PAGE   │ ──────────────────────────────────────────────┤
 │  /auth/callback  │                                               │
 │                  │                                               │
 └──────────────────┘                                               │
                                                                    │
                                                                    ▼
                                                        ┌───────────────────┐
                                                        │                   │
                                                        │   YOUR BACKEND    │
                                                        │   (Harbor/Express)│
                                                        │                   │
                                                        └─────────┬─────────┘
                                                                  │
          6. Exchange code for tokens (SERVER-TO-SERVER)          │
             POST https://oauth2.googleapis.com/token             │
             - client_id                                          │
             - client_secret  ← SECRET! Never in frontend!        │
             - code                                                │
             - redirect_uri                                        │
                                                                  │
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │                   │
                                                        │   GOOGLE API      │
                                                        │                   │
                                                        └─────────┬─────────┘
                                                                  │
          7. Google returns:                                      │
             - access_token (for API calls)                       │
             - id_token (contains user info)                      │
             - refresh_token (for new tokens)                     │
                                                                  │
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │                   │
                                                        │   YOUR BACKEND    │
                                                        │   - Decode token  │
                                                        │   - Create/find   │
                                                        │     user in DB    │
                                                        │   - Return JWT    │
                                                        │                   │
                                                        └─────────┬─────────┘
                                                                  │
          8. Return user data + your app's JWT token              │
                                                                  │
                                                                  ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                                                                          │
 │   USER IS NOW LOGGED IN!                                                 │
 │   - Store JWT in localStorage                                            │
 │   - Use JWT for API requests                                             │
 │   - Show user dashboard                                                  │
 │                                                                          │
 └──────────────────────────────────────────────────────────────────────────┘
```

## Where Does client_id Come From?

The `client_id` comes from **Google Cloud Console**:

### Step-by-Step:

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://yourapp.com/auth/callback` (production)
7. Copy the **Client ID** and **Client Secret**

```
┌─────────────────────────────────────────────────────────────────┐
│ Google Cloud Console - OAuth 2.0 Client IDs                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Client ID:     123456789-abc.apps.googleusercontent.com        │
│                 ↑                                               │
│                 This goes in your FRONTEND (public)             │
│                                                                 │
│  Client Secret: GOCSPX-abcdefghijklmnop                         │
│                 ↑                                               │
│                 This goes in your BACKEND ONLY (secret!)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## AuthMaster Portal Login

### Current State: Demo Mode

The AuthMaster Portal currently uses **Email/Password** in demo mode:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   AuthMaster Portal - Login                     │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ Email: admin@example.com                │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ Password: ******** (any 6+ chars)       │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   [        Sign In        ]                     │
│                                                 │
│   In demo mode, any email + password works!     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**To login:**
- Email: `admin@example.com` (or any valid email)
- Password: `password123` (or any 6+ character password)

### For Production: Add Real Backend

```typescript
// 1. Configure with your API
<AuthProvider config={{
  email: {
    signInUrl: 'https://api.yourapp.com/auth/login',
    signUpUrl: 'https://api.yourapp.com/auth/register',
  },
  google: {
    clientId: '123456789-abc.apps.googleusercontent.com',
  },
}}>
  <App />
</AuthProvider>

// 2. Your backend validates credentials and returns:
{
  "user": {
    "id": "user_123",
    "email": "admin@example.com",
    "name": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## How the Next User Logs In

### Scenario 1: Demo/Development

```
Developer:
1. npm run dev
2. Go to http://localhost:5173
3. Enter any email + password (6+ chars)
4. They're "logged in" (demo mode)
```

### Scenario 2: Production with Email/Password

```
Real User:
1. Go to https://yourapp.com
2. Click "Sign Up" → Enter email, password, name
3. Backend creates user in database
4. User receives confirmation email (optional)
5. User logs in with credentials
6. Backend validates against database
7. Returns JWT token
8. User is authenticated!
```

### Scenario 3: Production with Google OAuth

```
Real User:
1. Go to https://yourapp.com
2. Click "Sign in with Google"
3. Popup opens → Google login page
4. User enters Google credentials
5. Google redirects with code
6. Your backend exchanges code for tokens
7. Backend creates/finds user in database
8. Returns JWT token
9. User is authenticated!
```

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| `client_id` | Frontend | Identifies your app to Google |
| `client_secret` | Backend only! | Proves you own the app |
| `authorization code` | URL parameter | Temporary code from Google |
| `access_token` | Backend → Frontend | Allows API calls to Google |
| `id_token` | Backend | Contains user info (email, name) |
| `refresh_token` | Backend (database) | Gets new access tokens |
| `JWT token` | Your app | Your own token for your APIs |
