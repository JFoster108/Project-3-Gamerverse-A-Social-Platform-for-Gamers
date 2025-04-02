// src/context/PostsContext.tsx
// Create this file if it doesn't exist, or replace the content with this:

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

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

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  createPost: (content: string, gameTitle?: string, imageUrl?: string) => void;
  likePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load posts from localStorage on mount
  useEffect(() => {
    const loadPosts = () => {
      setLoading(true);
      try {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          setPosts(parsedPosts);
        } else {
          // Set some default posts if none exist
          const defaultPosts: Post[] = [
            {
              id: "1",
              author: {
                id: "default-user",
                username: "gamerlover",
                avatarUrl: "https://via.placeholder.com/50"
              },
              content: "Just finished The Legend of Zelda: Tears of the Kingdom. What an amazing game!",
              game: {
                id: "zelda-totk",
                title: "The Legend of Zelda: Tears of the Kingdom",
                imageUrl: "https://via.placeholder.com/150"
              },
              likes: 25,
              comments: 8,
              createdAt: new Date().toISOString()
            },
            {
              id: "2",
              author: {
                id: "default-user-2",
                username: "consolegamer",
                avatarUrl: "https://via.placeholder.com/50"
              },
              content: "Who's excited about the new PlayStation showcase?",
              likes: 13,
              comments: 5,
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          
          setPosts(defaultPosts);
          localStorage.setItem('posts', JSON.stringify(defaultPosts));
        }
      } catch (error) {
        console.error('Error loading posts from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const createPost = (
    content: string,
    gameTitle?: string,
    imageUrl?: string
  ) => {
    if (!user) {
      console.error("Cannot create post: No user logged in");
      return;
    }

    const newPost: Post = {
      id: uuidv4(),
      author: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`
      },
      content,
      game: gameTitle ? {
        id: uuidv4(),
        title: gameTitle,
        imageUrl: 'https://via.placeholder.com/60'
      } : undefined,
      imageUrl,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      liked: false
    };
    
    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const likePost = (postId: string) => {
    if (!user) {
      console.log("Cannot like post: No user logged in");
      return;
    }
    
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          const wasLiked = post.liked || false;
          const newLikeCount = wasLiked ? post.likes - 1 : post.likes + 1;
          
          return {
            ...post,
            likes: newLikeCount,
            liked: !wasLiked
          };
        }
        return post;
      });
    });
  };

  return (
    <PostsContext.Provider value={{ posts, loading, createPost, likePost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};