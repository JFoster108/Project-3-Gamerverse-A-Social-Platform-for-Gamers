import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../context/PostsContext";

const CreatePost: React.FC = () => {
  const { createPost } = usePosts();
  const navigate = useNavigate();
  
  const [content, setContent] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setLoading(true);
    
    try {
      // Create the post
      createPost(content, gameTitle || undefined, imageUrl || undefined);
      
      // Navigate back to home
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Create Post</Title>
      <Subtitle>Share your gaming experiences</Subtitle>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>What's on your mind?</Label>
          <TextArea
            placeholder="Write something about your gaming experience..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Add a game (optional)</Label>
          <Input 
            type="text" 
            placeholder="Game title"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Add an image URL (optional)</Label>
          <Input 
            type="text" 
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <HelpText>Enter a URL to an image on the web</HelpText>
        </FormGroup>

        <ButtonContainer>
          <CancelButton type="button" onClick={() => navigate("/")}>
            Cancel
          </CancelButton>
          <Button type="submit" disabled={!content.trim() || loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </ButtonContainer>
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
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const HelpText = styled.small`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export default CreatePost;
