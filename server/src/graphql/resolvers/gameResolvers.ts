import Game from "../../models/Game";

const gameResolvers = {
  Query: {
    getAllGames: async () => await Game.find(),
    searchGames: async (_: any, { title }: any) => {
      return await Game.find({ title: { $regex: title, $options: "i" } });
    },
  },
};

export default gameResolvers;
