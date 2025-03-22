import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo>
          <Link to="/">
            <LogoText>
              <span>Gamer</span>
              <span>Verse</span>
            </LogoText>
          </Link>
        </Logo>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/create-post">Create Post</NavLink>
              <NavLink to={`/profile/${user?.username}`}>My Profile</NavLink>
            </>
          )}
        </NavLinks>

        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {currentTheme === "light" ? "🌙" : "☀️"}
          </ThemeToggle>

          {isAuthenticated ? (
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <AuthButton as={Link} to="/signup">
                Sign Up
              </AuthButton>
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
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
`;

const LogoText = styled.div`
  display: flex;
  gap: 5px;

  span:first-child {
    color: ${({ theme }) => theme.colors.primary};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.secondary};
  }
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

export default Header;
