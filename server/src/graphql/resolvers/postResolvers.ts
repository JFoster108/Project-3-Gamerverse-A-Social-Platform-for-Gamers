import Post from "../../models/Post";

const postResolvers = {
  Query: {
    getAllPosts: async () => await Post.find({ status: "active" }),
    getPostById: async (_: any, { id }: any) => await Post.findById(id),
    myPosts: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return await Post.find({ user_id: context.user.id });
    },
  },

  Mutation: {
    createPost: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const newPost = new Post({ user_id: context.user.id, ...input });
      await newPost.save();
      return newPost;
    },

    deletePost: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      await Post.findByIdAndDelete(id);
      return "Post deleted successfully";
    },

    likePost: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found");
      post.likes.push(context.user.id);
      await post.save();
      return post;
    },

    unlikePost: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found");
      post.likes = post.likes.filter((userId) => userId.toString() !== context.user.id);
      await post.save();
      return post;
    },
  },
};

export default postResolvers;
