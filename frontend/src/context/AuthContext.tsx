import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginDto } from '../types';
import { authService } from '../services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginDto: LoginDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const initializeAuth = async () => {
      try {
        const token = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        // Check if token is expired before attempting to use it
        if (authService.isTokenExpired()) {
          console.log('Token expired on app load, clearing auth state');
          authService.logout();
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (storedUser && token) {
          // Verify the token is still valid by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token is invalid or server rejected it, clear storage
            console.log('Token validation failed, clearing auth state');
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up periodic token expiry check (every minute)
    const expiryCheckInterval = setInterval(() => {
      if (authService.isTokenExpired()) {
        console.log('Token expired during session, logging out');
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(expiryCheckInterval);
  }, []);

  const login = async (loginDto: LoginDto): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(loginDto);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};