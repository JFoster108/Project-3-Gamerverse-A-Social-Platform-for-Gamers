import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './themes';

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.3s ease;
    line-height: 1.6;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  .container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

  .section {
    margin: ${({ theme }) => theme.spacing.xl} 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  input, textarea, select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    transition: ${({ theme }) => theme.transition};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .container {
      padding: 0 ${({ theme }) => theme.spacing.sm};
    }
    
    h1 {
      font-size: ${({ theme }) => theme.fontSizes.xlarge};
    }
    
    h2 {
      font-size: ${({ theme }) => theme.fontSizes.large};
    }
    
    h3 {
      font-size: ${({ theme }) => theme.fontSizes.medium};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  /* Grid system */
  .grid {
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
    
    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  /* Helper classes */
  .text-center {
    text-align: center;
  }

  .mb-1 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .mb-2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .mb-3 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  .mb-4 {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }

  .mt-1 {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }

  .mt-2 {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  .mt-3 {
    margin-top: ${({ theme }) => theme.spacing.lg};
  }

  .mt-4 {
    margin-top: ${({ theme }) => theme.spacing.xl};
  }
`;