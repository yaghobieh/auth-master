import React, { useState } from 'react';
import { Button, Input, Alert, Typography, Link } from '@forgedevstack/bear';
import { useAuth } from '../hooks/useAuth';

interface EmailFormProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
  className?: string;
}

interface EmailLoginFormProps {
  onSuccess?: () => void;
  onToggleMode?: () => void;
  showToggle?: boolean;
  className?: string;
}

/**
 * Combined email sign in/sign up form with mode toggle.
 * No OAuth required - works completely standalone!
 * Uses Bear theme colors via BearProvider.
 */
export const EmailForm: React.FC<EmailFormProps> = ({
  mode: initialMode = 'signin',
  onSuccess,
  className = '',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signInWithEmail, signUpWithEmail, isAuthenticating, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = mode === 'signup'
      ? await signUpWithEmail({ email, password, name })
      : await signInWithEmail({ email, password });
    if (result && onSuccess) onSuccess();
  };

  const toggleMode = () => setMode(mode === 'signin' ? 'signup' : 'signin');

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      {error && <Alert severity="error">{error.message}</Alert>}

      {mode === 'signup' && (
        <div>
          <Typography variant="body2" className="mb-1.5 font-medium">Name</Typography>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            fullWidth
          />
        </div>
      )}

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Email</Typography>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
        />
      </div>

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Password</Typography>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={isAuthenticating}>
        {mode === 'signup' ? 'Create Account' : 'Sign In'}
      </Button>

      <Typography variant="body2" className="text-center" color="muted">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <Link onClick={toggleMode} className="cursor-pointer">
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </Link>
      </Typography>
    </form>
  );
};

/**
 * Simple email sign in form
 */
export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  onSuccess,
  onToggleMode,
  showToggle = true,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, isAuthenticating, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signInWithEmail({ email, password });
    if (result && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      {error && <Alert severity="error">{error.message}</Alert>}

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Email</Typography>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
        />
      </div>

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Password</Typography>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={isAuthenticating}>
        Sign In
      </Button>

      {showToggle && onToggleMode && (
        <Typography variant="body2" className="text-center" color="muted">
          Don't have an account?{' '}
          <Link onClick={onToggleMode} className="cursor-pointer">
            Sign up
          </Link>
        </Typography>
      )}
    </form>
  );
};

/**
 * Simple email sign up form
 */
export const EmailSignupForm: React.FC<EmailLoginFormProps> = ({
  onSuccess,
  onToggleMode,
  showToggle = true,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUpWithEmail, isAuthenticating, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signUpWithEmail({ email, password, name });
    if (result && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      {error && <Alert severity="error">{error.message}</Alert>}

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Name</Typography>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          fullWidth
        />
      </div>

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Email</Typography>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
        />
      </div>

      <div>
        <Typography variant="body2" className="mb-1.5 font-medium">Password</Typography>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={isAuthenticating}>
        Create Account
      </Button>

      {showToggle && onToggleMode && (
        <Typography variant="body2" className="text-center" color="muted">
          Already have an account?{' '}
          <Link onClick={onToggleMode} className="cursor-pointer">
            Sign in
          </Link>
        </Typography>
      )}
    </form>
  );
};
