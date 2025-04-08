// src/components/GameLibrary/GameLibrary.tsx
// Fix the issues with missing theme properties

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameSearchBar from "./GameSearchBar";
import GameCard from "./GameCard";
import { 
  searchGames, 
  getPopularGames, 
  getNewReleases, 
  Game as APIGame
} from "../../services/rawgApi";

const Container = styled.div`
  margin-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) => (props.active ? props.theme.colors.buttonText : props.theme.colors.text)};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${(props) =>
      props.active
        ? props.theme.colors.secondary
        : props.theme.colors.primary + '20'};
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const NoGames = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const LoadMoreButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  margin: 2rem auto;
  display: block;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

// Define the game status types
type GameStatus = "playing" | "completed" | "backlog" | "all";
type ViewType = "all" | "library" | "popular" | "new";

// Game type with additional user data
interface Game extends APIGame {
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
  const [statusFilter, setStatusFilter] = useState<GameStatus>("all");
  const [viewType, setViewType] = useState<ViewType>("popular");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch games from API
  const fetchGamesData = async (view: ViewType, pageNum: number, query = "") => {
    setLoading(true);
    try {
      let response;
      
      if (query) {
        response = await searchGames(query, pageNum);
      } else if (view === "new") {
        response = await getNewReleases(pageNum);
      } else {
        response = await getPopularGames(pageNum);
      }

      if (pageNum === 1) {
        setGames(response.results);
      } else {
        setGames((prevGames) => [...prevGames, ...response.results]);
      }

      setHasMore(!!response.next);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial games
  useEffect(() => {
    fetchGamesData("popular", 1);
  }, []);

  // Mock user library data - in a real app this would come from your backend
  useEffect(() => {
    // This would normally be an API call to get the user's library
    setUserLibrary([
      { gameId: 3498, status: "completed", lastPlayed: "2023-04-15" },
      { gameId: 4200, status: "playing", lastPlayed: "2023-05-20" },
      { gameId: 5286, status: "backlog", lastPlayed: null },
    ]);
  }, []);

  const combinedGames = games?.map((game) => {
    const userGame = userLibrary.find((ug) => ug.gameId === game.id);
    if (userGame) {
      return {
        ...game,
        status: userGame.status,
        lastPlayed: userGame.lastPlayed,
      };
    }
    return game;
  }) || [];
  

  // Filter games based on status if in library view
  const filteredGames =
    viewType === "library" && statusFilter !== "all"
      ? combinedGames.filter((game) => game.status === statusFilter)
      : viewType === "library"
      ? combinedGames.filter((game) => game.status)
      : combinedGames;

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      setPage(1);
      fetchGamesData("all", 1, searchQuery);
    }
  }, [searchQuery]);

  // Handle view type change
  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    setPage(1);
    
    if (view !== "library" && !searchQuery) {
      fetchGamesData(view, 1);
    }
  };

// Add/update game in user library
const handleStatusChange = (gameId: number, status: GameStatus) => {
  // First update the user library
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

  // Then immediately update the UI by updating the games state
  setGames((prevGames) => 
    prevGames.map(game => 
      game.id === gameId 
        ? { ...game, status, lastPlayed: status === "playing" ? new Date().toISOString() : null }
        : game
    )
  );

  // If we're in library view, make sure to reset to "all" filter to see the newly added game
  if (viewType === "library" && !userLibrary.find(game => game.gameId === gameId)) {
    setStatusFilter("all");
  }

  // In a real app, you would also update this on your backend
  console.log(`Game ${gameId} status changed to ${status}`);
};

  // Load more games
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    if (searchQuery) {
      fetchGamesData("all", nextPage, searchQuery);
    } else {
      fetchGamesData(viewType, nextPage);
    }
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
          active={viewType === "popular" && !searchQuery}
          onClick={() => handleViewChange("popular")}
        >
          Popular Games
        </FilterButton>
        <FilterButton
          active={viewType === "new" && !searchQuery}
          onClick={() => handleViewChange("new")}
        >
          New Releases
        </FilterButton>
        <FilterButton
          active={viewType === "library"}
          onClick={() => handleViewChange("library")}
        >
          My Library
        </FilterButton>
        
        {viewType === "library" && (
          <>
            <FilterButton
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={statusFilter === "playing"}
              onClick={() => setStatusFilter("playing")}
            >
              Playing
            </FilterButton>
            <FilterButton
              active={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </FilterButton>
            <FilterButton
              active={statusFilter === "backlog"}
              onClick={() => setStatusFilter("backlog")}
            >
              Backlog
            </FilterButton>
          </>
        )}
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
                onStatusChange={handleStatusChange}
              />
            ))}
          </GamesGrid>

          {hasMore && !loading && (
            <LoadMoreButton onClick={handleLoadMore}>
              Load More Games
            </LoadMoreButton>
          )}
          
          {loading && page > 1 && (
            <LoadingSpinner>Loading more games...</LoadingSpinner>
          )}
        </>
      ) : (
        <NoGames>
          {searchQuery
            ? "No games found matching your search."
            : viewType === "library"
            ? statusFilter !== "all"
              ? `No games in the "${statusFilter}" category.`
              : "Your library is empty. Try adding some games!"
            : "No games available. Try different filters."}
        </NoGames>
      )}
    </Container>
  );
};

export default GameLibrary;