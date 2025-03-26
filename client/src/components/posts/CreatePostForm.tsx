// src/components/Post/CreatePostForm.tsx
import React, { useState } from "react";
import styled from "styled-components";
import GameSearchBar from "../GameLibrary/GameSearchBar";

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textColor};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryColor};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColorLight};
  }
`;

const OptionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GameTagContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const GameTag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.tagBackground};
  color: ${({ theme }) => theme.tagText};
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  margin-left: 1rem;
  font-size: 0.9rem;
`;

const GameIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textColorSecondary};
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.dangerColor};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};

  &:hover {
    background-color: ${({ theme }) => theme.buttonBackgroundHover};
  }
`;

const PostButton = styled(Button)`
  background-color: ${({ theme }) => theme.primaryColor};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.primaryColorDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.disabledColor};
    cursor: not-allowed;
  }
`;

const SearchGameContainer = styled.div`
  margin-bottom: 1rem;
`;

interface Game {
  id: number;
  name: string;
  background_image: string;
}

const CreatePostForm: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isSearchingGame, setIsSearchingGame] = useState(false);
  const [gameSearchQuery, setGameSearchQuery] = useState("");
  const [gameSearchResults, setGameSearchResults] = useState<Game[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    // In a real app, you would send this data to your API
    console.log({
      content,
      gameId: selectedGame?.id,
      gameName: selectedGame?.name,
    });

    // Reset form
    setContent("");
    setSelectedGame(null);
  };

  const searchGames = async (query: string) => {
    if (!query) {
      setGameSearchResults([]);
      return;
    }

    // In a real app, you would call your API or the RAWG API
    // Mock data for demonstration
    setGameSearchResults([
      {
        id: 1,
        name: "The Witcher 3",
        background_image: "https://via.placeholder.com/60",
      },
      {
        id: 2,
        name: "Elden Ring",
        background_image: "https://via.placeholder.com/60",
      },
    ]);
  };

  const handleGameSearch = (query: string) => {
    setGameSearchQuery(query);
    searchGames(query);
  };

  const selectGame = (game: Game) => {
    setSelectedGame(game);
    setIsSearchingGame(false);
    setGameSearchQuery("");
    setGameSearchResults([]);
  };

  return (
    <FormContainer>
      <TextArea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <OptionsBar>
        <button
          onClick={() => setIsSearchingGame(!isSearchingGame)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
          }}
        >
          🎮 Tag a game
        </button>

        <GameTagContainer>
          {selectedGame && (
            <GameTag>
              <GameIcon
                src={selectedGame.background_image}
                alt={selectedGame.name}
              />
              {selectedGame.name}
              <RemoveButton onClick={() => setSelectedGame(null)}>
                ×
              </RemoveButton>
            </GameTag>
          )}
        </GameTagContainer>
      </OptionsBar>

      {isSearchingGame && (
        <SearchGameContainer>
          <GameSearchBar
            searchQuery={gameSearchQuery}
            setSearchQuery={handleGameSearch}
          />

          {gameSearchResults.length > 0 && (
            <div style={{ marginTop: "0.5rem" }}>
              {gameSearchResults.map((game) => (
                <div
                  key={game.id}
                  style={{
                    padding: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                  onClick={() => selectGame(game)}
                >
                  <img
                    src={game.background_image}
                    alt={game.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "0.5rem",
                      borderRadius: "4px",
                    }}
                  />
                  {game.name}
                </div>
              ))}
            </div>
          )}
        </SearchGameContainer>
      )}

      <ButtonContainer>
        <CancelButton
          onClick={() => {
            setContent("");
            setSelectedGame(null);
          }}
        >
          Cancel
        </CancelButton>
        <PostButton onClick={handleSubmit} disabled={!content.trim()}>
          Post
        </PostButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default CreatePostForm;
