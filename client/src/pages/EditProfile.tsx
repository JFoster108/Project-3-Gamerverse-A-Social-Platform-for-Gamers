import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatarUrl: "",
    friendCodes: {
      nintendo: "",
      playstation: "",
      xbox: "",
      steam: "",
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        friendCodes: {
          nintendo: user.friendCodes?.nintendo || "",
          playstation: user.friendCodes?.playstation || "",
          xbox: user.friendCodes?.xbox || "",
          steam: user.friendCodes?.steam || "",
        },
      });
    }
  }, [user]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For real implementation, you'd upload to a server/cloud storage
      // For now, we'll use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          avatarUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error("No user logged in");
      return;
    }
    
    try {
      // Update profile using AuthContext
      updateProfile({
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        friendCodes: formData.friendCodes
      });
      
      alert("Profile updated successfully!");
      navigate(`/profile/${formData.username}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <Container>
      <Title>Edit Profile</Title>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Profile Picture</SectionTitle>
          
          <AvatarUploadSection>
            <AvatarPreview src={imagePreview || formData.avatarUrl || "https://via.placeholder.com/150"} alt="Profile Preview" />
            
            <AvatarUploadControls>
              <Label htmlFor="avatarUpload">Choose New Profile Picture</Label>
              <FileInput 
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <FileInputButton htmlFor="avatarUpload">
                Select Image
              </FileInputButton>
              
              <OrText>OR</OrText>
              
              <FormGroup>
                <Label htmlFor="avatarUrl">Image URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </FormGroup>
            </AvatarUploadControls>
          </AvatarUploadSection>
        </Section>

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
            onClick={() => navigate(`/profile/${user?.username || ''}`)}
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

// New styled components for avatar upload
const AvatarUploadSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AvatarPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const AvatarUploadControls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputButton = styled.label`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    opacity: 0.9;
  }
`;

const OrText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

export default EditProfile;