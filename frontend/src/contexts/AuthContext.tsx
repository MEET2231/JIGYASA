import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Organization {
  id: number;
  name: string;
  code: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  organization?: Organization;
}

interface AuthContextType {
  user: User | null;
  organizations: Organization[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, organizationId?: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  fetchOrganizations: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/user/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const fetchOrganizations = async () => {
    if (organizations.length > 0 || isLoadingOrganizations) {
      return;
    }

    try {
      setIsLoadingOrganizations(true);
      const response = await fetch(`${API_URL}/organizations/`);
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      } else {
        console.error('Failed to fetch organizations:', response.status);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.access);
      localStorage.setItem('token', data.access);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, organizationId?: number) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || '',
          organization_id: organizationId || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'User with this email already exists') {
          throw new Error(`User with this email already exists. Please try a different email or use the suggested username: ${data.suggested_username}`);
        }
        throw new Error(data.error || 'Signup failed');
      }

      setUser(data.user);
      setToken(data.access);
      localStorage.setItem('token', data.access);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organizations, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!token,
      fetchOrganizations 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 