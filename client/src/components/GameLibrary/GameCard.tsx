// src/components/GameLibrary/GameCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CoverImage = styled.div<{ image: string }>`
  height: 200px;
  background-image: url(${(props) => props.image || "/placeholder-game.jpg"});
  background-size: cover;
  background-position: center;
`;

const GameInfo = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const GameTitle = styled(Link)`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props) => {
    switch (props.status) {
      case "playing":
        return props.theme.successColor || "green";
      case "completed":
        return props.theme.primaryColor || "blue";
      case "backlog":
        return props.theme.warningColor || "orange";
      default:
        return props.theme.mutedColor || "gray";
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const MetaInfo = styled.div`
  margin-top: auto;
`;

const ReleaseDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textColorSecondary};
  margin-bottom: 0.5rem;
`;

const PlatformList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const PlatformBadge = styled.div`
  background-color: ${({ theme }) => theme.tagBackground};
  color: ${({ theme }) => theme.tagText};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const Rating = styled.div<{ score: number }>`
  display: inline-block;
  background-color: ${(props) => {
    if (props.score >= 80) return props.theme.successColor || "green";
    if (props.score >= 60) return props.theme.warningColor || "orange";
    return props.theme.dangerColor || "red";
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const LastPlayed = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textColorSecondary};
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 0 0 10px 10px;
  padding: 0.75rem 0;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonBackgroundHover};
  }
`;

const StatusMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
`;

const StatusOption = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  }
`;

type GameStatus = "playing" | "completed" | "backlog" | "all";

interface Game {
  id: number;
  name: string;
  background_image?: string;
  released?: string;
  metacritic?: number;
  platforms?: Array<{
    platform: {
      id: number;
      name: string;
    };
  }>;
  status?: GameStatus;
  lastPlayed?: string | null;
}

interface GameCardProps {
  game: Game;
  onStatusChange: (status: GameStatus) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onStatusChange }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = (newStatus: GameStatus) => {
    onStatusChange(newStatus);
    setShowStatusMenu(false);
  };

  const formatLastPlayed = (date: string | null) => {
    if (!date) return "Never played";
    return `Last played: ${new Date(date).toLocaleDateString()}`;
  };

  // Get the first 3 platforms to display
  const displayPlatforms = game.platforms
    ? game.platforms.slice(0, 3).map((p) => p.platform.name)
    : [];

  return (
    <Card>
      {game.status && (
        <StatusBadge status={game.status}>
          {game.status === "playing"
            ? "Playing"
            : game.status === "completed"
            ? "Completed"
            : game.status === "backlog"
            ? "Backlog"
            : ""}
        </StatusBadge>
      )}

      <CoverImage image={game.background_image || ""} />

      <GameInfo>
        <GameTitle to={`/games/${game.id}`}>{game.name}</GameTitle>

        <MetaInfo>
          {game.released && (
            <ReleaseDate>
              Released: {new Date(game.released).getFullYear()}
            </ReleaseDate>
          )}

          <PlatformList>
            {displayPlatforms.map((platform, index) => (
              <PlatformBadge key={index}>{platform}</PlatformBadge>
            ))}
            {game.platforms && game.platforms.length > 3 && (
              <PlatformBadge>+{game.platforms.length - 3}</PlatformBadge>
            )}
          </PlatformList>

          {game.metacritic && (
            <Rating score={game.metacritic}>{game.metacritic}</Rating>
          )}

          {game.status && game.lastPlayed && (
            <LastPlayed>{formatLastPlayed(game.lastPlayed)}</LastPlayed>
          )}
        </MetaInfo>
      </GameInfo>

      <ActionButton onClick={() => setShowStatusMenu(!showStatusMenu)}>
        {game.status ? "Change Status" : "Add to Library"}
      </ActionButton>

      {showStatusMenu && (
        <StatusMenu>
          <StatusOption onClick={() => handleStatusChange("playing")}>
            Currently Playing
          </StatusOption>
          <StatusOption onClick={() => handleStatusChange("completed")}>
            Completed
          </StatusOption>
          <StatusOption onClick={() => handleStatusChange("backlog")}>
            Add to Backlog
          </StatusOption>
        </StatusMenu>
      )}
    </Card>
  );
};

export default GameCard;
