import React from 'react';
import { Avatar, Button, Spinner, Typography } from '@forgedevstack/bear';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  loading?: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
}

interface GuestGuardProps {
  children: React.ReactNode;
  loading?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface UserAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface UserInfoProps {
  showEmail?: boolean;
  showProvider?: boolean;
  className?: string;
}

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Protect content - only show when authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, loading, fallback }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <>{loading ?? <Spinner size="md" />}</>;
  if (!isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
};

/**
 * Protect content - only show when NOT authenticated
 */
export const GuestGuard: React.FC<GuestGuardProps> = ({ children, loading, fallback }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <>{loading ?? <Spinner size="md" />}</>;
  if (isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
};

/**
 * Display user avatar - uses Bear Avatar component
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'md', className = '' }) => {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <Avatar
      src={user.avatar}
      alt={user.name || user.email}
      size={size}
      initials={initials}
      className={className}
    />
  );
};

/**
 * Display user information - uses Bear Typography
 */
export const UserInfo: React.FC<UserInfoProps> = ({
  showEmail = true,
  showProvider = false,
  className = '',
}) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {user.name && (
        <Typography variant="body1" className="font-medium">
          {user.name}
        </Typography>
      )}
      {showEmail && (
        <Typography variant="body2" color="muted">
          {user.email}
        </Typography>
      )}
      {showProvider && (
        <Typography variant="caption" color="muted" className="capitalize">
          via {user.provider}
        </Typography>
      )}
    </div>
  );
};

/**
 * Sign out button - uses Bear Button
 */
export const SignOutButton: React.FC<SignOutButtonProps> = ({
  children = 'Sign Out',
  className = '',
  variant = 'outline',
  size = 'md',
}) => {
  const { signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <Button variant={variant} size={size} onClick={signOut} className={className}>
      {children}
    </Button>
  );
};
