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

// Profile image handling
const saveProfileImage = (userId: string, imageData: string): void => {
    try {
        localStorage.setItem(`profile_image_${userId}`, imageData);
    } catch (error) {
        console.error('Error saving profile image to localStorage:', error);
        // If storage fails (e.g., quota exceeded), continue with default avatar
    }
};

const getProfileImage = (userId: string): string | null => {
    return localStorage.getItem(`profile_image_${userId}`);
};

// Local storage helpers
const saveUser = (user: User): void => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUserIndex = users.findIndex((u: User) => u.id === user.id);
    
    // Check if avatarUrl is a base64 image and store separately
    if (user.avatarUrl && user.avatarUrl.startsWith('data:image')) {
        saveProfileImage(user.id, user.avatarUrl);
        // Replace with reference in user object
        user = {
            ...user,
            avatarUrl: `profile_image_ref_${user.id}`
        };
    }
    
    if (existingUserIndex >= 0) {
        // Update existing user
        users[existingUserIndex] = user;
    } else {
        // Add new user
        users.push(user);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
};

const getUserById = (userId: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: User) => user.id === userId);
    
    if (!user) return null;
    
    // Check if avatarUrl is a reference to stored image
    if (user.avatarUrl && user.avatarUrl.startsWith('profile_image_ref_')) {
        const profileImage = getProfileImage(userId);
        if (profileImage) {
            // Return a new object with the resolved image
            return {
                ...user,
                avatarUrl: profileImage
            };
        }
    }
    
    return user;
};

const getUserByEmail = (email: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((user: User) => user.email === email) || null;
};

// Initialize localStorage if needed
const initializeLocalStorage = () => {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('posts')) {
        localStorage.setItem('posts', JSON.stringify([]));
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Initialize localStorage
    useEffect(() => {
        initializeLocalStorage();
    }, []);

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

                    // Get the full user object from localStorage if it exists
                    const storedUser = getUserById(decodedToken.id);
                    
                    if (storedUser) {
                        setUser(storedUser);
                    } else {
                        // If user doesn't exist in localStorage, create with basic info
                        const newUser: User = {
                            id: decodedToken.id,
                            username: decodedToken.username,
                            email: decodedToken.email,
                            joinedDate: new Date().toISOString(),
                            avatarUrl: `https://ui-avatars.com/api/?name=${decodedToken.username}&background=random`
                        };
                        saveUser(newUser);
                        setUser(newUser);
                    }
                    
                    setToken(storedToken);
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
            
            // Check if user exists in localStorage
            let currentUser = getUserById(decodedToken.id);
            
            if (!currentUser) {
                // Create new user if doesn't exist
                currentUser = {
                    id: decodedToken.id,
                    username: decodedToken.username,
                    email: decodedToken.email,
                    joinedDate: new Date().toISOString(),
                    avatarUrl: `https://ui-avatars.com/api/?name=${decodedToken.username}&background=random`
                };
                saveUser(currentUser);
            }
            
            setToken(newToken);
            setUser(currentUser);
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

    // Simulated signup function for demo purposes
    const signup = async (username: string, email: string, password: string): Promise<string> => {
        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            throw new Error('User with that email already exists');
        }

        // Create a new user
        const userId = uuidv4();
        const newUser: User = {
            id: userId,
            username,
            email,
            joinedDate: new Date().toISOString(),
            avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`
        };
        
        // Save the user to localStorage
        saveUser(newUser);
        
        // Create a mock JWT token
        // In a real app, this would come from the server
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
            JSON.stringify({
                id: userId,
                username,
                email,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 1 week
            })
        )}.DUMMY_SIGNATURE`;
        
        return mockToken;
    };

    const updateProfile = (userData: Partial<User>) => {
        if (!user) return;
        
        // Handle profile image updates
        if (userData.avatarUrl && userData.avatarUrl.startsWith('data:image')) {
            // Save the image data separately
            saveProfileImage(user.id, userData.avatarUrl);
        }
        
        const updatedUser = {
            ...user,
            ...userData
        };
        
        saveUser(updatedUser);
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            isAuthenticated, 
            signup,
            updateProfile
        }}>
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