import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <h1>Gamerverse</h1>
                    </Link>
                </div>

                <nav className="nav-menu">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <ThemeToggle />
                        </li>
                        
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/games">Game Library</Link>
                                </li>
                                <li>
                                    <Link to="/create-post">Create Post</Link>
                                </li>
                                <li className="dropdown">
                                    <button className="dropdown-toggle">
                                        {user?.username || 'Account'}
                                    </button>
                                    <div className="dropdown-menu">
                                        <Link to="/profile">My Profile</Link>
                                        <Link to="/settings">Settings</Link>
                                        <button onClick={handleLogout} className="logout-button">
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;