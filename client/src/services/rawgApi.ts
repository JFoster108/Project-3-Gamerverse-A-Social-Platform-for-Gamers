// src/services/rawgApi.ts
import axios from "axios";

// Using our server proxy instead of direct API calls
const BASE_URL = "/api";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  metacritic: number;
  platforms: Array<{
    platform: {
      id: number;
      name: string;
    };
  }>;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export interface SearchGamesResponse {
  count: number;
  results: Game[];
  next: string | null;
  previous: string | null;
}

export const searchGames = async (
  query: string,
  page = 1
): Promise<SearchGamesResponse> => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      search: query,
      page,
      page_size: 12,
    },
  });
  return response.data;
};

export const getGameDetails = async (gameId: number): Promise<Game> => {
  const response = await axios.get(`${BASE_URL}/games/${gameId}`);
  return response.data;
};

export const getPopularGames = async (
  page = 1
): Promise<SearchGamesResponse> => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      ordering: "-rating",
      page,
      page_size: 12,
    },
  });
  return response.data;
};

export const getNewReleases = async (
  page = 1
): Promise<SearchGamesResponse> => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const lastYearDate = lastYear.toISOString().slice(0, 10);

  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      dates: `${lastYearDate},${currentDate}`,
      ordering: "-released",
      page,
      page_size: 12,
    },
  });
  return response.data;
};