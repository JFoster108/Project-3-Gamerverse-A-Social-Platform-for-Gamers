export const mockPosts = [
  {
    id: "1",
    author: {
      id: "user1",
      username: "gamer123",
      avatarUrl: "https://via.placeholder.com/50",
    },
    content: "Just finished Zelda: Tears of the Kingdom. What an amazing game!",
    imageUrl: "https://via.placeholder.com/500x300",
    game: {
      id: "game1",
      title: "The Legend of Zelda: Tears of the Kingdom",
      imageUrl: "https://via.placeholder.com/100",
    },
    likes: 42,
    comments: 8,
    createdAt: "2023-05-15T12:00:00Z",
    liked: false,
  },
  {
    id: "2",
    author: {
      id: "user2",
      username: "nintendofan",
      avatarUrl: "https://via.placeholder.com/50",
    },
    content:
      "Who else is excited for the new Mario game? The trailer looks incredible!",
    game: {
      id: "game2",
      title: "Super Mario Bros. Wonder",
      imageUrl: "https://via.placeholder.com/100",
    },
    likes: 28,
    comments: 12,
    createdAt: "2023-05-14T15:30:00Z",
    liked: true,
  },
  {
    id: "3",
    author: {
      id: "user3",
      username: "playstation5lover",
      avatarUrl: "https://via.placeholder.com/50",
    },
    content: "Just got my hands on the PS5! Any game recommendations?",
    imageUrl: "https://via.placeholder.com/500x300",
    likes: 35,
    comments: 22,
    createdAt: "2023-05-13T09:15:00Z",
    liked: false,
  },
];