// File path: client/src/components/profile/ProfileAvatar.tsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface ProfileAvatarProps {
  username: string;
  avatarUrl: string;
  isEditable?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  username,
  avatarUrl,
  isEditable = false,
}) => {
  return (
    <Container>
      <Avatar
        src={avatarUrl || "https://via.placeholder.com/150"}
        alt={`${username}'s profile`}
      />

      {isEditable && (
        <EditButton to="/profile/edit" title="Edit profile picture">
          <EditIcon>✏️</EditIcon>
        </EditButton>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const EditButton = styled(Link)`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    text-decoration: none;
  }
`;

const EditIcon = styled.span`
  font-size: 16px;
`;

export default ProfileAvatar;
