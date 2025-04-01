import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    joinedDate?: string;
    friendCodes?: {
        nintendo?: string;
        playstation?: string;
        xbox?: string;
        steam?: string;
    };
    isAdmin?: boolean;  // Add isAdmin property to the User interface
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    signup: (username: string, email: string, password: string) => Promise<string>;
    updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const loadUser = () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<User & { exp: number; isAdmin: boolean }>(storedToken);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                        setIsAuthenticated(false);
                        return;
                    }

                    setToken(storedToken);
                    setIsAuthenticated(true);
                    setUser({
                        id: decodedToken.id,
                        username: decodedToken.username,
                        email: decodedToken.email,
                        isAdmin: decodedToken.isAdmin,  // Ensure isAdmin is decoded
                    });
                } catch (error) {
                    console.error('Invalid token:', error);
                    logout();
                }
            }
        };

        loadUser();
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        try {
            const decodedToken = jwtDecode<User & { exp: number; isAdmin: boolean }>(newToken);
            setToken(newToken);
            setUser({
                id: decodedToken.id,
                username: decodedToken.username,
                email: decodedToken.email,
                isAdmin: decodedToken.isAdmin, // Ensure isAdmin is set
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

    const signup = async (username: string, email: string, password: string): Promise<string> => {
        const userId = uuidv4();
        const newUser: User = {
            id: userId,
            username,
            email,
            joinedDate: new Date().toISOString(),
            avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
            isAdmin: false,  // Set to false for regular users
        };

        // Simulated token
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
            JSON.stringify({ id: userId, username, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, isAdmin: false })
        )}.DUMMY_SIGNATURE`;

        return mockToken;
    };

    const updateProfile = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, signup, updateProfile }}>
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

export default AuthProvider;
