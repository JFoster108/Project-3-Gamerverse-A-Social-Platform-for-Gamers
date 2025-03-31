import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
        <NotFoundText>
          The page you're looking for doesn't exist or has been moved.
        </NotFoundText>
        <BackButton to="/">Return to Home</BackButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NotFoundSubtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackButton = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    text-decoration: none;
  }
`;

export default NotFound;