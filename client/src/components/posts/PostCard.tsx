import React, { useState } from 'react';
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
  const { id, author, content, imageUrl, game, likes, comments, createdAt, liked: initialLiked } = post;
  const { likePost } = usePosts();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleLike = () => {
    likePost(id);
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this post from ${author.username}: ${content.substring(0, 50)}...`;
    const url = window.location.origin + `/post/${id}`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowShareOptions(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareOptions(false);
    }
  };

  // Error handlers for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Replace with initials
    const element = e.currentTarget;
    const username = author.username;
    const initials = username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    // Apply styling directly
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.backgroundColor = '#4F46E5';
    element.style.color = 'white';
    element.style.fontWeight = 'bold';
    element.style.fontSize = '20px';
    
    // Replace image with initials
    element.outerHTML = `<div class="avatar-fallback">${initials}</div>`;
  };

  // Generate random gradient for cards
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
      'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
      'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
      'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    ];
    // Use post id to get a consistent gradient for the same post
    const index = id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Get background color based on post ID
  const getBackgroundColor = () => {
    const colors = [
      '#252836', // dark blue-gray
      '#2A2D3E', // navy blue
      '#222639', // dark indigo
      '#252A34', // slate blue
      '#242038', // deep purple
      '#1F2833', // charcoal blue
    ];
    const index = id.charCodeAt(1) % colors.length;
    return colors[index];
  };

  return (
    <Card backgroundColor={getBackgroundColor()}>
      <CardAccent gradient={getRandomGradient()} />
      
      <CardHeader gameBadge={game !== undefined}>
        <UserInfo>
          <AvatarContainer>
            <UserAvatar 
              src={author.avatarUrl} 
              alt={author.username} 
              onError={handleAvatarError}
            />
            <StatusDot online={true} />
          </AvatarContainer>
          <UserDetails>
            <Username to={`/profile/${author.id}`}>@{author.username}</Username>
          </UserDetails>
        </UserInfo>
        {game && (
          <GameTag>
            <GameIcon>🎮</GameIcon>
            <GameTitle>{game.title}</GameTitle>
          </GameTag>
        )}
      </CardHeader>
      
      <CardContent hasBadge={!!game}>
        <PostText>{content}</PostText>
        {imageUrl && <PostImage src={imageUrl} alt="Post content" onError={handleImageError} />}
      </CardContent>
      
      <CardFooter>
        <ActionButtons>
          <LikeButton liked={isLiked} onClick={handleLike}>
            <LikeIcon liked={isLiked}>{isLiked ? '❤️' : '🤍'}</LikeIcon> 
            <ActionCount>{likeCount}</ActionCount>
          </LikeButton>
          <CommentButton as={Link} to={`/post/${id}`}>
            <CommentIcon>💬</CommentIcon> 
            <ActionCount>{comments}</ActionCount>
          </CommentButton>
          <ShareButton onClick={handleShare}>
            <ShareIcon>🔗</ShareIcon>
            <ActionText>Share</ActionText>
          </ShareButton>
        </ActionButtons>
        
        <PostDate>🕒 {formattedDate}</PostDate>
      </CardFooter>
      
      {showShareOptions && (
        <ShareOptions>
          <ShareOption onClick={() => shareToSocial('twitter')}>
            <span>🐦</span> Twitter
          </ShareOption>
          <ShareOption onClick={() => shareToSocial('facebook')}>
            <span>📘</span> Facebook
          </ShareOption>
          <ShareOption onClick={() => shareToSocial('copy')}>
            <span>📋</span> Copy Link
          </ShareOption>
        </ShareOptions>
      )}
    </Card>
  );
};

interface CardProps {
  backgroundColor: string;
}

const Card = styled.div<CardProps>`
  background-color: ${props => props.backgroundColor};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
`;

interface CardHeaderProps {
  gameBadge: boolean;
}

const CardHeader = styled.div<CardHeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md || '18px'};
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.gameBadge && `
    &:after {
      content: '';
      position: absolute;
      right: 25px;
      bottom: -8px;
      width: 16px;
      height: 16px;
      background-color: rgba(255, 255, 255, 0.05);
      transform: rotate(45deg);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: -1;
    }
  `}
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm || '12px'};
`;

const AvatarContainer = styled.div`
  position: relative;
`;

interface StatusDotProps {
  online: boolean;
}

const StatusDot = styled.div<StatusDotProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.online ? '#10b981' : '#6b7280'};
  border: 2px solid #1f2029;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary || '#4f46e5'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled(Link)`
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  font-size: 22px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary || '#6366f1'};
    text-decoration: none;
    transform: translateX(3px);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
  }
`;

const GameTag = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(45, 212, 191, 0.3) 100%);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(99, 102, 241, 0.3);
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(45, 212, 191, 0.4) 100%);
  }
`;

const GameIcon = styled.span`
  font-size: 20px;
`;

const GameTitle = styled.span`
  color: #a5b4fc;
  font-weight: 800;
`;

interface CardContentProps {
  hasBadge: boolean;
}

const CardContent = styled.div<CardContentProps>`
  padding: ${({ theme }) => theme.spacing.md || '20px'};
  flex: 1;
  ${props => props.hasBadge && 'padding-top: 24px;'}
  background-color: rgba(255, 255, 255, 0.03);
`;

const PostText = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.md || '20px'};
  line-height: 1.7;
  color: #e2e8f0;
  word-break: break-word;
  font-size: 18px;
  letter-spacing: 0.3px;
  font-weight: 400;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 12px;
  max-height: 400px;
  object-fit: cover;
  transition: all 0.5s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CardFooter = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.md || '16px'};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

interface ActionButtonProps {
  liked?: boolean;
}

const LikeButton = styled.button<ActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ liked }) => liked 
    ? 'linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: ${({ liked }) => liked ? 'white' : '#e2e8f0'};
  font-size: 18px;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    background: ${({ liked }) => liked 
      ? 'linear-gradient(135deg, #ff5c9f 0%, #ff5c77 100%)'
      : 'rgba(255, 255, 255, 0.15)'};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const CommentButton = styled(LikeButton)`
  background: rgba(59, 130, 246, 0.2);
  color: #e2e8f0;
  
  &:hover {
    background: rgba(59, 130, 246, 0.3);
  }
`;

const ShareButton = styled(LikeButton)`
  background: rgba(16, 185, 129, 0.2);
  color: #e2e8f0;
  
  &:hover {
    background: rgba(16, 185, 129, 0.3);
  }
`;

interface IconProps {
  liked?: boolean;
}

const LikeIcon = styled.span<IconProps>`
  font-size: 24px;
  transition: all 0.3s ease;
  
  ${({ liked }) => liked && `
    animation: heartbeat 0.6s ease-in-out;
    
    @keyframes heartbeat {
      0% { transform: scale(1); }
      25% { transform: scale(1.3); }
      50% { transform: scale(1); }
      75% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `}
`;

const CommentIcon = styled.span`
  font-size: 22px;
`;

const ShareIcon = styled.span`
  font-size: 22px;
`;

const ActionCount = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #e2e8f0;
`;

const ActionText = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #e2e8f0;
`;

const PostDate = styled.span`
  font-size: 14px;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 20px;
`;

interface CardAccentProps {
  gradient: string;
}

const CardAccent = styled.div<CardAccentProps>`
  height: 6px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => props.gradient};
`;

const ShareOptions = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: #1f2029;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 8px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ShareOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #e2e8f0;
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.2);
  }
  
  span {
    font-size: 18px;
  }
`;

export default PostCard;