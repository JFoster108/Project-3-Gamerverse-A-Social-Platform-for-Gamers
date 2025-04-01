// src/utils/localStorage.ts

// Define interfaces to match your user structure
interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  joinedDate?: string;
  friendCodes?: {
    nintendo?: string;
    playstation?: string;
    xbox?: string;
    steam?: string;
  };
  stats?: {
    posts?: number;
    games?: number;
    completed?: number;
  };
}

// Utility to get a user with image from localStorage
export const getUserWithImage = (userId: string): User | null => {
  try {
    const usersString = localStorage.getItem('users');
    const users: User[] = usersString ? JSON.parse(usersString) : [];
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

// Utility to get current user with image from localStorage
export const getCurrentUserWithImage = (): User | null => {
  try {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error retrieving current user:', error);
    return null;
  }
};

// Utility to save users to localStorage
export const saveUsersToLocalStorage = (users: User[]) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Utility to save current user to localStorage
export const saveCurrentUserToLocalStorage = (user: User) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// Utility to update a specific user
export const updateUser = (userId: string, updatedUserData: Partial<User>) => {
  try {
    const usersString = localStorage.getItem('users');
    let users: User[] = usersString ? JSON.parse(usersString) : [];
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updatedUserData } : user
    );
    
    saveUsersToLocalStorage(updatedUsers);
    
    // If updating current user, update current user in localStorage
    const currentUser = getCurrentUserWithImage();
    if (currentUser?.id === userId) {
      saveCurrentUserToLocalStorage({ ...currentUser, ...updatedUserData });
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Utility to remove a user from localStorage
export const removeUser = (userId: string) => {
  try {
    const usersString = localStorage.getItem('users');
    let users: User[] = usersString ? JSON.parse(usersString) : [];
    
    const filteredUsers = users.filter(user => user.id !== userId);
    
    saveUsersToLocalStorage(filteredUsers);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};