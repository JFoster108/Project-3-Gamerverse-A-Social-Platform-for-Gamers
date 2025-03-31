// File path: client/src/components/profile/AvatarUpload.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface AvatarUploadProps {
  currentAvatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onAvatarChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAvatarChange(e.target.value);
  };

  return (
    <Container>
      <AvatarPreview
        src={preview || currentAvatarUrl || "https://via.placeholder.com/150"}
        alt="Avatar Preview"
      />

      <ControlsContainer>
        <Label htmlFor="avatar-upload">Upload Image</Label>
        <FileInput
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <FileInputButton htmlFor="avatar-upload">Choose File</FileInputButton>

        <Divider>OR</Divider>

        <FormGroup>
          <Label htmlFor="avatar-url">Image URL</Label>
          <Input
            id="avatar-url"
            type="text"
            placeholder="Enter image URL"
            value={currentAvatarUrl}
            onChange={handleUrlChange}
          />
        </FormGroup>
      </ControlsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AvatarPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ControlsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputButton = styled.label`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.textSecondary};

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 42%;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export default AvatarUpload;
