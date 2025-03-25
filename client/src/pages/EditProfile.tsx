import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "gamer123",
    email: "gamer@example.com",
    bio: "I love playing RPGs and FPS games!",
    avatarUrl: "https://via.placeholder.com/150",
    friendCodes: {
      nintendo: "SW-1234-5678-9012",
      playstation: "gamerlover123",
      xbox: "gamerlover123",
      steam: "gamerlover123",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFriendCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      friendCodes: {
        ...prev.friendCodes,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile data (would connect to backend in real implementation)
    alert("Profile updated successfully!");
    navigate("/profile/gamer123");
  };

  return (
    <Container>
      <Title>Edit Profile</Title>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Basic Information</SectionTitle>

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="bio">Bio</Label>
            <TextArea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Gaming Profiles</SectionTitle>

          <FormGroup>
            <Label htmlFor="nintendo">Nintendo Friend Code</Label>
            <Input
              id="nintendo"
              name="nintendo"
              value={formData.friendCodes.nintendo}
              onChange={handleFriendCodeChange}
              placeholder="e.g. SW-1234-5678-9012"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="playstation">PlayStation Network</Label>
            <Input
              id="playstation"
              name="playstation"
              value={formData.friendCodes.playstation}
              onChange={handleFriendCodeChange}
              placeholder="Your PSN ID"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="xbox">Xbox Gamertag</Label>
            <Input
              id="xbox"
              name="xbox"
              value={formData.friendCodes.xbox}
              onChange={handleFriendCodeChange}
              placeholder="Your Xbox Gamertag"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="steam">Steam Username</Label>
            <Input
              id="steam"
              name="steam"
              value={formData.friendCodes.steam}
              onChange={handleFriendCodeChange}
              placeholder="Your Steam Username"
            />
          </FormGroup>
        </Section>

        <ButtonGroup>
          <CancelButton
            type="button"
            onClick={() => navigate("/profile/gamer123")}
          >
            Cancel
          </CancelButton>
          <SaveButton type="submit">Save Changes</SaveButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export default EditProfile;
