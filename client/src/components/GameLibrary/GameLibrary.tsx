// src/components/GameLibrary/GameLibrary.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameSearchBar from "./GameSearchBar";
import GameCard from "./GameCard";
import axios from "axios";

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textColor};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.primaryColor : props.theme.buttonBackground};
  color: ${(props) => (props.active ? "white" : props.theme.buttonText)};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active
        ? props.theme.primaryColorDark
        : props.theme.buttonBackgroundHover};
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textColor};
`;

const NoGames = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.textColorSecondary};
`;

const LoadMoreButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  margin: 2rem auto;
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonBackgroundHover};
  }
`;

// Define the game status types
type GameStatus = "playing" | "completed" | "backlog" | "all";

// Game type from RAWG API
interface Game {
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
  status?: GameStatus;
  lastPlayed?: string | null;
}

// User library game
interface LibraryGame {
  gameId: number;
  status: GameStatus;
  lastPlayed: string | null;
}

const GameLibrary: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [userLibrary, setUserLibrary] = useState<LibraryGame[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<GameStatus>("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // RAWG API key - In production, this should be stored in environment variables
  const API_KEY = "your_rawg_api_key"; // Replace with your actual key

  // Fetch games from RAWG API
  const fetchGames = async (query: string, pageNum: number) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: API_KEY,
          search: query,
          page: pageNum,
          page_size: 12,
        },
      });

      if (pageNum === 1) {
        setGames(response.data.results);
      } else {
        setGames((prevGames) => [...prevGames, ...response.data.results]);
      }

      setHasMore(!!response.data.next);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's library - mock data for now
  useEffect(() => {
    // This would normally be an API call to get the user's library
    setUserLibrary([
      { gameId: 3498, status: "completed", lastPlayed: "2023-04-15" },
      { gameId: 4200, status: "playing", lastPlayed: "2023-05-20" },
      { gameId: 5286, status: "backlog", lastPlayed: null },
    ]);
  }, []);

  // Combine games from RAWG with user status
  const combinedGames = games.map((game) => {
    const userGame = userLibrary.find((ug) => ug.gameId === game.id);
    if (userGame) {
      return {
        ...game,
        status: userGame.status,
        lastPlayed: userGame.lastPlayed,
      };
    }
    return game;
  });

  // Filter games based on user selection
  const filteredGames =
    filter === "all"
      ? combinedGames
      : combinedGames.filter((game) => game.status === filter);

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(1);
        fetchGames(searchQuery, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add game to user library
  const addGameToLibrary = (gameId: number, status: GameStatus) => {
    setUserLibrary((prev) => {
      const existing = prev.find((game) => game.gameId === gameId);
      if (existing) {
        return prev.map((game) =>
          game.gameId === gameId
            ? {
                ...game,
                status,
                lastPlayed:
                  status === "playing"
                    ? new Date().toISOString()
                    : game.lastPlayed,
              }
            : game
        );
      } else {
        return [
          ...prev,
          {
            gameId,
            status,
            lastPlayed: status === "playing" ? new Date().toISOString() : null,
          },
        ];
      }
    });

    // In a real app, you would also update this on your backend
  };

  // Load more games
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames(searchQuery, nextPage);
  };

  return (
    <Container>
      <Header>
        <Title>Game Library</Title>
        <GameSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Header>

      <FilterContainer>
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All Games
        </FilterButton>
        <FilterButton
          active={filter === "playing"}
          onClick={() => setFilter("playing")}
        >
          Currently Playing
        </FilterButton>
        <FilterButton
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </FilterButton>
        <FilterButton
          active={filter === "backlog"}
          onClick={() => setFilter("backlog")}
        >
          Backlog
        </FilterButton>
      </FilterContainer>

      {loading && page === 1 ? (
        <LoadingSpinner>Loading games...</LoadingSpinner>
      ) : filteredGames.length > 0 ? (
        <>
          <GamesGrid>
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onStatusChange={(status) => addGameToLibrary(game.id, status)}
              />
            ))}
          </GamesGrid>

          {hasMore && searchQuery && (
            <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More Games"}
            </LoadMoreButton>
          )}
        </>
      ) : (
        <NoGames>
          {searchQuery
            ? "No games found matching your search."
            : filter !== "all"
            ? `No games in the "${filter}" category.`
            : "Try searching for games to add to your library."}
        </NoGames>
      )}
    </Container>
  );
};

export default GameLibrary;
