// src/App.tsx
// Fix the theme type error by ensuring proper typing for the ThemeProvider

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import AuthProvider from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { darkTheme, lightTheme, ThemeType } from './assets/themes/themes';
import { GlobalStyles } from './assets/themes/GlobalStyles';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/NotFound';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';

// Admin Components
import AdminRoutes from './components/admin/AdminRoutes';

// Game Library
import GameLibrary from './components/GameLibrary/GameLibrary';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Select theme based on state
  const themeObject: ThemeType = theme === 'light' ? lightTheme : darkTheme;

  return (
    <AuthProvider>
      <PostsProvider>
        <ThemeProvider theme={themeObject}>
          <GlobalStyles />
          <Router>
            <AppContainer>
              <Header toggleTheme={toggleTheme} currentTheme={theme} />
              <MainContent>
                <ContentContainer>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/request-password-reset" element={<RequestPasswordReset />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route 
                      path="/profile/edit" 
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/create-post" 
                      element={
                        <ProtectedRoute>
                          <CreatePost />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/game-library" 
                      element={
                        <ProtectedRoute>
                          <GameLibrary />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute>
                          <AdminRoutes />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ContentContainer>
              </MainContent>
              <Footer />
            </AppContainer>
          </Router>
        </ThemeProvider>
      </PostsProvider>
    </AuthProvider>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export default App;