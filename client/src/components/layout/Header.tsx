import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <NavContainer>
        <LogoContainer ref={dropdownRef}>
          <Logo onClick={toggleDropdown}>
            <LogoText>
              <span>Gamer</span>
              <span>Verse</span>
              <DropdownIndicator open={dropdownOpen}>▾</DropdownIndicator>
            </LogoText>
          </Logo>
          
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem to="/" onClick={() => setDropdownOpen(false)}>
                Home
              </DropdownItem>
              {isAuthenticated && (
                <>
                  <DropdownItem to="/create-post" onClick={() => setDropdownOpen(false)}>
                    Create Post
                  </DropdownItem>
                  <DropdownItem 
                    to={`/profile/${user?.username}`} 
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem 
                    to="/game-library" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    Game Library
                  </DropdownItem>
                  <DropdownItemButton 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </DropdownItemButton>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <DropdownItem to="/login" onClick={() => setDropdownOpen(false)}>
                    Login
                  </DropdownItem>
                  <DropdownItem to="/signup" onClick={() => setDropdownOpen(false)}>
                    Sign Up
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          )}
        </LogoContainer>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/create-post">Create Post</NavLink>
              <NavLink to={`/profile/${user?.username}`}>My Profile</NavLink>
              <NavLink to="/game-library">Game Library</NavLink>
            </>
          )}
        </NavLinks>

        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {currentTheme === 'light' ? '🌙' : '☀️'}
          </ThemeToggle>

          {isAuthenticated ? (
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <AuthButton as={Link} to="/signup">Sign Up</AuthButton>
            </>
          )}
        </NavActions>
      </NavContainer>
    </HeaderContainer>
  );
};



const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.navBackground};
  padding: ${({ theme }) => theme.spacing.md} 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const LogoContainer = styled.div`
  position: relative;
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  cursor: pointer;
  user-select: none;
`;

const LogoText = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  
  span:first-child {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  span:last-child {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

interface DropdownIndicatorProps {
  open: boolean;
}

const DropdownIndicator = styled.span<DropdownIndicatorProps>`
  margin-left: 4px;
  font-size: 0.6em;
  transition: transform 0.3s ease;
  transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(0)'};
  color: ${({ theme }) => theme.colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.navText};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}20`};
    text-decoration: none;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.large};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

const AuthButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    text-decoration: none;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
    text-decoration: none;
  }
`;

const DropdownItemButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

export default Header;