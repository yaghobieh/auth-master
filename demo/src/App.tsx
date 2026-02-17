import React, { useState } from 'react';
import {
  AuthProvider,
  GoogleButton,
  FacebookButton,
  GitHubButton,
  EmailForm,
  GuestGuard,
  UserAvatar,
  SignOutButton,
  useAuth,
  useUser,
  logger,
  AUTH_MASTER,
} from '@forgedevstack/forge-auth';
import type { LogLevel, AuthUser, AuthError } from '@forgedevstack/forge-auth';

// ============================================================================
// Demo Components
// ============================================================================

const Header: React.FC = () => {
  return (
    <header style={{
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>🔐</span>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>
            {AUTH_MASTER.name}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            v{AUTH_MASTER.version} Demo
          </p>
        </div>
      </div>
      <AuthStatus />
    </header>
  );
};

const AuthStatus: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--error)',
      }}>
        Not Signed In
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <UserAvatar size={32} />
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        {user?.name || user?.email}
      </span>
      <SignOutButton style={{
        backgroundColor: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
      }}>
        Sign Out
      </SignOutButton>
    </div>
  );
};

// ============================================================================
// Login Card
// ============================================================================

const LoginCard: React.FC = () => {
  const [showOAuth, setShowOAuth] = useState(false);
  const { isAuthenticating } = useAuth();

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '48px' }}>🔐</span>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '12px' }}>
          {AUTH_MASTER.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          No OAuth setup required!
        </p>
      </div>

      {/* Email Form - No OAuth Required! */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        <EmailForm />
      </div>

      {/* Toggle OAuth section */}
      <button
        onClick={() => setShowOAuth(!showOAuth)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-muted)',
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: showOAuth ? '16px' : '0',
        }}
      >
        {showOAuth ? 'Hide' : 'Show'} OAuth Options (requires setup)
      </button>

      {showOAuth && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>
            OAuth requires client IDs from Google/Facebook/GitHub
          </p>
          <GoogleButton fullWidth size="md" disabled={isAuthenticating} />
          <FacebookButton fullWidth size="md" disabled={isAuthenticating} />
          <GitHubButton fullWidth size="md" disabled={isAuthenticating} />
        </div>
      )}

      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          ✨ Email auth works without any external setup!
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// Dashboard (Authenticated View)
// ============================================================================

const Dashboard: React.FC = () => {
  const user = useUser();
  const { accessToken, signOut } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid var(--border)',
    }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <UserAvatar size={80} />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '16px' }}>
          Welcome, {user.name || 'User'}!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          You are signed in with {user.provider}
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
          User Information
        </h3>
        <UserInfoRow label="Email" value={user.email} />
        <UserInfoRow label="Name" value={user.name || 'N/A'} />
        <UserInfoRow label="Provider" value={user.provider} highlight />
        <UserInfoRow label="Provider ID" value={user.providerId} />
        {user.expiresAt && (
          <UserInfoRow 
            label="Session Expires" 
            value={new Date(user.expiresAt).toLocaleString()} 
          />
        )}
      </div>

      {accessToken && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Access Token
          </h3>
          <code style={{
            display: 'block',
            fontSize: '12px',
            color: 'var(--accent-pink)',
            wordBreak: 'break-all',
          }}>
            {accessToken}
          </code>
        </div>
      )}

      <button
        onClick={signOut}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--error)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

const UserInfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{label}</span>
    <span style={{ 
      fontSize: '13px', 
      color: highlight ? 'var(--accent)' : 'var(--text-primary)',
      textTransform: highlight ? 'capitalize' : 'none',
    }}>
      {value}
    </span>
  </div>
);

// ============================================================================
// Log Level Selector
// ============================================================================

const LogLevelSelector: React.FC = () => {
  const [level, setLevel] = useState<LogLevel>('info');
  const logs = logger.getLogs();

  const handleChange = (newLevel: LogLevel) => {
    setLevel(newLevel);
    logger.setLevel(newLevel);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid var(--border)',
      width: '280px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--accent)' }}>
        🔧 Log Level
      </h3>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {(['debug', 'info', 'warn', 'error', 'none'] as LogLevel[]).map((l) => (
          <button
            key={l}
            onClick={() => handleChange(l)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: level === l ? 'var(--accent)' : 'var(--bg-secondary)',
              color: level === l ? 'white' : 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
        Logs: {logs.length} entries (check console)
      </div>
      <button
        onClick={() => logger.clearLogs()}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          fontSize: '11px',
          cursor: 'pointer',
        }}
      >
        Clear Logs
      </button>
    </div>
  );
};

// ============================================================================
// Mock Auth Callback Handler
// ============================================================================

const MockAuthHandler: React.FC = () => {
  // This simulates OAuth callback for demo purposes
  React.useEffect(() => {
    // Listen for simulated auth success
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button?.textContent?.includes('Google')) {
        simulateAuth('google');
      } else if (button?.textContent?.includes('Facebook')) {
        simulateAuth('facebook');
      } else if (button?.textContent?.includes('GitHub')) {
        simulateAuth('github');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

function simulateAuth(provider: 'google' | 'facebook' | 'github') {
  // Simulate popup delay
  setTimeout(() => {
    const mockUsers = {
      google: {
        id: 'google_12345',
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://ui-avatars.com/api/?name=John+Doe&background=4285F4&color=fff',
      },
      facebook: {
        id: 'fb_67890',
        email: 'user@facebook.com',
        name: 'Jane Smith',
        picture: 'https://ui-avatars.com/api/?name=Jane+Smith&background=1877f2&color=fff',
      },
      github: {
        id: 'gh_11111',
        email: 'dev@github.com',
        name: 'Dev User',
        login: 'devuser',
        avatar_url: 'https://ui-avatars.com/api/?name=Dev+User&background=24292f&color=fff',
      },
    };

    const user = mockUsers[provider];
    
    window.postMessage({
      type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
      user,
    }, '*');
  }, 1000);
}

// ============================================================================
// Main App Content
// ============================================================================

const AppContent: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <GuestGuard fallback={<Dashboard />}>
          <LoginCard />
        </GuestGuard>
      </main>
      <LogLevelSelector />
      <MockAuthHandler />
    </div>
  );
};

// ============================================================================
// App with Provider
// ============================================================================

export const App: React.FC = () => {
  return (
    <AuthProvider
      config={{
        // Demo OAuth credentials (not real)
        google: { clientId: 'demo-google-client-id' },
        facebook: { appId: 'demo-facebook-app-id' },
        github: { clientId: 'demo-github-client-id' },
        logLevel: 'info',
        persist: true,
        onSuccess: (user: AuthUser) => {
          console.log('✅ Auth success callback:', user);
        },
        onError: (error: AuthError) => {
          console.error('❌ Auth error callback:', error);
        },
        onLogout: () => {
          console.log('👋 User logged out');
        },
      }}
    >
      <AppContent />
    </AuthProvider>
  );
};
