import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: ''
    });

    const { login, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

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
            email: '',
            password: ''
        };

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
        }

        setFormErrors(errors);
        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await login(email, password);
                navigate('/'); // Redirect to home page after successful login
            } catch (err) {
                // Error will be handled by the context
            }
        }
    };

    return (
        <div className="login-form-container">
            <h2>Login to Your Account</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={onSubmit}>
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
                        placeholder="Enter your password"
                        className={formErrors.password ? 'input-error' : ''}
                    />
                    {formErrors.password && <div className="error-text">{formErrors.password}</div>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-button"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="form-footer">
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
};

export default LoginForm;