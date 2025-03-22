import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const loadUser = () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<User & { exp: number }>(storedToken);

                    // Check if token is expired
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                        setIsAuthenticated(false);
                        return;
                    }

                    setToken(storedToken);
                    setUser({
                        id: decodedToken.id,
                        username: decodedToken.username,
                        email: decodedToken.email
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Invalid token:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        };

        loadUser();
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);

        try {
            const decodedToken = jwtDecode<User & { exp: number }>(newToken);
            setToken(newToken);
            setUser({
                id: decodedToken.id,
                username: decodedToken.username,
                email: decodedToken.email
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Invalid token on login:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};