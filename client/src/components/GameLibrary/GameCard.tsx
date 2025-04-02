// src/components/GameLibrary/GameCard.tsx
// Fix the issue with backgroundHover property

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Game } from "../../services/rawgApi";

type GameStatus = "playing" | "completed" | "backlog" | "all";

interface GameCardProps {
  game: Game & {
    status?: GameStatus;
    lastPlayed?: string | null;
  };
  onStatusChange: (gameId: number, status: GameStatus) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onStatusChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: GameStatus) => {
    onStatusChange(game.id, newStatus);
    setDropdownOpen(false);
  };

  // Format date for display
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
        <GameTitle>{game.name}</GameTitle>

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

      <DropdownContainer ref={dropdownRef}>
        <ActionButton onClick={() => setDropdownOpen(!dropdownOpen)}>
          {game.status ? game.status : "Add to Library"} <DropdownArrow>▾</DropdownArrow>
        </ActionButton>

        {dropdownOpen && (
          <DropdownMenu>
            <StatusOption onClick={() => handleStatusChange("playing")}>
              <StatusIcon status="playing">▶️</StatusIcon> Currently Playing
            </StatusOption>
            <StatusOption onClick={() => handleStatusChange("completed")}>
              <StatusIcon status="completed">✅</StatusIcon> Completed
            </StatusOption>
            <StatusOption onClick={() => handleStatusChange("backlog")}>
              <StatusIcon status="backlog">📋</StatusIcon> Add to Backlog
            </StatusOption>
          </DropdownMenu>
        )}
      </DropdownContainer>
    </Card>
  );
};

// Styled components...
const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
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
  padding: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const GameTitle = styled.h3`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props) => {
    switch (props.status) {
      case "playing":
        return props.theme.colors.success;
      case "completed":
        return props.theme.colors.primary;
      case "backlog":
        return props.theme.colors.warning;
      default:
        return props.theme.colors.info;
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
`;

const MetaInfo = styled.div`
  margin-top: auto;
`;

const ReleaseDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PlatformList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PlatformBadge = styled.div`
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Rating = styled.div<{ score: number }>`
  display: inline-block;
  background-color: ${(props) => {
    if (props.score >= 80) return props.theme.colors.success;
    if (props.score >= 60) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  margin-right: 0.5rem;
`;

const LastPlayed = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-top: auto;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DropdownArrow = styled.span`
  margin-left: 5px;
  transition: transform 0.3s ease;
`;

const DropdownMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: none;
  border-radius: ${({ theme }) => `${theme.borderRadius} ${theme.borderRadius} 0 0`};
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
`;

const StatusOption = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.small};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const StatusIcon = styled.span<{ status: string }>`
  font-size: 16px;
`;

export default GameCard;