import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // This would normally be a fetch or GraphQL call to your backend
        try {
            // Mocking a successful login for frontend development
            // Your backend team will integrate this with the actual API

            // Simulate API call
            setTimeout(() => {
                // Mock token - this would come from your backend API
                const mockToken =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE5MTYyMzkwMjJ9.oB3MmYKw8e1VR6Uwt-9q0LVwuWU-c842s9gqGN-G_FU";

                // Store the token
                login(mockToken);

                // Redirect to home page
                navigate("/");

                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password. Please try again.");
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <CardHeader>
                    <CardTitle>Login to GamerVerse</CardTitle>
                    <CardSubtitle>Welcome back, gamer!</CardSubtitle>
                </CardHeader>

                <LoginForm onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <FormGroup>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormInput
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormInput
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Your password"
                        />
                    </FormGroup>

                    <ForgotPassword to="/forgot-password">
                        Forgot password?
                    </ForgotPassword>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </SubmitButton>
                </LoginForm>

                <SignupPrompt>
                    Don't have an account? <SignupLink to="/signup">Sign up</SignupLink>
                </SignupPrompt>
            </LoginCard>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: ${({ theme }) => theme.spacing.md};
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  width: 100%;
  max-width: 450px;
  padding: ${({ theme }) => theme.spacing.xl};
  animation: fadeIn 0.3s ease-in;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transition};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
    outline: none;
  }
`;

const ForgotPassword = styled(Link)`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => `${theme.colors.error}30`};
`;

export default Login;
