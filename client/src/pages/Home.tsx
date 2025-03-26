import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import FilterBar from '../components/feed/FilterBar';
import { useAuth } from '../context/AuthContext';

// This will be replaced with actual data from the backend
import { mockPosts } from '../utils/mockData';

interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  imageUrl?: string;
  game?: {
    id: string;
    title: string;
    imageUrl: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  liked?: boolean;
}

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    // Only fetch posts if user is authenticated
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = () => {
    setLoading(true);
    
    // Simulating API call with a delay
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
      setHasMore(false); // For mock data, we'll pretend there's no more data
    }, 800);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLoading(true);
    
    // Simulate API call for filtered data
    setTimeout(() => {
      // In a real app, we would fetch filtered data from the backend
      if (filter === 'all') {
        setPosts(mockPosts);
      } else {
        // Filter posts based on game console or category
        // This is just for demo purposes
        setPosts(mockPosts.filter((post) => 
          post.game?.title.toLowerCase().includes(filter.toLowerCase())
        ));
      }
      setLoading(false);
    }, 500);
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
    
    // In a real app, we would fetch more posts from the backend
    // based on the page number
    
    // For demo, we'll just simulate no more posts after a delay
    setTimeout(() => {
      setHasMore(false);
    }, 500);
  };

  // Show welcome page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <WelcomeContainer>
        <WelcomeCard>
          <WelcomeTitle>Welcome to Gamerverse</WelcomeTitle>
          
          <ButtonContainer>
            <LoginButton to="/login">Login</LoginButton>
            
            <NewHereText>New Here?</NewHereText>
            
            <SignupButton to="/signup">Signup</SignupButton>
          </ButtonContainer>
        </WelcomeCard>
      </WelcomeContainer>
    );
  }

  // Show game feed for authenticated users
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to GamerVerse</HeroTitle>
          <HeroSubtitle>Connect with gamers. Share your experiences.</HeroSubtitle>
          <CreatePostButton to="/create-post">Create Post</CreatePostButton>
        </HeroContent>
      </HeroSection>
      
      <FeedSection>
        <FeedHeader>
          <FeedTitle>Game Feed</FeedTitle>
          <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        </FeedHeader>
        
        {loading ? (
          <LoadingMessage>Loading posts...</LoadingMessage>
        ) : posts.length === 0 ? (
          <EmptyStateMessage>
            No posts found. Be the first to <Link to="/create-post">create a post</Link>!
          </EmptyStateMessage>
        ) : (
          <>
            <PostGrid>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </PostGrid>
            
            {hasMore && (
              <LoadMoreButton onClick={loadMorePosts}>
                Load More
              </LoadMoreButton>
            )}
          </>
        )}
      </FeedSection>
    </HomeContainer>
  );
};

// Existing styled components for the game feed
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary}
  );
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  width: 100%;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  max-width: 700px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const CreatePostButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  text-decoration: none;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }
`;

const FeedSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FeedTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  margin: ${({ theme }) => theme.spacing.lg} auto;
  width: fit-content;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

// New styled components for the welcome page
const WelcomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  width: 100%;
`;

const WelcomeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 4rem;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(90deg, #00F5FF, #9370DB);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding: 2rem 4rem;
  border-radius: 5rem;
  background-color: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #00F5FF, #9370DB);
    border-radius: 5rem;
    z-index: -1;
    opacity: 0.2;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 1.5rem 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const StyledButton = styled(Link)`
  background: linear-gradient(90deg, #9370DB, #00F5FF);
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 0.8rem 3rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }
`;

const LoginButton = styled(StyledButton)`
  background: linear-gradient(90deg, #9370DB, #00F5FF);
`;

const SignupButton = styled(StyledButton)`
  background: linear-gradient(90deg, #9370DB, #00F5FF);
`;

const NewHereText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0.5rem 0;
`;

export default Home;