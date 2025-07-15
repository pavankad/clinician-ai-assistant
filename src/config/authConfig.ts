// Simple Authentication configuration
export const authConfig = {
  // Demo credentials - replace with secure authentication in production
  validCredentials: {
    username: 'admin',
    password: 'admin'
  }
};

// Token storage helpers
export const tokenStorage = {
  setTokens: (accessToken: string, user: any) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('user_profile', JSON.stringify(user));
  },
  getAccessToken: () => sessionStorage.getItem('access_token'),
  clearTokens: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_profile');
  },
  getUserProfile: () => {
    const profile = sessionStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  },
};

// Generate a simple demo token
export const generateDemoToken = (username: string): string => {
  const payload = {
    username,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
  };
  return btoa(JSON.stringify(payload));
};

// Validate demo token
export const validateDemoToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};
