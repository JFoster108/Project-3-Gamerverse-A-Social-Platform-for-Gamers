import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection>
                    <FooterLogo>
                        <span>Gamer</span>
                        <span>Verse</span>
                    </FooterLogo>
                    <FooterTagline>Connect. Play. Share.</FooterTagline>
                </FooterSection>

                <FooterSection>
                    <FooterTitle>Navigation</FooterTitle>
                    <FooterLinks>
                        <FooterLink to="/">Home</FooterLink>
                        <FooterLink to="/login">Login</FooterLink>
                        <FooterLink to="/signup">Sign Up</FooterLink>
                    </FooterLinks>
                </FooterSection>

                <FooterSection>
                    <FooterTitle>Legal</FooterTitle>
                    <FooterLinks>
                        <FooterLink to="/terms">Terms of Service</FooterLink>
                        <FooterLink to="/privacy">Privacy Policy</FooterLink>
                    </FooterLinks>
                </FooterSection>
            </FooterContent>

            <FooterBottom>
                <FooterCopyright>
                    © {currentYear} GamerVerse. All rights reserved.
                </FooterCopyright>
            </FooterBottom>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.navBackground};
  color: ${({ theme }) => theme.colors.navText};
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;
const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLogo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 700;
  display: flex;
  gap: 5px;

  span:first-child {
    color: ${({ theme }) => theme.colors.primary};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FooterTagline = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  opacity: 0.8;
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.navText};
  opacity: 0.8;
  text-decoration: none;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

const FooterCopyright = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  opacity: 0.7;
`;

export default Footer;
