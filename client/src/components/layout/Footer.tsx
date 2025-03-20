import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Gamerverse</h3>
                        <p>A social platform for gamers to connect, share experiences, and discover new games.</p>
                    </div>

                    <div className="footer-section">
                        <h3>Navigation</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/games">Game Library</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Connect</h3>
                        <div className="social-links">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Gamerverse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;