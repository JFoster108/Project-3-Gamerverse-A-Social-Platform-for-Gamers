import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';

interface Game {
  id: string;
  title: string;
  imageUrl: string;
}

interface Author {
  id: string;
  username: string;
  avatarUrl: string;
}

interface PostProps {
  post: {
    id: string;
    author: Author;
    content: string;
    imageUrl?: string;
    game?: Game;
    likes: number;
    comments: number;
    createdAt: string;
    liked?: boolean;
  };
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const { id, author, content, imageUrl, game, likes, comments, createdAt, liked } = post;
  const { likePost } = usePosts();
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleLike = () => {
    likePost(id);
  };

  return (
    <Card>
      <CardHeader>
        <UserInfo>
          <UserAvatar src={author.avatarUrl} alt={author.username} />
          <UserDetails>
            <Username to={`/profile/${author.username}`}>{author.username}</Username>
            <PostDate>{formattedDate}</PostDate>
          </UserDetails>
        </UserInfo>
        {game && (
          <GameTag>
            <GameImage src={game.imageUrl} alt={game.title} />
            <GameTitle>{game.title}</GameTitle>
          </GameTag>
        )}
      </CardHeader>
      
      <CardContent>
        <PostText>{content}</PostText>
        {imageUrl && <PostImage src={imageUrl} alt="Post content" />}
      </CardContent>
      
      <CardFooter>
        <ActionButton liked={liked} onClick={handleLike}>
          <span>👍</span> {likes}
        </ActionButton>
        <ActionButton>
          <span>💬</span> {comments}
        </ActionButton>
      </CardFooter>
    </Card>
  );
};

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const PostDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GameTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const GameImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const GameTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const PostText = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const CardFooter = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.md};
`;

interface ActionButtonProps {
  liked?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  color: ${({ theme, liked }) => liked ? theme.colors.primary : theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
  
  span {
    font-size: 18px;
  }
`;

export default PostCard;