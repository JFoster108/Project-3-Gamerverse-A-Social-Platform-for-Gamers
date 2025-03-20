import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define User type
interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    favoriteGames?: string[];
    friendCodes?: {
        nintendo?: string;
        playstation?: string;
        xbox?: string;
        steam?: string;
    };
    isPublic: boolean;
}

// Define AuthContext state
interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    clearError: () => { },
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is logged in on page load
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // In a real app, you'd verify the token with your backend
                    // const response = await fetch('/api/auth/me', {
                    //   headers: {
                    //     'Authorization': `Bearer ${token}`
                    //   }
                    // });
                    // const data = await response.json();
                    // setUser(data.user);

                    // For now, we'll simulate loading a user
                    setIsAuthenticated(true);
                    setIsLoading(false);
                } catch (err) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    setError('Session expired, please log in again');
                }
            } else {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // In a real app, you'd make an API call to your backend
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();

            // Simulate a successful login
            const mockResponse = {
                user: {
                    id: '123',
                    username: 'testuser',
                    email: email,
                    isPublic: true
                },
                token: 'mock-jwt-token'
            };

            setUser(mockResponse.user);
            setToken(mockResponse.token);
            setIsAuthenticated(true);
            localStorage.setItem('token', mockResponse.token);
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // In a real app, you'd make an API call to your backend
            // const response = await fetch('/api/auth/register', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({ username, email, password })
            // });
            // const data = await response.json();

            // Simulate a successful registration
            const mockResponse = {
                user: {
                    id: '123',
                    username: username,
                    email: email,
                    isPublic: true
                },
                token: 'mock-jwt-token'
            };

            setUser(mockResponse.user);
            setToken(mockResponse.token);
            setIsAuthenticated(true);
            localStorage.setItem('token', mockResponse.token);
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                error,
                login,
                register,
                logout,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;