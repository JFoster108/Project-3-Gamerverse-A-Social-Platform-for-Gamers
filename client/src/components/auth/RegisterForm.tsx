import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { register, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearError();
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Clear errors when user types
        if (formErrors[e.target.name as keyof typeof formErrors]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        // Username validation
        if (!username.trim()) {
            errors.username = 'Username is required';
            isValid = false;
        } else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        // Email validation
        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await register(username, email, password);
                navigate('/'); // Redirect to home page after successful registration
            } catch (err) {
                // Error will be handled by the context
            }
        }
    };

    return (
        <div className="register-form-container">
            <h2>Create an Account</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Choose a username"
                        className={formErrors.username ? 'input-error' : ''}
                    />
                    {formErrors.username && <div className="error-text">{formErrors.username}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Enter your email"
                        className={formErrors.email ? 'input-error' : ''}
                    />
                    {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Create a password"
                        className={formErrors.password ? 'input-error' : ''}
                    />
                    {formErrors.password && <div className="error-text">{formErrors.password}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm your password"
                        className={formErrors.confirmPassword ? 'input-error' : ''}
                    />
                    {formErrors.confirmPassword && <div className="error-text">{formErrors.confirmPassword}</div>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-button"
                >
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <div className="form-footer">
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default RegisterForm;