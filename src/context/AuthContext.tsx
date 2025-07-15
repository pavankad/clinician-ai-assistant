import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  authConfig,
  tokenStorage, 
  generateDemoToken,
  validateDemoToken
} from '../config/authConfig';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = tokenStorage.getAccessToken();
        const storedProfile = tokenStorage.getUserProfile();

        if (storedToken && storedProfile) {
          // Verify token is still valid
          const isValid = validateDemoToken(storedToken);
          
          if (isValid) {
            setAccessToken(storedToken);
            setUser(storedProfile);
          } else {
            // Token is invalid, clear storage
            tokenStorage.clearTokens();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Simple credential-based login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate credentials
      if (
        credentials.username === authConfig.validCredentials.username &&
        credentials.password === authConfig.validCredentials.password
      ) {
        // Generate demo token
        const token = generateDemoToken(credentials.username);
        
        // Create user profile
        const userProfile: User = {
          id: 'admin-001',
          email: 'admin@clinic.example.com',
          name: 'Administrator',
          username: credentials.username,
          role: 'admin',
        };

        // Store tokens and user profile
        tokenStorage.setTokens(token, userProfile);

        setAccessToken(token);
        setUser(userProfile);
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setError(null);
    tokenStorage.clearTokens();
  };

  const isAuthenticated = !!user && !!accessToken;

  const value: AuthContextType = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
  }), [user, accessToken, isAuthenticated, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
