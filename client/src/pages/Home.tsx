import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PostCard from "../components/posts/PostCard";
import FilterBar from "../components/feed/FilterBar";

// This will be replaced with actual data from the backend
import { mockPosts } from "../utils/mockData";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    // This would be a fetch/GraphQL call to get posts from the backend
    const fetchPosts = () => {
      setLoading(true);

      // Simulating API call with a delay
      setTimeout(() => {
        setPosts(mockPosts);
        setLoading(false);
        setHasMore(false); // For mock data, we'll pretend there's no more data
      }, 800);
    };

    fetchPosts();
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLoading(true);

    // Simulate API call for filtered data
    setTimeout(() => {
      // In a real app, we would fetch filtered data from the backend
      if (filter === "all") {
        setPosts(mockPosts);
      } else {
        // Filter posts based on game console or category
        // This is just for demo purposes
        setPosts(
          mockPosts.filter((post) =>
            post.game?.title.toLowerCase().includes(filter.toLowerCase())
          )
        );
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

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to GamerVerse</HeroTitle>
          <HeroSubtitle>
            Connect with gamers. Share your experiences.
          </HeroSubtitle>
          <CreatePostButton to="/create-post">Create Post</CreatePostButton>
        </HeroContent>
      </HeroSection>

      <FeedSection>
        <FeedHeader>
          <FeedTitle>Game Feed</FeedTitle>
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </FeedHeader>

        {loading ? (
          <LoadingMessage>Loading posts...</LoadingMessage>
        ) : posts.length === 0 ? (
          <EmptyStateMessage>
            No posts found. Be the first to{" "}
            <Link to="/create-post">create a post</Link>!
          </EmptyStateMessage>
        ) : (
          <>
            <PostGrid>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </PostGrid>

            {hasMore && (
              <LoadMoreButton onClick={loadMorePosts}>Load More</LoadMoreButton>
            )}
          </>
        )}
      </FeedSection>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
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
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
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

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
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

export default Home;
