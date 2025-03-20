import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Import pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import GameLibraryPage from '../pages/GameLibraryPage';
import CreatePostPage from '../pages/CreatePostPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/games" element={<GameLibraryPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
            </Route>

            {/* Home route - accessible to everyone */}
            <Route path="/" element={<HomePage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
};

export default AppRoutes;  // Make sure this default export is here!