import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { darkTheme, lightTheme } from './assets/themes/themes';
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

function App() {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Router>
          <Header toggleTheme={toggleTheme} currentTheme={theme} />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:username" element={<Profile />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;