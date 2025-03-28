import { gql } from "apollo-server-express";

const typeDefs = gql`
  type FriendCodes {
    nintendo: String
    steam: String
    psn: String
    xbox: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    bio: String
    friend_codes: FriendCodes
    roles: [String]
    warnings: Int
    muted_until: String
    banned: Boolean
    age_verified: Boolean
    is_minor: Boolean
    parental_account: ID
    blocked_users: [ID]
    nsfw_allowed: Boolean
  }

  type Post {
    id: ID!
    user_id: ID!
    text: String!
    image: String
    likes: [ID]
    status: String
    nsfw: Boolean
  }

  type Game {
    id: ID!
    title: String!
    platforms: [String]
    release_date: String
    genre: [String]
    cover_image: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input PostInput {
    text: String!
    image: String
    nsfw: Boolean
  }

  type Query {
    me: User
    getAllPosts: [Post]
    getPostById(id: ID!): Post
    myPosts: [Post]
    getAllGames: [Game]
    searchGames(title: String!): [Game]
    getUserById(id: ID!): User
    # Future: moderation queries, review queries, report queries can be added here
  }

  type Mutation {
    register(input: RegisterInput!): String
    login(email: String!, password: String!): String
    logout: String
    updateProfile(avatar: String, bio: String, nsfw_allowed: Boolean): User
    createPost(input: PostInput!): Post
    deletePost(id: ID!): String
    likePost(id: ID!): Post
    unlikePost(id: ID!): Post
    flagPost(postId: ID!, reason: String!): String
    # Future: submitReport, submitAppeal, moderation actions, createReview can be added here
    approveAppeal(appealId: ID!, resolution: String!): String
  }

  extend type Query {
  getModerationLogs: [ModerationLog]
  getPendingAppeals: [Appeal]
  getReports: [Report]
  getDailyModerationStats: ModerationStats
}

extend type Mutation {
  triggerDailyModerationSummary: String
}

type ModerationLog {
  id: ID!
  moderator_id: ID
  action: String
  user_id: ID
  reason: String
  date: String
}

type Appeal {
  id: ID!
  user_id: ID!
  status: String
  reason: String
  resolution: String
  date: String
  moderator_id: ID
}

type Report {
  id: ID!
  reported_by: ID!
  reported_content_id: ID!
  content_type: String
  reason: String
  status: String
  date: String
}

type ModerationStats {
  countLogs: Int
  countAppeals: Int
  countReports: Int
}
`;

export default typeDefs;
