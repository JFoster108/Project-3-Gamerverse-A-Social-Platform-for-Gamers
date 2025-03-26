import { mergeResolvers } from "@graphql-tools/merge";
import authResolvers from "./authResolvers";
import postResolvers from "./postResolvers";
import gameResolvers from "./gameResolvers";

const resolvers = mergeResolvers([authResolvers, postResolvers, gameResolvers]);

export default resolvers;