import { gql } from "apollo-server-express";

const typeDefs = gql`
  type FriendCodes {
    nintendo: String
    steam: String
    psn: String
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

  type Query {
    me: User
    getAllPosts: [Post]
    getAllGames: [Game]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    updateProfile(avatar: String, bio: String, nsfw_allowed: Boolean): User
    createPost(text: String!, image: String, nsfw: Boolean): Post
  }
`;

export default typeDefs;