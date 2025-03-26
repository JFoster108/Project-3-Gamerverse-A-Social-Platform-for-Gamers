import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";

export const createContext = ({ req, res }: any) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);
      return { user, req, res };
    } catch {
      throw new AuthenticationError("Invalid or expired token. Please log in again.");
    }
  }
  return { req, res };
};