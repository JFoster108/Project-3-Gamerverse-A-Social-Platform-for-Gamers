const BASE_URL = "/api";

// Helper function to fetch data with error handling
async function fetchAPI(url: string, options: RequestInit & { params?: Record<string, any> } = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Handle query parameters if they exist
  if (options.params) {
    const queryParams = new URLSearchParams(options.params as any).toString();
    url += `?${queryParams}`;
  }

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: new Headers(headers),
    method: options.method || 'GET' // Default to GET if method not specified
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred while fetching data');
  }

  return response.json();
}

// Interfaces for the types used in the API calls
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

// Function to search games based on query and page number
export const searchGames = async (
  query: string,
  page = 1
): Promise<SearchGamesResponse> => {
  return fetchAPI('/games', {
    params: {
      search: query,
      page,
      page_size: 12,
    }
  });
};

// Function to get detailed information about a specific game
export const getGameDetails = async (gameId: number): Promise<Game> => {
  return fetchAPI(`/games/${gameId}`);
};

// Function to get popular games
export const getPopularGames = async (
  page = 1
): Promise<SearchGamesResponse> => {
  return fetchAPI('/games', {
    params: {
      ordering: "-rating",
      page,
      page_size: 12,
    }
  });
};

// Function to get new releases
export const getNewReleases = async (
  page = 1
): Promise<SearchGamesResponse> => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const lastYearDate = lastYear.toISOString().slice(0, 10);

  return fetchAPI('/games', {
    params: {
      dates: `${lastYearDate},${currentDate}`,
      ordering: "-released",
      page,
      page_size: 12,
    }
  });
};
