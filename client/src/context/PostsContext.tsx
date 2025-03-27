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

  console.log("PostsProvider initialized with user:", user);

  // Load posts from localStorage on mount
  useEffect(() => {
    const loadPosts = () => {
      console.log("Loading posts from localStorage");
      setLoading(true);
      try {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          console.log(`Found ${parsedPosts.length} posts in localStorage`);
          setPosts(parsedPosts);
        } else {
          console.log("No posts found in localStorage");
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
    console.log(`Saving ${posts.length} posts to localStorage`);
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const createPost = (
    content: string,
    gameTitle?: string,
    imageUrl?: string
  ) => {
    console.log("Creating post with:", { content, gameTitle, imageUrl });
    
    if (!user) {
      console.error("Cannot create post: No user logged in");
      return;
    }

    console.log("Current user creating post:", user);

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
        imageUrl: 'https://via.placeholder.com/60' // Default placeholder
      } : undefined,
      imageUrl,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      liked: false
    };

    console.log("Created new post with ID:", newPost.id);
    
    // Add the new post to the beginning of the posts array
    const updatedPosts = [newPost, ...posts];
    console.log(`Updating posts array. New length: ${updatedPosts.length}`);
    
    setPosts(updatedPosts);
    console.log("Posts state updated successfully");
  };

  const likePost = (postId: string) => {
    console.log(`Toggling like for post with ID: ${postId}`);
    
    if (!user) {
      console.log("Cannot like post: No user logged in");
      return;
    }
    
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          const wasLiked = post.liked || false;
          const newLikeCount = wasLiked ? post.likes - 1 : post.likes + 1;
          
          console.log(`Post ${postId} like state: ${wasLiked} → ${!wasLiked}, likes: ${post.likes} → ${newLikeCount}`);
          
          return {
            ...post,
            likes: newLikeCount,
            liked: !wasLiked
          };
        }
        return post;
      });
      
      return updatedPosts;
    });
    
    console.log("Posts updated after like action");
  };

  console.log(`Rendering PostsProvider with ${posts.length} posts, loading: ${loading}`);

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